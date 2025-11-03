import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Chat", chatSchema);
