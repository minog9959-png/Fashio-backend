import Cart from "../models/Cart.js";
//Create Cart
export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const user = req.user.id;

    // Check if product already exists in user's cart
    const existingCartItem = await Cart.findOne({
      user,
      product,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;

      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart quantity updated",
        cartItem: existingCartItem,
      });
    }

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

//Get Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await Cart.find({ user: userId })
      .populate("product")
      .populate("user");

    res.status(200).json({
      success: true,
      count: cartItems.length,
      cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Cart:
export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete cart:
export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};