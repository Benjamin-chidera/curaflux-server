import mongoose, { Schema } from "mongoose";

// Define the schema
const ShiftSchema = new Schema(
  {
    adsNote: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    payRate: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    specialRequirement: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
    },

    hospital: {
      type: mongoose.Types.ObjectId,
      ref: "Healthcare",
      required: true,
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],

    shiftSupervisorName: {
      type: String,
      required: true,
    },

    shiftSupervisorPosition: {
      type: String,
      required: true,
    },

    shiftSupervisorEmail: {
      type: String,
      required: true,
    },

    shiftSupervisorPhoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Shifts = mongoose.model("Shifts", ShiftSchema);


