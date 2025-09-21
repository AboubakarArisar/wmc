// Simple Data Service using Netlify Functions
class DataService {
  constructor() {
    this.cache = new Map();
  }

  // Stripe Data via Netlify Function
  async getStripeData() {
    try {
      const response = await fetch('/.netlify/functions/stripe-customers');
      const result = await response.json();
      
      if (result.success) {
        return {
          totalRevenue: 0,
          newOrders: result.count,
          cancellations: 0,
          averageOrderValue: 0,
          monthlyIncome: 0,
          totalCustomers: result.count
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching Stripe data:", error);
      return {
        totalRevenue: 0,
        newOrders: 0,
        cancellations: 0,
        averageOrderValue: 0,
        monthlyIncome: 0,
        totalCustomers: 0
      };
    }
  }
}

window.dataService = new DataService();
