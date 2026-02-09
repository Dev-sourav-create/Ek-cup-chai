import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    firstname: String,
    lastname: String,
    imageUrl: String,
    bio: { type: String, default: "" },
    country: { type: String, default: "" },
    upiId: { type: String, default: "" },
    qrImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
