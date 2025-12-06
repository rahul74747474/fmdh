// routes/matches.js
import express from "express";
import { createMatch, getMatch, addPayment, getMatches } from "../controllers/matchController.js";

const router = express.Router();

router.get("/", getMatches);            // <-- list all matches
router.post("/", createMatch);
router.get("/:id", getMatch);
router.post("/:id/payments", addPayment);

export default router;
