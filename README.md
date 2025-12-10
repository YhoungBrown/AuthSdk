# HNG Mobile Auth SDK

A modular, reusable Authentication SDK for **React Native (Expo)** powered by **Firebase**.  
It supports both **Headless Mode (logic only)** and **Default Mode (Pre-built UI)**, featuring Google Sign‑In, Email/Password auth, and persistent state management.

---

## Features

- **Auth Providers:** Email/Password & Google Sign-In.
- **State Management:** Built-in Zustand store for `authenticated`, `unauthenticated`, and `tokenExpired` states.
- **Flexible UI:** Dark-mode optimized Login and Signup screens with built‑in Toast notifications.
- **Session Persistence:** Automatically restores user sessions on app launch.
- **Unified Error Handling:** Maps Firebase errors into simple custom exceptions.

---

## 1. Installation

This SDK is a **local module**. Ensure you install all required peer dependencies:

```bash
npx expo install firebase @react-native-async-storage/async-storage @react-native-google-signin/google-signin expo-secure-store expo-apple-authentication zustand
```

---

## 2. Configuration & Setup (Crucial)

### **Step A: Environment Variables**

Create a `.env` file in your project root.  
Expo requires all variables to start with `EXPO_PUBLIC_`.

```
EXPO_PUBLIC_API_KEY=AIzaSy...
EXPO_PUBLIC_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_PROJECT_ID=your-project-id
EXPO_PUBLIC_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_SENDER_ID=123456789
EXPO_PUBLIC_APP_ID=1:123456:web:....
EXPO_PUBLIC_GOOGLE_CLIENT=your-web-client-id.apps.googleusercontent.com
```

---

### **Step B: Initialize Firebase**

Create a `firebase.ts` file in your project root:

```ts
// firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

if (getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
```

---

### **Step C: Configure Root Layout**

In `app/_layout.tsx`, initialize Google & start the auth monitor:

```ts
// app/_layout.tsx
import "../firebase"; // 1. IMPORT FIREBASE FIRST
import { useEffect } from "react";
import { Stack } from "expo-router";
import { initializeGoogleAuth, monitorAuthState } from "../hng-auth-sdk";
import { env } from "@/env";

export default function RootLayout() {
  useEffect(() => {
    initializeGoogleAuth(env.clientId || "");
    const unsubscribe = monitorAuthState();
    return () => unsubscribe();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

---

## 3. Usage: Default Mode (UI)

These pre-built screens handle all logic internally.

### **Sign In Screen**

```ts
import { AuthLoginScreen, signInWithGoogle } from "../hng-auth-sdk";
import { router } from "expo-router";

export default function SignIn() {
  return (
    <AuthLoginScreen
      config={{ enableGoogle: true, enableApple: false }}
      onSuccess={() => router.replace("/(tabs)")}
      onRegisterPress={() => router.push("/sign-up")}
      onForgotPasswordPress={() => router.push("/forgot-password")}
      onGooglePress={async () => await signInWithGoogle()}
    />
  );
}
```

---

### **Sign Up Screen**

```ts
import { AuthRegisterScreen } from "../hng-auth-sdk";
import { router } from "expo-router";

export default function SignUp() {
  return (
    <AuthRegisterScreen
      onSuccess={() => router.replace("/(tabs)")}
      onLoginPress={() => router.back()}
    />
  );
}
```

---

## 4. Usage: Headless Mode (Custom UI)

Import the core logic & build your own UI.

```ts
import { signInWithEmail, useAuthSDK, mapError, logout } from "../hng-auth-sdk";

export default function CustomLogin() {
  const { status, user } = useAuthSDK();

  const handleLogin = async () => {
    try {
      await signInWithEmail("user@example.com", "password123");
    } catch (err) {
      alert(mapError(err).message);
    }
  };

  if (status === "authenticated") {
    return (
      <View>
        <Text>Welcome, {user?.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return <Button title="Login" onPress={handleLogin} />;
}
```

---

## 5. API Reference

### **useAuthSDK() Hook**

```ts
const {
  status, // "authenticated" | "unauthenticated" | "tokenExpired"
  user, // Firebase User | null
  initialized, // boolean
} = useAuthSDK();
```

---

## Core Functions

| Function                           | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| `signInWithEmail(email, password)` | Signs in & updates store                      |
| `signUpWithEmail(email, password)` | Registers user & updates store                |
| `signInWithGoogle()`               | Launches Google OAuth flow                    |
| `logout()`                         | Signs out & clears store                      |
| `mapError(error)`                  | Converts Firebase errors to custom exceptions |

---

## Exceptions

The SDK provides custom exception classes:

- **InvalidCredentialsException**
- **UserNotFoundException**
- **EmailAlreadyInUseException**
- **WeakPasswordException**
- **TokenExpiredException**
- **NetworkException**

---

## 📦 License

MIT License.  
Feel free to modify, extend, or embed this SDK in your projects.

---

## ❤️ Contributing

Pull requests are welcome — especially improvements to documentation & reliability.
