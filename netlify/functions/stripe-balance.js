const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  try {
    // Get all successful payments for the last 12 months
    const now = Math.floor(Date.now() / 1000);
    const start = now - 365 * 24 * 60 * 60;
    let payments = [];
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const resp = await stripe.paymentIntents.list({
        created: { gte: start, lte: now },
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter }),
      });
      payments = payments.concat(resp.data);
      hasMore = resp.has_more;
      if (hasMore) startingAfter = resp.data[resp.data.length - 1].id;
    }

    // Group by month
    const monthly = Array(12).fill(0);
    payments.forEach((pi) => {
      const date = new Date(pi.created * 1000);
      const month = date.getMonth(); // 0 = Jan
      if (pi.status === "succeeded") {
        monthly[month] += pi.amount_received / 100;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: { monthlyIncomes: monthly },
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: e.message }),
    };
  }
};
