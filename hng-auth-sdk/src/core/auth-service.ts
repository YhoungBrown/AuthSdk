import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthUser } from "../types";
import {
  AuthOperationFailedException,
  EmailAlreadyInUseException,
  InvalidCredentialsException,
  NetworkException,
  TokenExpiredException,
  TooManyRequestsException,
  UserNotFoundException,
  WeakPasswordException,
} from "./auth-exception";
import { useAuthSDK } from "./auth-store";

export function initializeGoogleAuth(webClientId: string) {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });
}

export function mapError(err: any) {
  const code = err?.code;

  // Google Specific Error Codes
  if (code === statusCodes.SIGN_IN_CANCELLED) {
    return new AuthOperationFailedException("Sign-in cancelled by user.");
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return new AuthOperationFailedException(
      "Google Play Services not available."
    );
  }

  // Firebase Error Codes
  switch (code) {
    case "auth/invalid-email":
    case "auth/missing-email":
    case "auth/wrong-password":
    case "auth/invalid-password":
    case "auth/invalid-credential":
      return new InvalidCredentialsException();

    case "auth/user-not-found":
      return new UserNotFoundException();

    case "auth/email-already-in-use":
    case "auth/credential-already-in-use": // Added this for Google linking issues
      return new EmailAlreadyInUseException();

    case "auth/weak-password":
      return new WeakPasswordException();

    case "auth/user-token-expired":
      return new TokenExpiredException();

    case "auth/network-request-failed":
      return new NetworkException();

    case "auth/too-many-requests":
      return new TooManyRequestsException(
        "Too many attempts. Try again later."
      );

    default:
      return new AuthOperationFailedException(
        err.message || "Operation failed."
      );
  }
}

async function handleAuthSuccess(user: AuthUser) {
  //   await SecureStore.setItemAsync("auth_session", JSON.stringify(user));

  useAuthSDK.getState().signIn(user);

  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getAuth();
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return await handleAuthSuccess(res.user);
  } catch (err: any) {
    throw mapError(err);
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const auth = getAuth();
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return await handleAuthSuccess(res.user);
  } catch (err: any) {
    throw mapError(err);
  }
}

export async function signInWithGoogle() {
  const auth = getAuth();
  try {
    // 1. Check Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) throw new Error("NO_ID_TOKEN");

    const credential = GoogleAuthProvider.credential(idToken);

    const res = await signInWithCredential(auth, credential);

    return await handleAuthSuccess(res.user);
  } catch (err: any) {
    console.log("Google Sign In Error:", err);
    throw mapError(err);
  }
}

export async function forgotPassword(email: string) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err: any) {
    throw mapError(err);
  }
}

export async function logout() {
  const auth = getAuth();
  try {
    await SecureStore.deleteItemAsync("auth_session");

    try {
      await GoogleSignin.signOut();
    } catch (e) {}

    await firebaseSignOut(auth);

    useAuthSDK.getState().signOut();
  } catch (error) {
    console.log(error);
    throw new AuthOperationFailedException("Failed to log out.");
  }
}

export function monitorAuthState() {
  const auth = getAuth();

  // This listens to FIREBASE directly
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("SDK Monitor: User Restored");
      useAuthSDK.getState().signIn(user); // Updates store -> initialized = true
    } else {
      console.log("SDK Monitor: No User");
      useAuthSDK.getState().signOut(); // Updates store -> initialized = true
    }
  });

  return unsubscribe;
}
