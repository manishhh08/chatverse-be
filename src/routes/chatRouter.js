import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createChat, getChats } from "../controllers/chatController.js";
import {
  createChatValidation,
  getChatsSchema,
} from "../middleware/joiMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChatValidation, createChat);
router.get("/", authMiddleware, getChatsSchema, getChats);

export default router;
