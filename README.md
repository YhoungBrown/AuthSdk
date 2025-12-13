# HNG Mobile Auth SDK

A modular, reusable Authentication SDK for **React Native (Expo)** powered by **Firebase**.  
It supports both **Headless Mode (logic only)** and **Default Mode (Pre-built UI)**, featuring Google Sign‑In, Email/Password auth, and persistent state management.

---

## Features

- **Auth Providers:** Email/Password, Google Sign-In, and Apple Sign-In (expandable to other Firebase providers).
- **State Management:** Built-in Zustand store for `authenticated`, `unauthenticated`, and `tokenExpired` states.
- **Flexible UI:** Dark-mode optimized Login and Signup screens with built‑in Toast notifications.
- **Session Persistence:** Automatically restores user sessions on app launch.
- **Unified Error Handling:** Maps Firebase errors into simple custom exceptions.
- **Dual Modes:** Pre-built UI components OR headless (custom UI) with exposed methods & hooks.

---

## 1. Installation

https://www.npmjs.com/package/hng-auth-sdk?activeTab=readme

If using npm:
```bash
npm install hng-auth-sdk
```

Then install all required peer dependencies:

```bash
npx expo install firebase @react-native-async-storage/async-storage @react-native-google-signin/google-signin expo-secure-store expo-apple-authentication zustand
```

**Peer Dependencies:**
- `firebase` (^10.0.0)
- `expo-secure-store`
- `expo-apple-authentication`
- `@react-native-google-signin/google-signin`
- `zustand`
- `react-native` & `react`

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

In `app/_layout.tsx`, initialize Google, Apple, and start the auth monitor:

```ts
// app/_layout.tsx
import "../firebase"; // 1. IMPORT FIREBASE FIRST
import { useEffect } from "react";
import { Stack } from "expo-router";
import { initializeGoogleAuth, monitorAuthState } from "../hng-auth-sdk";
import { env } from "@/env";

export default function RootLayout() {
  useEffect(() => {
    // Initialize Google Auth (if using Google Sign-In)
    initializeGoogleAuth(env.clientId || "");
    
    // Start monitoring auth state changes
    const unsubscribe = monitorAuthState();
    
    return () => unsubscribe();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**Note:** Apple Sign-In is auto-initialized via Firebase. No additional setup needed in code for Apple.

---

## 3. Usage: Default Mode (UI)

These pre-built screens handle all logic internally.

### **Sign In Screen**

```ts
import { AuthLoginScreen } from "../hng-auth-sdk";
import { router } from "expo-router";

export default function SignIn() {
  return (
    <AuthLoginScreen
      config={{ enableGoogle: true, enableApple: true }}
      onSuccess={() => router.replace("/(tabs)")}
      onRegisterPress={() => router.push("/sign-up")}
      onForgotPasswordPress={() => router.push("/forgot-password")}
    />
  );
}
```

**Config Options:**
- `enableGoogle` (boolean): Show/hide Google Sign-In button. Default: `true`.
- `enableApple` (boolean): Show/hide Apple Sign-In button. Default: `true`.

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
| `signInWithApple()`                | Launches Apple OAuth flow (iOS only)          |
| `logout()`                         | Signs out & clears store                      |
| `mapError(error)`                  | Converts Firebase errors to custom exceptions |
| `forgotPassword(email)`            | Sends password reset email                    |
| `initializeGoogleAuth(webClientId)` | Configures Google Sign-In (required)         |
| `monitorAuthState()`               | Listens to Firebase auth state changes       |

---

## Exceptions

The SDK provides custom exception classes for unified error handling:

```ts
import {
  InvalidCredentialsException,
  UserNotFoundException,
  EmailAlreadyInUseException,
  WeakPasswordException,
  TokenExpiredException,
  NetworkException,
} from 'hng-auth-sdk';
```

**Usage Example:**
```ts
import { signInWithEmail, mapError } from 'hng-auth-sdk';

try {
  await signInWithEmail('user@example.com', 'password');
} catch (err: any) {
  const mapped = mapError(err);
  
  if (mapped instanceof InvalidCredentialsException) {
    alert('Wrong email or password');
  } else if (mapped instanceof UserNotFoundException) {
    alert('Account does not exist');
  } else if (mapped instanceof TokenExpiredException) {
    // Re-authenticate user
  }
}
```

**Exception Types:**
- `InvalidCredentialsException` — Wrong password/email combination
- `UserNotFoundException` — Account does not exist
- `EmailAlreadyInUseException` — Email already registered
- `WeakPasswordException` — Password doesn't meet requirements
- `TokenExpiredException` — Session expired, re-authenticate
- `NetworkException` — Network connectivity issue

---

## 6. Apple Sign-In Setup (Consumer Prerequisites)

To use Apple Sign-In, consumers must:

### **A. Apple Developer Setup**
1. Create/enable an App ID with "Sign in with Apple" capability.
2. Create a Service ID (e.g., `com.yourcompany.appname.service`).
3. Generate a Private Key (.p8 file) for Apple Sign-In and note the **Key ID**.
4. Note your **Team ID** (top-right of Apple Developer portal).

### **B. Firebase Setup**
1. In **Firebase Console** > **Authentication** > **Sign-in method**, enable **Apple**.
2. Upload to Firebase:
   - Team ID
   - Service ID
   - Key ID
   - Private Key (.p8 file)

### **C. iOS App Configuration**
1. In **Xcode**, enable "Sign in with Apple" capability.
2. In `app.json`, ensure correct bundle ID:
   ```json
   {
     "ios": {
       "bundleIdentifier": "com.yourcompany.appname"
     }
   }
   ```
3. Build with `eas build` or `expo build`.

### **D. SDK Usage**
```tsx
import { AuthLoginScreen } from 'hng-auth-sdk';

<AuthLoginScreen
  config={{ enableApple: true }}
  onSuccess={(user) => console.log('Signed in:', user.email)}
  onRegisterPress={() => {}}
  onForgotPasswordPress={() => {}}
/>
```

Or use headless mode:
```ts
import { signInWithApple } from 'hng-auth-sdk';

const user = await signInWithApple();
```

---

## 📦 License

MIT License.  
Feel free to modify, extend, or embed this SDK in your projects.

---

## Test APK

Link to test APK: [https://drive.google.com/file/d/1wI_O4G2y6VGKZyMWieKEg7vzcywuhLyb/view?usp=sharing]

---

## ❤️ Contributing

Pull requests are welcome — especially improvements to documentation, security, and reliability.

---

## Support

For issues, feature requests, or questions, please open an issue on the repository.
