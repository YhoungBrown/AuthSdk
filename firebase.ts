import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
