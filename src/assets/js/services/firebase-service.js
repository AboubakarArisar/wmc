// Firebase Data Service - Updated for Firebase v9+ modular syntax
// This service will be initialized after Firebase is loaded

class FirebaseDataService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.initialized = false;
  }

  async initializeFirebase() {
    if (this.initialized) return;

    try {
      // Wait for Firebase to be available
      await this.waitForFirebase();

      // Import Firebase functions dynamically
      const { getFirestore } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );
      const { getAuth } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
      );

      // Get the app instance from the global scope
      const app = window.firebaseApp;
      if (!app) {
        throw new Error("Firebase app not initialized");
      }

      this.db = getFirestore(app);
      this.auth = getAuth(app);
      this.initialized = true;

      console.log("✅ Firebase service initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Firebase service:", error);
      throw error;
    }
  }

  async waitForFirebase() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max

      const checkFirebase = () => {
        attempts++;
        if (window.firebaseApp) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error("Firebase app not available after 5 seconds"));
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  async getDocuments() {
    try {
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, query, orderBy, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const q = query(collection(this.db, "documents"), orderBy("id", "desc"));

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  async getOrders() {
    try {
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, query, orderBy, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const q = query(
        collection(this.db, "TrackOrder"),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date
          ? new Date(doc.data().date).toLocaleDateString()
          : "N/A",
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  async getCustomers() {
    try {
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const snapshot = await getDocs(collection(this.db, "user"));

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
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const snapshot = await getDocs(collection(this.db, "medicine"));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getChatMessages() {
    try {
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, query, orderBy, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const q = query(
        collection(this.db, "chat"),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp
          ? new Date(doc.data().timestamp).toLocaleString()
          : "N/A",
      }));
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  }

  async getCalendarEvents() {
    try {
      if (!this.initialized) {
        await this.initializeFirebase();
      }

      const { collection, query, orderBy, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

      const q = query(collection(this.db, "events"), orderBy("date", "asc"));

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date
          ? new Date(doc.data().date).toLocaleDateString()
          : "N/A",
      }));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }
  }
}

// Create global instance
window.FirebaseDataService = new FirebaseDataService();
