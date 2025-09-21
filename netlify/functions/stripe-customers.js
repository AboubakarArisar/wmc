exports.handler = async (event, context) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const customers = await stripe.customers.list({ limit: 10 });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: customers.data,
        count: customers.data.length
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
