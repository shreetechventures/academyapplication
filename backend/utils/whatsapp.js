// backend/utils/whatsapp.js
const axios = require("axios");

/**
 * WhatsApp sender with SUCCESS / FAILURE response
 * Works with WhatsAssure API
 *
 * RETURN FORMAT:
 * {
 *   ok: true/false,
 *   mobile: "9876543210",
 *   apiResponse: {},   // provider response
 *   error: "..."       // only if failed
 * }
 */
async function sendWhatsAppMessage(mobile, message) {
  if (!mobile) {
    return {
      ok: false,
      mobile,
      error: "No mobile provided",
    };
  }

  const url = process.env.WHATSASSURE_API_URL;
  const apiKey = process.env.WHATSASSURE_API_KEY;

  if (!url || !apiKey) {
    return {
      ok: false,
      mobile,
      error: "WhatsApp API not configured",
    };
  }

  try {
    const payload = {
      apiKey,     // your real WhatsAssure API key
      mobile,     // e.g. 91xxxxxxxxxx
      message,    // plain text message
    };

    const response = await axios.post(url, payload);

    console.log("WhatsApp message sent successfully →", mobile);

    return {
      ok: true,
      mobile,
      apiResponse: response.data,
    };

  } catch (err) {
    console.error(
      "WhatsApp send error:",
      err.response?.data || err.message
    );

    return {
      ok: false,
      mobile,
      error: err.response?.data || err.message,
    };
  }
}

module.exports = {
  sendWhatsAppMessage,
};
