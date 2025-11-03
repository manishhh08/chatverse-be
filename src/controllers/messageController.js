import { findChatById } from "../models/chats/chatModel.js";
import {
  getMessagesByChat,
  newMessage,
} from "../models/message/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user._id;

    if (!chatId || !text) {
      return res.status(400).json({
        status: "error",
        message: "chatId and text are required",
      });
    }

    const message = await newMessage({ chatId, senderId, text });

    const chat = await findChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: "error",
        message: "Chat not found",
      });
    }

    chat.messages.push(message._id);
    await chat.save();

    await message.populate("senderId", "username email");

    res.status(201).json({ status: "success", message });
  } catch (err) {
    console.error("Show me the error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({
        status: "error",
        message: "chatId is required",
      });
    }

    const messages = await getMessagesByChat({ chatId }).populate(
      "senderId",
      "username email"
    );

    res.status(200).json({ status: "success", messages });
  } catch (err) {
    console.error("Error fetching messsages:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
