import mongoose from "mongoose";

const playerEntry = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  payMatchFee: Boolean,
  payFoodFee: Boolean,
  matchFeeAmount: Number,
  foodFeeAmount: Number,
  totalAmount: Number,
  paid: { type: Number, default: 0 },
  remaining: Number
});

const matchSchema = new mongoose.Schema(
  {
    title: String,
    date: { type: String, required: true },  // <-- IMPORTANT
    matchFees: Number,
    foodFees: Number,
    players: [playerEntry]
  },
  { timestamps: true }
);


export default mongoose.model("Match", matchSchema);
