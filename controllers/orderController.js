import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { user, items, totalPrice } = req.body;

    const order = new Order({
      user,
      items,
      totalPrice,
    });

    await order.save();

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