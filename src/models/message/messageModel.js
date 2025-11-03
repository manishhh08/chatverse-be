import Message from "./messageSchema.js";

// Send a new message
export const newMessage = (messageObject) => {
  return Message.create(messageObject);
};

// Get messages by chat
export const getMessagesByChat = (filter) => {
  return Message.find(filter).sort({ createdAt: 1 });
};

// Find one message by filter
export const findMessageByFilter = (filterObj) => {
  return Message.findOne(filterObj);
};

// Update message by ID
export const updateMessageById = (messageId, updateObj) => {
  return Message.findByIdAndUpdate(messageId, updateObj, { new: true });
};

// Delete message by ID
export const deleteMessageById = (messageId) => {
  return Message.findByIdAndDelete(messageId);
};
