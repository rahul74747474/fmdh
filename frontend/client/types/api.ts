// src/types/api.ts

/* ----------------------------- PLAYER ----------------------------- */

export interface Player {
  _id: string;
  name: string;
  phone: string;
  email?: string;
}



/* ----------------------------- MATCH PLAYER ENTRY ----------------------------- */

export interface MatchPlayerEntry {
  player: Player;

  // Whether player pays these fees
  payMatchFee: boolean;
  payFoodFee: boolean;

  // Fee amounts assigned by backend (calculated on create)
  matchFeeAmount: number;
  foodFeeAmount: number;

  // Payment tracking
  paid: number;
  remaining: number;

  // totalAmount = matchFeeAmount + foodFeeAmount
  totalAmount: number;
}



/* ----------------------------- MATCH ----------------------------- */

export interface Match {
  _id: string;
  title: string;
  date: string;

  matchFees: number;
  foodFees: number;

  players: MatchPlayerEntry[];
}



/* ----------------------------- CREATE MATCH PAYLOAD ----------------------------- */

export interface CreateMatchPayload {
  title: string;
  date: string;
  matchFees: number;
  foodFees: number;

  selectedPlayers: {
    playerId: string;
    payMatchFee: boolean;
    payFoodFee: boolean;
  }[];
}



/* ----------------------------- PAYMENT PAYLOAD ----------------------------- */

export interface AddPaymentPayload {
  matchId: string;   // <-- ADD THIS
  playerId: string;
  amount: number;
}




/* ----------------------------- SETTINGS ----------------------------- */

export interface SettingsData {
  teamName: string;
  teamEmail: string;
  teamPhone: string;

  upiId: string; // finance settings

  whatsappToken: string;
  whatsappPhoneId: string;
}
