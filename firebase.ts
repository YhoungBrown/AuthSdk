import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
};

// Debugging: Check if keys are actually loading
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase Config Error: API Key is missing. Check your .env file and restart metro with --clear"
  );
}

let app = initializeApp(firebaseConfig);
let auth = initializeAuth(app);

export { auth };
