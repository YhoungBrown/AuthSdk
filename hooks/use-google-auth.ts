import { mapError } from "@/service/auth-service";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

export function initializeGoogle({ webClientId }: { webClientId: string }) {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });
}

// headless sign-in
export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo.data?.idToken;
    if (!idToken) throw new Error("NO_ID_TOKEN");

    const auth = getAuth();
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);

    return { user: result.user };
  } catch (err: any) {
    console.log(err);
    if (err.code === statusCodes.SIGN_IN_CANCELLED)
      throw new Error("USER_CANCELLED");
    throw mapError(err);
  }
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
    const auth = getAuth();
    await firebaseSignOut(auth);
  } catch (err) {
    throw mapError(err);
  }
}
