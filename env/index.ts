export const env = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT || "",
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_APP_ID || "",
} as const;
