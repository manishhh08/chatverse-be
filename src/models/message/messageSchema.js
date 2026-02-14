import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaiType: {
      type: String,
      enum: ["image", "video", "audio", "file"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
