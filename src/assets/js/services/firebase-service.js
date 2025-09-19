// Firebase Data Service - NO IMPORTS, NO EXPORTS
// Pure JavaScript class for Firebase data fetching

class FirebaseDataService {
  constructor() {
    this.db = null;
    this.initializeFirebase();
  }

  initializeFirebase() {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      this.db = firebase.firestore();
    } else {
      setTimeout(() => this.initializeFirebase(), 100);
    }
  }

  async waitForFirebase() {
    return new Promise((resolve) => {
      const checkFirebase = () => {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
          this.db = firebase.firestore();
          resolve();
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  async getDocuments() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('documents')
        .orderBy('id', 'desc')
        .limit(10)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  async getOrders() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('TrackOrder')
        .orderBy('date', 'desc')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date).toLocaleDateString() : 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getCustomers() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('user')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async getProducts() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('medicine')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getChatMessages() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('chat')
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? new Date(doc.data().timestamp).toLocaleString() : 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  async getCalendarEvents() {
    try {
      if (!this.db) {
        await this.waitForFirebase();
      }
      
      const snapshot = await this.db.collection('events')
        .orderBy('date', 'asc')
        .limit(30)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date).toLocaleDateString() : 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }
}

// Create global instance immediately
window.FirebaseDataService = new FirebaseDataService();
