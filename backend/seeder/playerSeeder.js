import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "../models/Player.js";
import { players } from "./playersSeedData.js"; // this file will contain the array above

dotenv.config();

async function seedPlayers() {
  try {
    await mongoose.connect("mongodb+srv://saxenasaksham111612_db_user:ss7_Dhoni@cluster0.6zu7qzw.mongodb.net/?appName=Cluster0");
    console.log("MongoDB Connected");

    await Player.deleteMany({});
    console.log("Old players removed");

    await Player.insertMany(players);
    console.log("Players seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedPlayers();
