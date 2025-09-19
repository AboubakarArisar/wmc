// Firebase Configuration
// Replace these values with your actual Firebase project configuration
// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBY8bpwNwpCSyJX9yWosWULSXzQS9_qfm0",
//   authDomain: "wmc-project-f5861.firebaseapp.com",
//   projectId: "wmc-project-f5861",
//   storageBucket: "wmc-project-f5861.firebasestorage.app",
//   messagingSenderId: "92154463945",
//   appId: "1:92154463945:web:d17fbfd846b0c1b1d1af18",
//   measurementId: "G-CFBW3D9592",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAsw_B2AFHDXEN1HKRLv31IGNccui6frY0",
  authDomain: "world-medical-card-prod.firebaseapp.com",
  databaseURL: "https://world-medical-card-prod-default-rtdb.firebaseio.com",
  projectId: "world-medical-card-prod",
  storageBucket: "world-medical-card-prod.appspot.com",
  messagingSenderId: "693992819935",
  appId: "1:693992819935:web:1124e6c059bb5d7d742d6a",
  measurementId: "G-W1XF11SNBM",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("app is initialized on firebase config");
// Export the app instance
export default app;
