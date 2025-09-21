const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  try {
    console.log('Fetching monthly payments from Stripe...');
    
    // Get charges from the last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000)
      },
      limit: 1000 // Get more data for better accuracy
    });
    
    console.log(`Found ${charges.data.length} charges`);
    
    // Group charges by month
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach(month => {
      monthlyData[month] = { total: 0, count: 0, avg: 0 };
    });
    
    // Process each charge
    charges.data.forEach(charge => {
      if (charge.status === 'succeeded' && charge.paid) {
        const chargeDate = new Date(charge.created * 1000);
        const monthIndex = chargeDate.getMonth();
        const monthName = months[monthIndex];
        
        if (monthlyData[monthName]) {
          monthlyData[monthName].total += charge.amount;
          monthlyData[monthName].count += 1;
        }
      }
    });
    
    // Calculate averages and format data
    const chartData = months.map(month => {
      const data = monthlyData[month];
      const total = data.total / 100; // Convert from cents
      const avg = data.count > 0 ? total / data.count : 0;
      
      return {
        month: month,
        total: total,
        count: data.count,
        avg: avg,
        min: avg * 0.7, // 70% of average
        max: avg * 1.3  // 130% of average
      };
    });
    
    console.log('Monthly payments data:', chartData);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        data: chartData,
        summary: {
          totalCharges: charges.data.length,
          totalAmount: chartData.reduce((sum, month) => sum + month.total, 0),
          averagePerMonth: chartData.reduce((sum, month) => sum + month.avg, 0) / 12
        }
      }),
    };
  } catch (error) {
    console.error('Stripe API error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
