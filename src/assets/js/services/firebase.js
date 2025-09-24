// firebase.js
import {
  initializeApp,
  getApps,
  getApp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsw_B2AFHDXEN1HKRLv31IGNccui6frY0",
  authDomain: "world-medical-card-prod.firebaseapp.com",
  projectId: "world-medical-card-prod",
  storageBucket: "world-medical-card-prod.appspot.com",
  messagingSenderId: "693992819935",
  appId: "1:693992819935:web:1124e6c059bb5d7d742d6a",
  measurementId: "G-W1XF11SNBM",
};

// Prevent duplicate initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
