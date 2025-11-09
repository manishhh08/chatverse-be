import { getAllUsers } from "../models/users/userModel.js";

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
