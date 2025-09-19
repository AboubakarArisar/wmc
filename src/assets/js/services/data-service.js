// Data Service Layer for Firebase and Stripe Integration
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase-config.js";

class DataService {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
  }

  // Firebase Data Methods
  async getCustomers() {
    try {
      const customersRef = collection(db, "customers");
      const snapshot = await getDocs(customersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }

  async getProducts() {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("isPopular", "==", true),
        orderBy("ordersThisWeek", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getPrintsPerWeek() {
    try {
      const printsRef = collection(db, "prints");
      const q = query(printsRef, orderBy("week", "desc"), limit(12)); // Last 12 weeks
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching prints per week:", error);
      return [];
    }
  }

  async getCountries() {
    try {
      const customersRef = collection(db, "customers");
      const snapshot = await getDocs(customersRef);
      const countries = {};
      snapshot.docs.forEach((doc) => {
        const country = doc.data().country;
        countries[country] = (countries[country] || 0) + 1;
      });
      return countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return {};
    }
  }

  // Stripe Data Methods (now via serverless, no mocks)
  async getStripeData() {
    try {
      const resp = await fetch("/api/stripe-metrics");
      if (!resp.ok) throw new Error("Bad response");
      const json = await resp.json();
      return {
        totalRevenue: Number(json.totalRevenue) || 0,
        newOrders: Number(json.newOrders) || 0,
        cancellations: Number(json.cancellations) || 0,
        averageOrderValue: Number(json.averageOrderValue) || 0,
        monthlyIncome: Number(json.monthlyIncome) || 0,
      };
    } catch (error) {
      console.error("Error fetching Stripe metrics from API:", error);
      return {
        totalRevenue: 0,
        newOrders: 0,
        cancellations: 0,
        averageOrderValue: 0,
        monthlyIncome: 0,
      };
    }
  }

  // Real-time listeners
  setupRealtimeListeners() {
    // Listen to customers collection
    const customersRef = collection(db, "customers");
    const unsubscribeCustomers = onSnapshot(customersRef, (snapshot) => {
      const customers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.cache.set("customers", customers);
      this.notifyListeners("customers", customers);
    });

    // Listen to products collection
    const productsRef = collection(db, "products");
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.cache.set("products", products);
      this.notifyListeners("products", products);
    });

    return {
      unsubscribeCustomers,
      unsubscribeProducts,
    };
  }

  // Event listeners
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }
}

// Create singleton instance
const dataService = new DataService();
export default dataService;
