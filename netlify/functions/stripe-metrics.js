exports.handler = async (event, context) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Fetch all Stripe data in parallel
    const [balance, charges, paymentIntents, customers] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.charges.list({ limit: 50 }),
      stripe.paymentIntents.list({ limit: 50 }),
      stripe.customers.list({ limit: 50 })
    ]);

    // Calculate metrics
    const totalRevenue = charges.data
      .filter(charge => charge.status === 'succeeded')
      .reduce((sum, charge) => sum + charge.amount, 0) / 100;

    const totalOrders = charges.data.filter(charge => charge.status === 'succeeded').length;
    const cancelledOrders = charges.data.filter(charge => charge.status === 'canceled').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          newOrders: totalOrders,
          cancellations: cancelledOrders,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          monthlyIncome: Math.round(totalRevenue * 100) / 100,
          balance: balance.available[0]?.amount / 100 || 0,
          currency: balance.available[0]?.currency?.toUpperCase() || 'USD',
          totalCustomers: customers.data.length,
          totalSessions: paymentIntents.data.length
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
