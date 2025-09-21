// Consolidated Data Service - Reuse existing data sources
class ConsolidatedDataService {
  constructor() {
    this.stripeData = null;
    this.usersData = null;
  }

  // Get Stripe data (reuse existing balance data)
  async getStripeData() {
    try {
      if (this.stripeData) return this.stripeData;
      
      console.log('🔄 Fetching Stripe data...');
      const response = await fetch('/.netlify/functions/stripe-balance');
      const result = await response.json();
      
      if (result.success) {
        this.stripeData = result.data;
        console.log('✅ Stripe data loaded:', this.stripeData);
        return this.stripeData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching Stripe data:', error);
      return null;
    }
  }

  // Get users data (reuse existing Firebase users)
  async getUsersData() {
    try {
      if (this.usersData) return this.usersData;
      
      console.log('🔄 Fetching users data from Firebase...');
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
      
      this.usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Users data loaded:', this.usersData.length, 'users');
      return this.usersData;
    } catch (error) {
      console.error('❌ Error fetching users data:', error);
      return [];
    }
  }

  // Generate monthly income chart from Stripe balance data
  async getMonthlyIncomeData() {
    const stripeData = await this.getStripeData();
    if (!stripeData) return null;

    // Create sample monthly data based on balance
    const balance = stripeData.available?.[0]?.amount || 0;
    const monthlyIncome = balance / 100; // Convert from cents
    
    // Generate 12 months of data with some variation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const chartData = months.map((month, index) => {
      const baseAmount = monthlyIncome / 12;
      const variation = (Math.sin(index * 0.5) * 0.3 + 0.7); // 70-100% variation
      const avg = baseAmount * variation;
      
      return {
        month: month,
        min: avg * 0.7,
        max: avg * 1.3,
        avg: avg
      };
    });

    console.log('📊 Monthly income data generated from balance:', chartData);
    return chartData;
  }

  // Get new users data from existing users
  async getNewUsersData() {
    const users = await this.getUsersData();
    if (!users || users.length === 0) return null;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Filter users by registration date
    const thisMonthUsers = users.filter(user => {
      if (!user.createdAt) return false;
      
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

    const currentUsers = users.length - thisMonthUsers.length;
    const newUsers = thisMonthUsers.length;
    const totalUsers = users.length;

    const result = {
      current: totalUsers > 0 ? Math.round((currentUsers / totalUsers) * 100) : 0,
      new: totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0,
      counts: {
        current: currentUsers,
        new: newUsers,
        total: totalUsers
      }
    };

    console.log('📊 New users data calculated:', result);
    return result;
  }

  // Get latest cards from existing users
  async getLatestCards() {
    const users = await this.getUsersData();
    if (!users || users.length === 0) return [];

    // Filter users with "Registered" status
    const registeredUsers = users.filter(user => user.cardStatus === "Registered");
    
    console.log('📊 Found registered users:', registeredUsers.length);

    // Convert to card format
    const cards = registeredUsers.slice(0, 5).map(user => ({
      id: user.id,
      name: user.displayName || user.email || 'User',
      cardType: "Premium Card",
      registrationDate: user.createdAt ? 
        new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
      status: "Registered",
      email: user.email,
      emergencyContact: user.emergencyContact || 'N/A'
    }));

    console.log('📊 Latest cards generated:', cards);
    return cards;
  }
}

// Create global instance
window.ConsolidatedDataService = new ConsolidatedDataService();
