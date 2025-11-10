import { getAllUsers, updateById } from "../models/users/userModel.js";

export const getUserDetail = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    return res.json({
      status: "success",
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve user details",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await getAllUsers(currentUserId);
    res.json({ status: "success", users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to fetch users" });
  }
};

export const updateUserDetail = async (req, res) => {
  try {
    const userId = req.user?._id;
    const updateObj = req.body;

    if (!userId) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }
    const updatedUser = await updateById(userId, updateObj, { new: true });

    return res.json({
      status: "success",
      message: "User details updated successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to update user details",
    });
  }
};
