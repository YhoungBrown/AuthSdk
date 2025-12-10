// hng-auth-sdk/index.ts

// Export Headless Logic
export * from "./src/core/auth-exception";
export {
  forgotPassword,
  initializeGoogleAuth,
  logout,
  mapError,
  monitorAuthState, signInWithApple, signInWithEmail, // <--- Add this
  signInWithGoogle, signUpWithEmail
} from "./src/core/auth-service";
export { onAuthStateChanged, useAuthSDK } from "./src/core/auth-store";

// Export UI Components
export { AuthLoginScreen } from "./src/ui/SignIn";
export { AuthRegisterScreen } from "./src/ui/SignUp";

export * from "./src/types";

