// Serverless function: Stripe metrics
// Works on Vercel (exports default handler) and Netlify (exports handler)
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

async function getMetrics() {
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
    created: { gte: thirtyDaysAgo, lte: now },
  });
  const succeeded = paymentIntents.data.filter((pi) => pi.status === 'succeeded');
  const totalAmountCents = succeeded.reduce((sum, pi) => sum + (pi.amount_received || 0), 0);
  const ordersCount = succeeded.length;
  const averageOrderCents = ordersCount > 0 ? Math.round(totalAmountCents / ordersCount) : 0;
  return {
    totalRevenue: totalAmountCents / 100,
    newOrders: ordersCount,
    cancellations: 0,
    averageOrderValue: averageOrderCents / 100,
    monthlyIncome: totalAmountCents / 100,
  };
}

async function handler(req, res) {
  try {
    const data = await getMetrics();
    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({
      totalRevenue: 0,
      newOrders: 0,
      cancellations: 0,
      averageOrderValue: 0,
      monthlyIncome: 0,
      error: 'metrics_failed',
    });
  }
}

module.exports = handler;
module.exports.handler = async (event, context) => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const data = await getMetrics();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ totalRevenue: 0, newOrders: 0, cancellations: 0, averageOrderValue: 0, monthlyIncome: 0, error: 'metrics_failed' }) };
  }
};
