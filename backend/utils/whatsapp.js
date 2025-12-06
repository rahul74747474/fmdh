// utils/whatsapp.js

// FAKE WHATSAPP SENDER (for development)
// --------------------------------------
// No real API call is made.
// It only prints to console.
//
// When you want real API later, I will enable the axios part safely.

export const sendWhatsAppMessage = async (phone, message) => {
  console.log("📨 WhatsApp SENT →", phone);
  console.log("💬 Message:", message);
  return { success: true };
};
