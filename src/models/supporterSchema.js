import mongoose from "mongoose";

const supporterSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    creatorUsername: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, default: "" },
    message: { type: String, default: "" },
    amount: { type: Number, required: true },
    chaiCount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    isPrivate: { type: Boolean, default: false },
    paymentProvider: { type: String, default: "UPI" },
    status: {
      type: String,
      enum: ["initiated", "paid", "failed"],
      default: "initiated",
    },
  },
  { timestamps: true },
);

supporterSchema.index({ creatorId: 1, createdAt: -1 });

const Supporter =
  mongoose.models.Supporter || mongoose.model("Supporter", supporterSchema);

export default Supporter;
