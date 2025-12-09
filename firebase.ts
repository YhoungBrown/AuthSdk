import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzjFYHkIKNSeK4KdsBQBDa6FcEp9xWf7M",
  authDomain: "hngauth-221e8.firebaseapp.com",
  projectId: "hngauth-221e8",
  storageBucket: "hngauth-221e8.firebasestorage.app",
  messagingSenderId: "825818223932",
  appId: "1:825818223932:web:ANYTHING" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
