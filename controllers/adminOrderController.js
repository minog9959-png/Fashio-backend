import { getMessaging } from "firebase-admin/messaging";
import firebaseAdmin from "../firebaseAdmin.js";
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
  console.log("🔥🔥🔥 ADMIN UPDATE ORDER STATUS 🔥🔥🔥");

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

    // Get order + user because we need user's FCM token
    const order = await Order.findById(id).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("========== FCM TEST ==========");
    console.log("Order User:", order.user);
    console.log("FCM Token:", order.user?.fcmToken);
    console.log("New Status:", status);

    // Update order status
    order.status = status;

    await order.save();

    console.log("Order updated:", order._id, order.status);

    // 🔔 Firebase Push Notification
    if (order.user?.fcmToken) {
      try {
        console.log("📤 Sending FCM notification...");

        const response = await getMessaging(firebaseAdmin).send({
          token: order.user.fcmToken,

          notification: {
            title: "Order Status Updated 📦",
            body: `Your order status is now: ${status}`,
          },

          data: {
            orderId: order._id.toString(),
            status: status,
          },
        });

        console.log("✅ FCM message sent:", response);

      } catch (notificationError) {
        console.error(
          "❌ Push notification error:",
          notificationError.message
        );
      }
    } else {
      console.log("⚠️ User does not have an FCM token");
    }

    // 🔴 Existing Socket.IO notification
    const io = req.app.get("io");

    console.log("IO OBJECT:", !!io);
    console.log("Sending socket update to:", `user_${order.user._id}`);

    if (io && order.user?._id) {
  io.to(`user_${order.user._id}`).emit("orderStatusUpdated", {
    orderId: order._id.toString(),
    status: order.status,
    message: `Order status updated to ${order.status}`,
  });

  console.log("✅ Socket status update sent");
}

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

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