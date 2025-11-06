import { findByFilter, newUser } from "../models/users/userModel.js";
import { decodeFunction, encodeFunction } from "../utils/encodeHelper.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";

export const createNewUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const existingUser = await findByFilter({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message:
        existingUser.email === email
          ? "Email is already registered"
          : "Username is already taken",
    });
  }
  const hashedPassword = encodeFunction(password);
  try {
    const user = await newUser({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
    if (user) {
      return res
        .status(200)
        .json({ status: "success", message: "User created successfully" });
    } else {
      console.log("User created failed:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Error creating user" });
    }
  } catch (error) {
    console.log("error here:", error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: "error",
        message: `${duplicateField} already exists`,
      });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await findByFilter({ email });
    if (user) {
      const result = decodeFunction(password, user.password);
      let payload = {
        email: user.email,
      };
      let accessToken = createAccessToken(payload);
      let refreshToken = createRefreshToken(payload);
      if (result) {
        return res.status(200).json({
          status: "success",
          message: "Login Successful",
          user,
          accessToken,
          refreshToken,
        });
      } else {
        return res
          .status(500)
          .json({ status: "error", message: "Invalid credentials" });
      }
    } else {
      return res.json({
        status: "error",
        message: "User Not found",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error" });
  }
};

export const refreshToken = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid refresh token" });
    }
    let payload = { email: req.user.email };
    // create new access token
    let accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    return res.send({
      status: "success",
      message: "New access token generated",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error" });
  }
};
