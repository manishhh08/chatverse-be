import express from "express";
import {
  getAllUser,
  getUserDetail,
  updateUserDetail,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", authMiddleware, getUserDetail);
router.get("/all", authMiddleware, getAllUser);
router.patch("/detail", authMiddleware, updateUserDetail);
export default router;
