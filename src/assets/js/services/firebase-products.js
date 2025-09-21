// Firebase Cards Service - Get users with registered card status
class FirebaseCardsService {
  constructor() {
    this.cache = new Map();
  }

  // Get users with registered card status as "cards"
  async getLatestCards() {
    try {
      console.log('🔄 Fetching registered users from Firebase...');
      
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.where("cardStatus", "==", "Registered").get();
      
      const registeredUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('✅ Found registered users:', registeredUsers.length);
      console.log('Registered users data:', registeredUsers);

      // Convert users to "card" format for display
      const cards = registeredUsers.slice(0, 5).map((user, index) => ({
        id: user.id,
        name: user.displayName || user.email || 'User',
        cardType: "Premium Card",
        registrationDate: user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
        status: "Registered",
        email: user.email,
        emergencyContact: user.emergencyContact || 'N/A'
      }));

      return cards;
    } catch (error) {
      console.error("Error fetching registered users:", error);
      // Return sample data if Firebase fails
      return [
        {
          id: 'sample1',
          name: 'Sample User 1',
          cardType: 'Premium Card',
          registrationDate: new Date().toLocaleDateString(),
          status: 'Registered',
          email: 'sample1@example.com',
          emergencyContact: 'N/A'
        },
        {
          id: 'sample2',
          name: 'Sample User 2',
          cardType: 'Premium Card',
          registrationDate: new Date().toLocaleDateString(),
          status: 'Registered',
          email: 'sample2@example.com',
          emergencyContact: 'N/A'
        }
      ];
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
window.FirebaseCardsService = new FirebaseCardsService();
