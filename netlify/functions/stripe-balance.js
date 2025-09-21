exports.handler = async (event, context) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const balance = await stripe.balance.retrieve();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          available: balance.available[0]?.amount / 100 || 0,
          pending: balance.pending[0]?.amount / 100 || 0,
          currency: balance.available[0]?.currency?.toUpperCase() || 'USD',
          instantAvailable: balance.instant_available[0]?.amount / 100 || 0
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
