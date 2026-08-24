import Wishlist from "../models/Wishlist.js";
export const addToWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;

    const existingWishlistItem = await Wishlist.findOne({
      user,
      product,
    });

    if (existingWishlistItem) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
      });
    }

    const wishlistItem = new Wishlist({
      user,
      product,
    });

    await wishlistItem.save();

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlistItem,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlistItems = await Wishlist.find({ user: userId })
      .populate("product")
      .populate("user");

    // Find wishlist items whose product has been deleted
    const orphanedItems = wishlistItems.filter(
      (item) => item.product === null
    );

    // Delete orphaned wishlist items from database
    if (orphanedItems.length > 0) {
      await Wishlist.deleteMany({
        _id: { $in: orphanedItems.map((item) => item._id) },
      });
    }

    // Return only valid wishlist items
    const validWishlistItems = wishlistItems.filter(
      (item) => item.product !== null
    );

    res.status(200).json({
      success: true,
      count: validWishlistItems.length,
      wishlistItems: validWishlistItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete wishlist
export const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    const wishlistItem = await Wishlist.findByIdAndDelete(id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};