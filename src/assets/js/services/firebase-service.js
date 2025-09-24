// Firebase Data Service - Updated for Firebase v9+ modular syntax
// This service will work with the existing Firebase configuration

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
      const { getApp } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
      );

      // Get the app instance - try to get existing app first
      let app;
      try {
        app = getApp();
      } catch (error) {
        // If no app exists, create one
        const { initializeApp } = await import(
          "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
        );
        const firebaseConfig = {
          apiKey: "AIzaSyAsw_B2AFHDXEN1HKRLv31IGNccui6frY0",
          authDomain: "world-medical-card-prod.firebaseapp.com",
          databaseURL:
            "https://world-medical-card-prod-default-rtdb.firebaseio.com",
          projectId: "world-medical-card-prod",
          storageBucket: "world-medical-card-prod.appspot.com",
          messagingSenderId: "693992819935",
          appId: "1:693992819935:web:1124e6c059bb5d7d742d6a",
          measurementId: "G-W1XF11SNBM",
        };
        app = initializeApp(firebaseConfig);
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
      const maxAttempts = 30; // 3 seconds max

      const checkFirebase = () => {
        attempts++;
        // Check if Firebase modules are available
        if (typeof window !== "undefined" && window.firebaseModules) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error("Firebase modules not available after 3 seconds"));
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
