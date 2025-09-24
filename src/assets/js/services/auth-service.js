// Authentication Service for Firebase Auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = new Map();
    this.init();
  }

  init() {
    // Listen for auth state changes
    // onAuthStateChanged(auth, (user) => {
    //     this.currentUser = user;
    //     this.notifyListeners('authStateChanged', user);
    //     if (user) {
    //         console.log('User signed in:', user.email);
    //         this.loadUserProfile(user.uid);
    //     } else {
    //         console.log('User signed out');
    //         this.notifyListeners('userProfile', null);
    //     }
    // });
  }

  // Authentication Methods
  async signUp(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with display name
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName,
        });
      }

      // Create user document in Firestore
      await this.createUserProfile(user.uid, {
        email: user.email,
        displayName: userData.displayName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        country: userData.country || "",
        role: userData.role || "user",
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
      });

      return { success: true, user };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update last login time
      await this.updateUserProfile(user.uid, {
        lastLoginAt: new Date(),
      });

      return { success: true, user };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }
  }

  // User Profile Methods
  async createUserProfile(uid, userData) {
    try {
      await setDoc(doc(db, "users", uid), userData);
      console.log("User profile created:", uid);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  async loadUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userProfile = { id: userDoc.id, ...userDoc.data() };
        this.notifyListeners("userProfile", userProfile);
        return userProfile;
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
    return null;
  }

  async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(db, "users", uid), {
        ...updates,
        updatedAt: new Date(),
      });

      // Reload profile to get updated data
      const updatedProfile = await this.loadUserProfile(uid);
      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message };
    }
  }

  async updatePassword(newPassword) {
    try {
      if (!this.currentUser) {
        throw new Error("No user signed in");
      }
      await updatePassword(this.currentUser, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Error sending password reset:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteAccount() {
    try {
      if (!this.currentUser) {
        throw new Error("No user signed in");
      }

      const uid = this.currentUser.uid;

      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", uid));

      // Delete user from Firebase Auth
      await deleteUser(this.currentUser);

      return { success: true };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false, error: error.message };
    }
  }

  // User Management Methods
  async getAllUsers() {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async searchUsers(searchTerm) {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("displayName", ">=", searchTerm),
        where("displayName", "<=", searchTerm + "\uf8ff")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  // Event Listeners
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

  // Utility Methods
  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUserProfile() {
    return new Promise((resolve) => {
      if (this.currentUser) {
        this.loadUserProfile(this.currentUser.uid).then(resolve);
      } else {
        resolve(null);
      }
    });
  }

  // Mock data for development
  getMockUsers() {
    return [
      {
        id: "1",
        email: "admin@wmc.com",
        displayName: "Admin User",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        country: "USA",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLoginAt: new Date(),
      },
      {
        id: "2",
        email: "user@wmc.com",
        displayName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        country: "Canada",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        lastLoginAt: new Date(),
      },
    ];
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;
