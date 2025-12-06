import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false }
  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);
