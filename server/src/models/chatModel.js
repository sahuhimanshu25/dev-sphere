
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", ChatSchema);