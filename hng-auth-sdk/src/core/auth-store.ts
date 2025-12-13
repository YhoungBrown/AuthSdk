

import { User } from "firebase/auth";
import { create } from "zustand";
import { AuthState } from "../types"; 

export const useAuthSDK = create<AuthState>((set) => ({
  status: "unauthenticated",
  user: null,
  initialized: false,
  signIn: (user) =>
    set({
      status: "authenticated",
      user,
      initialized: true,
    }),

  signOut: () =>
    set({
      status: "unauthenticated",
      user: null,
      initialized: true,
    }),

  
  setTokenExpired: () =>
    set({
      status: "tokenExpired",
      user: null,
      initialized: true,
    }),
}));


export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return useAuthSDK.subscribe((state) => callback(state.user));
};
