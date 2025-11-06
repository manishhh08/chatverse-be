import express from "express";
import { getAllUser, getUserDetail } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", authMiddleware, getUserDetail);
router.get("/all", authMiddleware, getAllUser);
export default router;
