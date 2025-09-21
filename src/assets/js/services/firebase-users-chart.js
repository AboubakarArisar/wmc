// Firebase Users Chart Service - Get real user registration data
class FirebaseUsersChartService {
  constructor() {
    this.cache = new Map();
  }

  // Get user registration data for the chart
  async getNewUsersData() {
    try {
      console.log('🔄 Fetching user registration data from Firebase...');
      
      const usersRef = firebase.firestore().collection("users");
      
      // Get all users first
      const allUsersSnapshot = await usersRef.get();
      const allUsers = allUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('📊 Total users found:', allUsers.length);
      
      if (allUsers.length === 0) {
        console.log('❌ No users found in Firebase');
        return null; // Return null to indicate no data
      }
      
      // Get current month data
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      console.log('📅 Date range:', {
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString()
      });
      
      // Filter users registered this month
      const thisMonthUsers = allUsers.filter(user => {
        if (!user.createdAt) return false;
        
        // Handle both timestamp and date formats
        let userDate;
        if (user.createdAt.seconds) {
          userDate = new Date(user.createdAt.seconds * 1000);
        } else if (user.createdAt.toDate) {
          userDate = user.createdAt.toDate();
        } else {
          userDate = new Date(user.createdAt);
        }
        
        return userDate >= startOfMonth && userDate <= endOfMonth;
      });
      
      const thisMonthCount = thisMonthUsers.length;
      const totalCount = allUsers.length;
      const currentCount = totalCount - thisMonthCount; // All users minus this month's users
      
      console.log('�� User counts:', {
        total: totalCount,
        thisMonth: thisMonthCount,
        current: currentCount
      });
      
      // Calculate percentages
      const currentPercentage = totalCount > 0 ? Math.round((currentCount / totalCount) * 100) : 0;
      const newPercentage = totalCount > 0 ? Math.round((thisMonthCount / totalCount) * 100) : 0;
      
      const result = {
        current: currentPercentage,
        new: newPercentage,
        counts: {
          current: currentCount,
          new: thisMonthCount,
          total: totalCount
        }
      };
      
      console.log('✅ User data calculated:', result);
      return result;
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Return null to indicate error
    }
  }

  // Get real-time updates
  setupRealtimeListener() {
    const usersRef = firebase.firestore().collection("users");
    return usersRef.onSnapshot((snapshot) => {
      const totalUsers = snapshot.docs.length;
      this.cache.set("totalUsers", totalUsers);
      console.log('📊 Real-time update: Total users count:', totalUsers);
    });
  }
}

// Create global instance
window.FirebaseUsersChartService = new FirebaseUsersChartService();
