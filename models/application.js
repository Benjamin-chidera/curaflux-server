import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Shifts",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  hasApplied: {
    type: Boolean,
    default: false,
  },
});

export const Application = mongoose.model("Application", ApplicationSchema);
