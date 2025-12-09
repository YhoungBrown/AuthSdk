import { auth } from "@/firebase";
import * as SecureStore from "expo-secure-store";
import { User } from "firebase/auth";
import { create } from "zustand";

type AuthState = {
  status: "authenticated" | "unauthenticated" | "tokenExpired";
  user: User | null;
  idToken: string | null;
  refreshToken: string | null;
  expirationTime: number | null;

  setAuth: (payload: Partial<AuthState>) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: "unauthenticated",
  user: null,
  idToken: null,
  refreshToken: null,
  expirationTime: null,

  setAuth: (payload) => set((s) => ({ ...s, ...payload })),
  reset: () =>
    set({
      status: "unauthenticated",
      user: null,
      idToken: null,
      refreshToken: null,
      expirationTime: null,
    }),
}));



export async function initializeAuth() {
  try {
    const saved = await SecureStore.getItemAsync("auth");

    if (!saved) {
      useAuthStore.getState().reset();
      return;
    }

    const data = JSON.parse(saved);

    const expired = data.expirationTime < Date.now();

    if (expired) {
      useAuthStore.getState().setAuth({
        status: "tokenExpired",
        ...data,
      });
      return;
    }

    if (!auth.currentUser) {
      // Firebase not initialized yet, skip refresh
      useAuthStore.getState().setAuth({
        status: "authenticated",
        ...data,
      });
      return;
    }

    // Attempt token refresh
    const newIdToken = await auth.currentUser.getIdToken(true);
    const expirationTime = Date.now() + 55 * 60 * 1000;

    const authPayload: Partial<AuthState> = {
      status: "authenticated",
      user: auth.currentUser,
      idToken: newIdToken,
      refreshToken: data.refreshToken,
      expirationTime,
    };

    useAuthStore.getState().setAuth(authPayload);
    await SecureStore.setItemAsync("auth", JSON.stringify(authPayload));

  } catch (e) {
    useAuthStore.getState().reset();
    console.log("Initialize error ", e);
  }
}




export async function saveAuth(user: User) {
  const idToken = await user.getIdToken();
  const refreshToken = user.refreshToken;
  const expirationTime = Date.now() + 55 * 60 * 1000;

  const payload = {
    status: "authenticated" as const,
    user,
    idToken,
    refreshToken,
    expirationTime,
  };

  useAuthStore.getState().setAuth(payload);

  await SecureStore.setItemAsync("auth", JSON.stringify(payload));
}

export async function logout() {
  await SecureStore.deleteItemAsync("auth");
  await auth.signOut();
  useAuthStore.getState().reset();
}
