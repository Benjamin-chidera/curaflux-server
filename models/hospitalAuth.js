import mongoose, { Schema } from "mongoose";

const hospitalAuthSchema = new Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    hospitalType: {
      type: String,
      required: true,
    },
    LicenseNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HospitalAuth = mongoose.model("HospitalAuth", hospitalAuthSchema);
