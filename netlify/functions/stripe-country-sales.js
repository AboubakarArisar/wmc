exports.handler = async (event, context) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Get charges with billing details to analyze by country
    const charges = await stripe.charges.list({ 
      limit: 500,
      expand: ['data.billing_details']
    });

    // Country mapping for common country codes
    const countryMap = {
      US: "USA",
      ES: "Spain", 
      FR: "French",
      DE: "Germany",
      BS: "Bahamas",
      RU: "Russia",
      GB: "United Kingdom",
      CA: "Canada",
      AU: "Australia",
      IT: "Italy",
      NL: "Netherlands",
      SE: "Sweden",
      NO: "Norway",
      DK: "Denmark",
      FI: "Finland"
    };

    // Process charges to get country-wise revenue
    const countryData = {};

    charges.data.forEach((charge) => {
      if (charge.status === 'succeeded' && charge.amount > 0) {
        const country = charge.billing_details?.address?.country;
        const countryName = countryMap[country] || country || "Other";
        const amount = charge.amount / 100; // Convert from cents

        if (!countryData[countryName]) {
          countryData[countryName] = {
            revenue: 0,
            count: 0,
            countryCode: country
          };
        }

        countryData[countryName].revenue += amount;
        countryData[countryName].count += 1;
      }
    });

    // Convert to array and sort by revenue
    const countryArray = Object.entries(countryData)
      .map(([name, data]) => ({
        name,
        revenue: Math.round(data.revenue * 100) / 100,
        count: data.count,
        countryCode: data.countryCode
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate percentages for progress bars
    const maxRevenue = countryArray.length > 0 ? countryArray[0].revenue : 1;
    countryArray.forEach((country) => {
      country.percentage = Math.round((country.revenue / maxRevenue) * 100);
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: countryArray.slice(0, 6) // Top 6 countries
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
