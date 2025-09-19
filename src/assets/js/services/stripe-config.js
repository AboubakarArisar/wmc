// Stripe Configuration
// Uses environment variables for security
const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  //   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// For client-side, only use the publishable key
export const STRIPE_PUBLISHABLE_KEY = STRIPE_CONFIG.publishableKey;

// Note: Secret key should only be used on server-side
// For this demo, we'll simulate Stripe data
export default STRIPE_CONFIG;
