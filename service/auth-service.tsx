import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";

import { saveAuth } from "@/store/auth-store";





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
    throw mapForgotError(err);
  }
}



// function mapError(err: any) {
//   const code = err.code;

//   switch (code) {
//     case "auth/wrong-password":
//       return new Error("Invalid password");
//     case "auth/user-not-found":
//       return new Error("User not found");
//     case "auth/email-already-in-use":
//       return new Error("Email already in use");
//     case "auth/weak-password":
//       return new Error("Weak password");
//     default:
//       return new Error("Authentication failed");
//   }
// }


function mapError(err: any) {
  const code = err?.code;

  switch (code) {

    // Email errors
    case "auth/invalid-email":
      return new Error("Invalid email format");

    case "auth/user-not-found":
      return new Error("User does not exist");

    // Password errors
    case "auth/wrong-password":
    case "auth/invalid-password":
      return new Error("Incorrect password");

    case "auth/weak-password":
      return new Error("Password is too weak");

    // Account/Access
    case "auth/user-disabled":
      return new Error("This account has been disabled");

    case "auth/operation-not-allowed":
      return new Error("Email/password sign-in is disabled");

    // Rate limiting
    case "auth/too-many-requests":
      return new Error("Too many attempts. Try again later");

    // Network
    case "auth/network-request-failed":
      return new Error("Network error. Check your connection");

    default:
      return new Error("Authentication failed. Please try again");
  }
}




function mapForgotError(err: any) {
  const code = err?.code;

  switch (code) {
    case "auth/user-not-found":
      return new Error("No account found with this email");

    case "auth/invalid-email":
      return new Error("Invalid email address");

    case "auth/missing-email":
      return new Error("Email is required");

    case "auth/too-many-requests":
      return new Error("Too many attempts. Try again later");

    case "auth/network-request-failed":
      return new Error("Network error. Check your connection");

    default:
      return new Error("Password reset failed");
  }
}

