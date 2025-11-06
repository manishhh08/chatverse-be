import {
  findChatByFilter,
  getUserChats,
  newChat,
} from "../models/chats/chatModel.js";

// Create chat
export const createChat = async (req, res) => {
  try {
    const { members, name, isGroup } = req.body;
    const userId = req.user._id;

    if (!members.includes(userId.toString())) members.push(userId.toString());

    if (!isGroup && members.length === 2) {
      const existingChat = await findChatByFilter({
        isGroup: false,
        members: { $all: members, $size: 2 },
      });

      if (existingChat) {
        return res.status(200).json({
          status: "success",
          chat: existingChat,
          message: "One-on-one chat already exists",
        });
      }
    }

    const chat = await newChat({ members, name, isGroup });
    res.status(201).json({ status: "success", chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Get chats for user
export const getChats = async (req, res) => {
  try {
    const chats = await getUserChats(req.user._id);
    res.json({ status: "success", chats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
