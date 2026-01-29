import { findChatById } from "../models/chats/chatModel.js";
import {
  getMessagesByChat,
  newMessage,
} from "../models/message/messageModel.js";
import { getIO } from "../utils/socketSetup.js";

//TODO: function to send images as well in messages.
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user._id;

    const message = await newMessage({ chatId, senderId, text });
    await message.populate("senderId", "username email firstName lastName");

    const chat = await findChatById(chatId);
    chat.messages.push(message._id);

    chat.updatedAt = new Date();
    await chat.save();

    // Emit to all connected clients in the chat room
    getIO().to(chatId).emit("receive_message", message);

    res.status(201).json({ status: "success", message });
  } catch (err) {
    console.error(err);
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
      "username email firstName lastName",
    );

    res.status(200).json({ status: "success", messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
