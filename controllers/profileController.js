import Form from "../models/Form.js";

// ===============================
// Get User Profile
// ===============================
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await Form.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

// ===============================
// Update User Profile
// ===============================

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;

    // Check required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if user exists
    const user = await Form.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if email is already being used by another user
    const existingUser = await Form.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered with another account",
      });
    }

    // Update profile
    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.phone = phone ? phone.trim() : "";

    await user.save();

    //  Don't send password in response
    const updatedUser = await Form.findById(userId).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};
