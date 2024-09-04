import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: {
      type: String,
      default:
        "https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
