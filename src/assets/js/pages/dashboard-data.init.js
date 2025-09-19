// Dashboard Data Controller
import dataService from "../services/data-service.js";

class DashboardDataController {
  constructor() {
    this.data = {
      stripe: {
        totalRevenue: 0,
        newOrders: 0,
        cancellations: 0,
        averageOrderValue: 0,
        monthlyIncome: 0,
      },
      customers: [],
      products: [],
      printsPerWeek: [],
      countries: {},
    };
    this.init();
  }

  async init() {
    try {
      // Load initial data
      await this.loadAllData();

      // Set up real-time listeners
      this.setupRealtimeListeners();

      // Update dashboard UI
      this.updateDashboard();
    } catch (error) {
      console.error("Error initializing dashboard data:", error);
      // No mock fallback; leave zeros/defaults
      this.updateDashboard();
    }
  }

  async loadAllData() {
    try {
      // Load all data in parallel
      const [stripeData, customers, products, printsPerWeek, countries] =
        await Promise.all([
          dataService.getStripeData(),
          dataService.getCustomers(),
          dataService.getProducts(),
          dataService.getPrintsPerWeek(),
          dataService.getCountries(),
        ]);

      this.data = {
        stripe: stripeData || {
          totalRevenue: 0,
          newOrders: 0,
          cancellations: 0,
          averageOrderValue: 0,
          monthlyIncome: 0,
        },
        customers: customers || [],
        products: products || [],
        printsPerWeek: printsPerWeek || [],
        countries: countries || {},
      };

      console.log("Data loaded successfully:", this.data);
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  setupRealtimeListeners() {
    // Listen for data changes
    dataService.addListener("customers", (customers) => {
      this.data.customers = customers || [];
      this.updateCustomersSection();
    });

    dataService.addListener("products", (products) => {
      this.data.products = products || [];
      this.updateProductsSection();
    });
  }

  updateDashboard() {
    this.updateStripeCards();
    this.updateCustomersSection();
    this.updateProductsSection();
    this.updatePrintsChart();
    this.updateCountriesChart();
  }

  updateStripeCards() {
    if (!this.data.stripe) return;

    const { totalRevenue, newOrders, cancellations, averageOrderValue } =
      this.data.stripe;

    // Update Total Revenue
    this.updateCardValue(
      ".revenue-card",
      `$${(Number(totalRevenue) || 0).toLocaleString()}`
    );

    // Update New Orders
    this.updateCardValue(
      ".orders-card",
      (Number(newOrders) || 0).toLocaleString()
    );

    // Update Cancellations (Sessions)
    this.updateCardValue(
      ".sessions-card",
      (Number(cancellations) || 0).toLocaleString()
    );

    // Update Average Order Value
    this.updateCardValue(
      ".avg-order-card",
      `$${(Number(averageOrderValue) || 0).toLocaleString()}`
    );
  }

  updateCustomersSection() {
    if (!this.data.customers) return;
    const customerCount = Array.isArray(this.data.customers)
      ? this.data.customers.length
      : 0;
    this.updateCardValue(
      ".customers-card .fw-bold",
      customerCount.toLocaleString()
    );
  }

  updateProductsSection() {
    if (!this.data.products) return;
    this.updateProductsList();
  }

  updatePrintsChart() {
    if (!this.data.printsPerWeek) return;
    this.updatePrintsChartData();
  }

  updateCountriesChart() {
    if (!this.data.countries) return;
    this.updateCountriesChartData();
  }

  updateCardValue(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  updateProductsList() {
    const productsList = document.querySelector(".products-list");
    if (!productsList || !this.data.products) return;

    productsList.innerHTML = (this.data.products || [])
      .map(
        (product) => `
            <div class="d-flex align-items-center mb-2">
                <div class="flex-shrink-0">
                    <div class="avatar-xs">
                        <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                            <i class="iconoir-shopping-bag"></i>
                        </span>
                    </div>
                </div>
                <div class="flex-grow-1 ms-2">
                    <h6 class="mb-0">${product.name}</h6>
                    <p class="text-muted mb-0">${product.category} - $${product.price}</p>
                </div>
                <div class="flex-shrink-0">
                    <span class="badge bg-success">${product.ordersThisWeek} orders</span>
                </div>
            </div>
        `
      )
      .join("");
  }

  updatePrintsChartData() {
    // Placeholder for chart updates
  }

  updateCountriesChartData() {
    // Placeholder for chart updates
  }

  // Public methods for external access
  getData() {
    return this.data;
  }

  refreshData() {
    this.loadAllData();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dashboardController = new DashboardDataController();
});

export default DashboardDataController;
