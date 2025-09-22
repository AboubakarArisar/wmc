const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters || {};
    const range = (params.range || "month").toLowerCase();

    const now = new Date();

    // Normalize to local midnight for boundaries
    function atMidnight(d) {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    }

    // Determine time window boundaries
    let startDate, endDate;
    if (range === "week") {
      // Current week: Monday 00:00 to Sunday 23:59
      const day = now.getDay(); // 0 Sun..6 Sat
      const diffToMonday = day === 0 ? -6 : 1 - day; // move back to Monday
      startDate = atMidnight(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + diffToMonday
        )
      );
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === "month") {
      startDate = atMidnight(new Date(now.getFullYear(), now.getMonth(), 1));
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // year
      startDate = atMidnight(new Date(now.getFullYear(), 0, 1));
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    // Fetch charges within window
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000),
      },
      limit: 1000,
    });

    // Build buckets for the selected range
    let buckets = [];
    if (range === "week") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        buckets.push({
          key: d.toISOString().slice(0, 10),
          label: dayNames[d.getDay()],
          total: 0,
          count: 0,
        });
      }
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
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`;
        buckets.push({ key, label: String(i), total: 0, count: 0 });
      }
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
      // year
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
      const year = startDate.getFullYear();
      for (let i = 0; i < 12; i++) {
        buckets.push({
          key: `${year}-${String(i + 1).padStart(2, "0")}`,
          label: monthNames[i],
          total: 0,
          count: 0,
        });
      }
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

    // Final dataset matching frontend shape
    const finalData = buckets.map((b) => ({
      month: b.label, // keep property name for chart
      total: Math.round(b.total * 100) / 100,
      count: b.count,
      avg: b.count > 0 ? Math.round((b.total / b.count) * 100) / 100 : 0,
    }));

    // Provide safe non-zero demo values only if everything is zero
    const hasReal = finalData.some((x) => x.avg > 0);
    const responseData = hasReal
      ? finalData
      : finalData.map((x, i) => ({ ...x, avg: 0 }));

    const out = responseData.map((m) => ({
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
        data: out,
        rawData: responseData,
        hasRealData: hasReal,
      }),
    };
  } catch (error) {
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
