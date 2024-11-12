import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model("Group", GroupSchema);
