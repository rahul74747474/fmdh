// controllers/settingsController.js
import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
};

export const saveSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
};
