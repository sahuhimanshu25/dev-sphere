import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: {
        type: String,
        enum: ["text", "image", "video"],
        required: [true, "select Post Type cannot be empty"],
      },
      value: {
        type: String,
        required: [true, "Post cannot be empty"],
      },
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);
postSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export const Post = new mongoose.model("Post", postSchema);