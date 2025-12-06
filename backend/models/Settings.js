// models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  teamName: { type: String, default: "" },
  teamEmail: { type: String, default: "" },
  teamPhone: { type: String, default: "" },
  upiId: { type: String, default: "" },
  whatsappToken: { type: String, default: "" },
  whatsappPhoneId: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);
