import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
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
      default:
        "https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phoneNumber: { type: String },
    linkedInUrl: { type: String },
    identificationType: { type: String },
    identificationNumber: { type: String },
    identificationDocument: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
