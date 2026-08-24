import Order from "../models/Order.js";
import Product from "../models/Product.js";

import { getMessaging } from "firebase-admin/messaging";
import firebaseAdmin from "../firebaseAdmin.js";

// export const createOrder = async (req, res) => {
//   try {
//     const { user, items, totalPrice } = req.body;

//     const order = new Order({
//       user,
//       items,
//       totalPrice,
//     });

//     await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { user, items, totalPrice } = req.body;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      });
    }

    const order = new Order({
      user,
      items: orderItems,
      totalPrice,
    });

    await order.save();

    // 🔔 Real-time admin notification
    const io = req.app.get("io");

    io.emit("newOrder", {
      orderId: order._id,
      userId: order.user,
      message: "New order received!",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get Order
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    })
      .populate("user")
      .populate("items.product");

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

//update order:
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     order.status = status;

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       order,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//updated firbase order
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

    // 🔔 Send Firebase Push Notification
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

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.error("Update Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};