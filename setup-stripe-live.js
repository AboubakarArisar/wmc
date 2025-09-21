// #!/usr/bin/env node

// // Setup script for Stripe Live Keys
// // Run this with: node setup-stripe-live.js

// const fs = require('fs');
// const path = require('path');

// console.log('🔧 Setting up Stripe LIVE keys...\n');

// // Read current .env file
// const envPath = path.join(__dirname, '.env');
// let envContent = '';

// if (fs.existsSync(envPath)) {
//     envContent = fs.readFileSync(envPath, 'utf8');
// }

// // Update with live keys
// const liveEnvContent = `# Stripe Configuration - LIVE KEYS
// # Replace these with your actual LIVE keys from Stripe Dashboard
// STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE
// STRIPE_SECRET_KEY=sk_live_YOUR_COMPLETE_LIVE_SECRET_KEY_HERE
// STRIPE_LIVE_KEY=sk_live_YOUR_COMPLETE_LIVE_SECRET_KEY_HERE

// # Instructions:
// # 1. Go to https://dashboard.stripe.com/apikeys
// # 2. Copy your LIVE publishable key (starts with pk_live_)
// # 3. Copy your LIVE secret key (starts with sk_live_)
// # 4. Replace the placeholder values above
// # 5. Update the keys in src/assets/js/services/stripe-service.js
// # 6. Update the keys in src/assets/js/services/stripe-config.js
// `;

// fs.writeFileSync(envPath, liveEnvContent);

// console.log('✅ .env file updated with LIVE key placeholders');
// console.log('📝 Next steps:');
// console.log('   1. Get your LIVE keys from: https://dashboard.stripe.com/apikeys');
// console.log('   2. Update .env file with your actual keys');
// console.log('   3. Update stripe-service.js with your secret key');
// console.log('   4. Update stripe-config.js with your publishable key');
// console.log('\n🚀 Your dashboard will now use LIVE Stripe data!');
