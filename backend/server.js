import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",     // local dev
      "https://fmdh.vercel.app"   // your production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

import playersRoutes from "./routes/players.js";
import matchesRoutes from "./routes/matches.js";
import settingsRoutes from "./routes/settings.js";
app.use("/api/players", playersRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/settings", settingsRoutes); 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log("Server running on port", process.env.PORT || 4000)
    );
  })
  .catch((e) => console.log("DB Error:", e));
