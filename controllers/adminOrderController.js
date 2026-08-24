import Order from "../models/Order.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// order status update
export const updateOrderStatus = async (req, res) => {
  try {
    console.log("UPDATE ORDER STATUS API CALLED");
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("Order updated:", order._id, order.status);

    const io = req.app.get("io");

    console.log("IO OBJECT:", !!io);

    io.to(`user_${order.user}`).emit("orderStatusUpdated", {
      orderId: order._id,
      status: order.status,
      message: `Order status updated to ${order.status}`,
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get oder by Id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "title price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log("Get order details error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};