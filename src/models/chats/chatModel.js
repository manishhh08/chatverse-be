import Chat from "./chatSchema.js";

// Create new chat
export const newChat = (chatObject) => {
  return Chat.create(chatObject);
};

// Get all chats for a user
export const getUserChats = (userId) => {
  return Chat.find({ members: userId }).populate("members", "username email");
};

// Find chat by filter
export const findChatByFilter = (filterObj) => {
  return Chat.findOne(filterObj);
};

// find chat by id
export const findChatById = (chatId) => {
  return Chat.findById(chatId);
};

// Update chat by ID
export const updateChatById = (chatId, updateObj) => {
  return Chat.findByIdAndUpdate(chatId, updateObj, { new: true });
};

// Delete chat by ID
export const deleteChatById = (chatId) => {
  return Chat.findByIdAndDelete(chatId);
};
