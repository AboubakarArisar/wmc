// Firebase Products Service - Get users with registered card status
class FirebaseProductsService {
  constructor() {
    this.cache = new Map();
  }

  // Get users with registered card status as "products"
  async getPopularProducts() {
    try {
      console.log('🔄 Fetching registered users from Firebase...');
      
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.where("cardStatus", "==", "Registered").get();
      
      const registeredUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('✅ Found registered users:', registeredUsers.length);

      // Convert users to "product" format for display
      const products = registeredUsers.slice(0, 5).map((user, index) => ({
        id: user.id,
        name: user.displayName || user.email || 'User',
        price: Math.floor(Math.random() * 200) + 50, // Random price for demo
        originalPrice: Math.floor(Math.random() * 300) + 100,
        sold: Math.floor(Math.random() * 100) + 10,
        totalSold: Math.floor(Math.random() * 200) + 50,
        status: "Stock",
        image: "user",
        email: user.email,
        registrationDate: user.createdAt || new Date()
      }));

      return products;
    } catch (error) {
      console.error("Error fetching registered users:", error);
      return [];
    }
  }

  // Get real-time updates
  setupRealtimeListener() {
    const usersRef = firebase.firestore().collection("users");
    return usersRef.where("cardStatus", "==", "Registered").onSnapshot((snapshot) => {
      const registeredUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      this.cache.set("registeredUsers", registeredUsers);
      console.log('📊 Real-time update: Registered users count:', registeredUsers.length);
    });
  }
}

// Create global instance
window.FirebaseProductsService = new FirebaseProductsService();
