import Form from "../models/Form.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await Form.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

//User Delete

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await Form.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};