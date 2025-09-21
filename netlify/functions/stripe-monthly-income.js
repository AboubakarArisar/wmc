const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  try {
    console.log('🔄 Fetching monthly income data from Stripe...');
    
    // Get charges from the last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000)
      },
      limit: 1000
    });

    console.log(`✅ Found ${charges.data.length} charges`);

    // Group charges by month
    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = monthNames[date.getMonth()];
      monthlyData[monthKey] = {
        month: monthName,
        total: 0,
        count: 0,
        avg: 0
      };
    }

    // Process charges
    charges.data.forEach(charge => {
      if (charge.status === 'succeeded' && charge.amount > 0) {
        const chargeDate = new Date(charge.created * 1000);
        const monthKey = `${chargeDate.getFullYear()}-${String(chargeDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].total += charge.amount / 100; // Convert from cents
          monthlyData[monthKey].count += 1;
        }
      }
    });

    // Calculate averages and format data
    const chartData = Object.values(monthlyData).map(month => {
      month.avg = month.count > 0 ? month.total / month.count : 0;
      return {
        month: month.month,
        total: Math.round(month.total * 100) / 100,
        count: month.count,
        avg: Math.round(month.avg * 100) / 100
      };
    });

    // Create two lines for the chart (min and max of each month)
    const minMaxData = chartData.map(month => ({
      month: month.month,
      min: Math.max(0, month.avg * 0.7), // 70% of average as minimum
      max: month.avg * 1.3, // 130% of average as maximum
      avg: month.avg
    }));

    console.log('📊 Monthly income data processed:', minMaxData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        data: minMaxData,
        rawData: chartData
      }),
    };
  } catch (error) {
    console.error('Stripe API error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
