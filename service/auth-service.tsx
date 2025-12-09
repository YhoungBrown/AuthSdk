import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";

import { saveAuth, useAuthStore } from "@/store/auth-store";
import * as SecureStore from "expo-secure-store";

import {
  AuthOperationFailedException,
  EmailAlreadyInUseException,
  InvalidCredentialsException,
  LogoutFailedException,
  NetworkException,
  TokenExpiredException,
  TooManyRequestsException,
  UserNotFoundException,
  WeakPasswordException
} from '@/service/auth-exception';
import { router } from "expo-router";





export async function signInWithEmail(email: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    
    await saveAuth(res.user);

    return res.user;
  } catch (err: any) {
    throw mapError(err);
  }
}



export async function signUpWithEmail(email: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    
    await saveAuth(res.user);

    return res.user;
  } catch (err: any) {
    throw mapError(err);
  }
}


export async function forgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err: any) {
    throw mapError(err);
  }
}


export async function logout() {
  try {
    await SecureStore.deleteItemAsync("auth");
    await auth.signOut();
    useAuthStore.getState().reset();  
  } catch (error) {
    console.log(error);
    throw new Error("Failed to log out. Please try again.");
  }
}



export function mapError(err: any) {
  const code = err?.code;

  switch (code) {
    // ----- Email / Account Errors -----
    case "auth/invalid-email":           
      return new InvalidCredentialsException("Invalid email format");

    case "auth/user-not-found":        
      return new UserNotFoundException("User does not exist");

    case "auth/email-already-in-use":   
      return new EmailAlreadyInUseException("Email already in use");

    case "auth/missing-email":           
      return new InvalidCredentialsException("Email is required");

    // ----- Password Errors -----
    case "auth/wrong-password":          
    case "auth/invalid-password":        
      return new InvalidCredentialsException("Incorrect password");

    case "auth/weak-password":           
      return new WeakPasswordException("Password is too weak");

    // ----- Token / Auth State -----
    case "auth/user-disabled":           
      return new InvalidCredentialsException("This account has been disabled");

    case "auth/invalid-user-token":      
    case "auth/user-token-expired":
      return new TokenExpiredException("Your session has expired. Please sign in again.");

    // ----- Rate limiting -----
    case "auth/too-many-requests":
      return new TooManyRequestsException("Too many attempts. Try again later");

    // ----- Network -----
    case "auth/network-request-failed":
      return new NetworkException("Network error. Check your connection");

    // ----- Fallback -----
    default:
      return new AuthOperationFailedException("Operation failed. Please try again");
  }
}

