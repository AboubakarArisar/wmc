exports.handler = async (event, context) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { limit = 50 } = event.queryStringParameters || {};
    
    const charges = await stripe.charges.list({ 
      limit: parseInt(limit),
      expand: ['data.customer', 'data.payment_intent']
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: charges.data,
        count: charges.data.length,
        hasMore: charges.has_more
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
