import express from "express";
import {
  authMiddleware,
  refreshMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createUserValidation,
  loginValidation,
  verifyUserValidation,
} from "../middleware/joiMiddleware.js";
import {
  createNewUser,
  loginUser,
  refreshToken,
  verifyCustomer,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", createUserValidation, createNewUser);
router.post("/login", loginValidation, loginUser);
router.post("/verify", verifyUserValidation, verifyCustomer);

router.get("/refresh-token", refreshMiddleware, refreshToken);
export default router;
