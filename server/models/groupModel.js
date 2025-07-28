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
GroupSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Group = mongoose.model("Group", GroupSchema);
