// File: hng-auth-sdk/src/core/auth-store.ts

import { User } from "firebase/auth";
import { create } from "zustand";
import { AuthState } from "../types"; // Make sure you import types if you separated them

export const useAuthSDK = create<AuthState>((set) => ({
  status: "unauthenticated",
  user: null,
  initialized: false,

  signIn: (user) =>
    set({
      status: "authenticated",
      user,
      initialized: true, // <--- ADD THIS
    }),

  signOut: () =>
    set({
      status: "unauthenticated",
      user: null,
      initialized: true, // <--- ADD THIS
    }),
}));

// Listener remains the same
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return useAuthSDK.subscribe((state) => callback(state.user));
};
