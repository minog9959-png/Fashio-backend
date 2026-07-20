import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { user, product, quantity } = req.body;

    const cartItem = new Cart({
      user,
      product,
      quantity,
    });

    await cartItem.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartItem,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};