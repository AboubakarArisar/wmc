const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters || {};
    const range = (params.range || "month").toLowerCase(); // 'week' | 'month' | 'year'

    console.log(`🔄 Fetching income data from Stripe for range: ${range}`);

    const now = new Date();

    // Determine time window
    let startDate = new Date(now);
    if (range === "week") {
      startDate.setDate(startDate.getDate() - 6); // last 7 days including today
    } else if (range === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // start of current month
    } else {
      // year
      startDate = new Date(now.getFullYear(), 0, 1); // start of current year
    }

    // Fetch charges in window
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(now.getTime() / 1000),
      },
      limit: 1000,
    });

    console.log(`✅ Found ${charges.data.length} charges`);

    // Prepare aggregators
    let buckets = [];
    if (range === "week") {
      // 7 day buckets (Mon..Sun localized order starting from startDate)
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      // Build dates array from startDate..now
      const days = [];
      const cur = new Date(startDate);
      while (cur <= now) {
        days.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      buckets = days.map((d) => ({
        key: d.toISOString().slice(0, 10),
        label: dayNames[d.getDay()],
        total: 0,
        count: 0,
      }));

      // Assign charges
      charges.data.forEach((ch) => {
        if (ch.status === "succeeded" && ch.amount > 0) {
          const dKey = new Date(ch.created * 1000).toISOString().slice(0, 10);
          const b = buckets.find((x) => x.key === dKey);
          if (b) {
            b.total += ch.amount / 100;
            b.count += 1;
          }
        }
      });
    } else if (range === "month") {
      // Days in current month
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      buckets = Array.from({ length: daysInMonth }, (_, i) => ({
        key: `${year}-${String(month + 1).padStart(2, "0")}-${String(
          i + 1
        ).padStart(2, "0")}`,
        label: String(i + 1),
        total: 0,
        count: 0,
      }));

      charges.data.forEach((ch) => {
        if (ch.status === "succeeded" && ch.amount > 0) {
          const d = new Date(ch.created * 1000);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(d.getDate()).padStart(2, "0")}`;
          const b = buckets.find((x) => x.key === key);
          if (b) {
            b.total += ch.amount / 100;
            b.count += 1;
          }
        }
      });
    } else {
      // year: 12 months buckets
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      buckets = Array.from({ length: 12 }, (_, i) => ({
        key: `${now.getFullYear()}-${String(i + 1).padStart(2, "0")}`,
        label: monthNames[i],
        total: 0,
        count: 0,
      }));

      charges.data.forEach((ch) => {
        if (ch.status === "succeeded" && ch.amount > 0) {
          const d = new Date(ch.created * 1000);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          const b = buckets.find((x) => x.key === key);
          if (b) {
            b.total += ch.amount / 100;
            b.count += 1;
          }
        }
      });
    }

    // Build final dataset
    const finalData = buckets.map((b) => ({
      month: b.label, // keep key name 'month' to match frontend
      total: Math.round(b.total * 100) / 100,
      count: b.count,
      avg: b.count > 0 ? Math.round((b.total / b.count) * 100) / 100 : 0,
    }));

    // If all zero, provide soft demo values so the UI is not empty
    const responseData = finalData.every((x) => x.avg === 0)
      ? finalData.map((x, i) => ({ ...x, avg: (i + 1) * 10 }))
      : finalData;

    // Also provide min/max bands for potential future design
    const minMaxData = responseData.map((m) => ({
      month: m.month,
      min: Math.max(0, m.avg * 0.7),
      max: m.avg * 1.3,
      avg: m.avg,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        data: minMaxData,
        rawData: responseData,
        hasRealData: !finalData.every((x) => x.avg === 0),
      }),
    };
  } catch (error) {
    console.error("Stripe API error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
