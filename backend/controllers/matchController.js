// controllers/matchController.js
import Match from "../models/Match.js";
import Player from "../models/Player.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 }).populate("players.player");
    return res.json(matches);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate("players.player");
    return res.json(match);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createMatch = async (req, res) => {
  try {
    const { title, date, matchFees = 0, foodFees = 0, selectedPlayers = [] } = req.body;

    const matchPayers = selectedPlayers.filter(p => p.payMatchFee).length || 1;
    const foodPayers  = selectedPlayers.filter(p => p.payFoodFee).length || 1;

    const perMatch = Number(matchFees) / matchPayers;
    const perFood  = Number(foodFees) / foodPayers;

    const playerEntries = [];
    for (let sp of selectedPlayers) {
      const player = await Player.findById(sp.playerId);
      if (!player) continue;

      const mAmt = sp.payMatchFee ? perMatch : 0;
      const fAmt = sp.payFoodFee  ? perFood  : 0;
      const total = mAmt + fAmt;

      playerEntries.push({
        player: player._id,
        payMatchFee: !!sp.payMatchFee,
        payFoodFee: !!sp.payFoodFee,
        matchFeeAmount: mAmt,
        foodFeeAmount: fAmt,
        totalAmount: total,
        paid: 0,
        remaining: total
      });
    }

    // FIXED — Now saving date also
    const match = await Match.create({
      title,
      date, // <-- Added here
      matchFees,
      foodFees,
      players: playerEntries
    });

    const populated = await Match.findById(match._id).populate("players.player");

    populated.players.forEach(entry => {
      try {
        const player = entry.player;
        const msg = `🏏 ${populated.title}\nHi ${player.name},\nPayable: ₹${entry.totalAmount}\nMatch: ₹${entry.matchFeeAmount}, Food: ₹${entry.foodFeeAmount}`;
        sendWhatsAppMessage(player.phone, msg);
      } catch (e) {
        console.error("WA send failed:", e);
      }
    });

    return res.status(201).json(populated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};


export const addPayment = async (req, res) => {
  try {
    const { playerId, amount } = req.body;
    const { id } = req.params;

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: "Match not found" });

    const entry = match.players.find(x => x.player.toString() === playerId);
    if (!entry) return res.status(404).json({ error: "Player not found in match" });

    entry.paid = (entry.paid || 0) + Number(amount);
    entry.remaining = entry.totalAmount - entry.paid;
    if (entry.remaining < 0) entry.remaining = 0;

    await match.save();

    const updated = await Match.findById(id).populate("players.player");

    // Send WA confirmation (non-blocking)
    try {
      const player = updated.players.find(x => x.player._id.toString() === playerId).player;
      const pEntry = updated.players.find(x => x.player._id.toString() === playerId);
      const msg = `💰 Payment received\nPaid: ₹${amount}\nRemaining: ₹${pEntry.remaining}`;
      sendWhatsAppMessage(player.phone, msg);
    } catch (e) {
      console.error("WA send failed:", e);
    }

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};
