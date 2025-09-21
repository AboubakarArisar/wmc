// Stripe Configuration - LIVE KEYS
// This file uses LIVE Stripe keys for both development and production

// Live Stripe Configuration
const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
};

const STRIPE_PUBLISHABLE_KEY = STRIPE_CONFIG.publishableKey;

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STRIPE_CONFIG, STRIPE_PUBLISHABLE_KEY };
} else {
  // Browser environment
  window.STRIPE_CONFIG = STRIPE_CONFIG;
  window.STRIPE_PUBLISHABLE_KEY = STRIPE_PUBLISHABLE_KEY;
}
