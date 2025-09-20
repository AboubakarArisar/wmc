// Stripe Configuration - LIVE KEYS
// This file uses LIVE Stripe keys for both development and production

// Live Stripe Configuration
const STRIPE_CONFIG = {
  // Replace these with your actual LIVE keys from .env
  publishableKey: "pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE", // Replace with your live publishable key
  secretKey: "sk_live_YOUR_COMPLETE_LIVE_SECRET_KEY_HERE", // Replace with your complete live secret key
  // Note: Secret key should only be used on server-side for security
  // For client-side, only use the publishable key
};

// For client-side, only expose the publishable key
const STRIPE_PUBLISHABLE_KEY = STRIPE_CONFIG.publishableKey;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STRIPE_CONFIG, STRIPE_PUBLISHABLE_KEY };
} else {
  // Browser environment
  window.STRIPE_CONFIG = STRIPE_CONFIG;
  window.STRIPE_PUBLISHABLE_KEY = STRIPE_PUBLISHABLE_KEY;
}
