// File: hng-auth-sdk/src/types.ts

import { User } from "firebase/auth";
import { StyleProp, ViewStyle } from "react-native";

// --- Re-export Firebase User for convenience ---
export type AuthUser = User;

// --- Store / State Types ---
export type AuthStatus = "authenticated" | "unauthenticated" | "tokenExpired";

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  initialized: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  setTokenExpired?: () => void;
}

// --- Configuration Types ---
export interface GoogleAuthConfig {
  webClientId: string;
}

export interface AuthUIConfig {
  /** Enable or disable the Google Sign-In button */
  enableGoogle?: boolean;
  /** Enable or disable the Apple Sign-In button */
  enableApple?: boolean;
}

// --- UI Component Prop Types ---

export interface AuthLoginProps {
  /** Configuration for showing/hiding social providers */
  config?: AuthUIConfig;

  /** Callback when login is successful. Returns the Firebase User object. */
  onSuccess: (user: AuthUser) => void;

  /** Navigation callback: User clicked "Sign Up" */
  onRegisterPress: () => void;

  /** Navigation callback: User clicked "Forgot Password" */
  onForgotPasswordPress: () => void;

  /** * Logic for Google Sign In.
   * Pass `signInWithGoogle` from the SDK here if using the UI.
   */
  onGooglePress?: () => Promise<void>;

  /** * Logic for Apple Sign In.
   * Pass `signInWithApple` from the SDK here if using the UI.
   */
  onApplePress?: () => Promise<void>;

  /** Optional custom error handler. If not provided, uses internal Toast. */
  onError?: (message: string) => void;

  /** Override container styles */
  style?: StyleProp<ViewStyle>;
}

export interface AuthRegisterProps {
  /** Callback when registration is successful. Returns the Firebase User object. */
  onSuccess: (user: AuthUser) => void;

  /** Navigation callback: User clicked "Sign In" */
  onLoginPress: () => void;

  /** Optional custom error handler. */
  onError?: (message: string) => void;

  /** Override container styles */
  style?: StyleProp<ViewStyle>;
}
