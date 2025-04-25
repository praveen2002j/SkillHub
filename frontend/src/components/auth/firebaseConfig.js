import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGhc0HqXUn6Uat5d48vrNqPXcFjTEvFw4",
  authDomain: "paf2025-e84f5.firebaseapp.com",
  projectId: "paf2025-e84f5",
  storageBucket: "paf2025-e84f5.firebasestorage.app",
  messagingSenderId: "546199647756",
  appId: "1:546199647756:web:6b1ac3c50f1295232de029",
  measurementId: "G-HKKEGH8BLJ"
};

  ////
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const FBAuthProvider = new FacebookAuthProvider();

export {auth,provider,FBAuthProvider};



