import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
      required: [true, "Message text cannot be empty"],
      trim: true
    },
    isGroup:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);
MessageSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export const Message = mongoose.model("Message", MessageSchema);