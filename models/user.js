import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
    },
    fullName: { type: String, required: true },
    nickName: { type: String, required: true },
    birthdate: { type: String },
    gender: { type: String },
    photo: {
      type: String,
    },
    role: { type: String, default: "locum" },
    phoneNumber: { type: String },
    linkedInUrl: { type: String },
    identificationType: { type: String },
    identificationNumber: { type: String },
    identificationDocument: { type: String },
    // User profile

    specialty: { type: String },
    experience: { type: Number },
    bio: { type: String },
    certifications: {
      type: [String],
    },
    availableWork: { type: String },
    availableTime: { type: String },
    address: { type: String },
    nmcnNumber: { type: String },
    mdcnNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
