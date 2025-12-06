// routes/players.js
import express from "express";
import Player from "../models/Player.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const all = await Player.find().sort({ name: 1 });
  res.json(all);
});

router.post("/", async (req, res) => {
  const p = await Player.create(req.body);
  res.status(201).json(p);
});

// DELETE player
router.delete("/:id", async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
