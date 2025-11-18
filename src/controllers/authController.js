import {
  findByFilter,
  newUser,
  updateById,
} from "../models/users/userModel.js";
import { decodeFunction, encodeFunction } from "../utils/encodeHelper.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";

export const createNewUser = async (req, res) => {
  const { firstName, lastName, username, email, password, phone } = req.body;

  const emailVerify = async (emailDetails) => {
    const emailResult = await transporter.sendMail(emailDetails);
  };
  const randomString = uuidv4();

  const verificationLink = `${config.frontend.domain}/verify?token=${randomString}&email=${email}`;

  const formattedEmail = emailFormatter(
    email,
    "Verify your email",
    firstName,
    verificationLink
  );
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
  await emailVerify(formattedEmail);
  try {
    const user = await newUser({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      phone,
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

      if (!user.verified) {
        return res.status(500).json({
          status: "error",
          message: "Please verify your email to Login",
        });
      }
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

export const verifyCustomer = async (req, res) => {
  try {
    const { token, email } = req.body;
    const user = await findByFilter({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (user.verificationToken === token) {
      // console.log("Verification token sent by user:", token);
      // console.log("Verification token in DB:", user.verificationToken);

      const updateIsVerified = await updateById(user._id, { verified: true });
      if (updateIsVerified)
        return res
          .status(200)
          .json({ status: "success", message: "Verification complete" });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Verification token did not match" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
