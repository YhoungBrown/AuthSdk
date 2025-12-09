// import { auth } from "@/firebase";
// import * as SecureStore from "expo-secure-store";
// import { User } from "firebase/auth";
// import { create } from "zustand";

// type AuthState = {
//   status: "authenticated" | "unauthenticated" | "tokenExpired";
//   user: User | null;
//   idToken: string | null;
//   refreshToken: string | null;
//   expirationTime: number | null;

//   setAuth: (payload: Partial<AuthState>) => void;
//   reset: () => void;
// };

// export const useAuthStore = create<AuthState>((set) => ({
//   status: "unauthenticated",
//   user: null,
//   idToken: null,
//   refreshToken: null,
//   expirationTime: null,

//   setAuth: (payload) => set((s) => ({ ...s, ...payload })),
//   reset: () =>
//     set({
//       status: "unauthenticated",
//       user: null,
//       idToken: null,
//       refreshToken: null,
//       expirationTime: null,
//     }),
// }));



// export async function initializeAuth() {
//   try {
//     const saved = await SecureStore.getItemAsync("auth");

//     if (!saved) {
//       useAuthStore.getState().reset();
//       return;
//     }

//     const data = JSON.parse(saved);

//     const expired = data.expirationTime < Date.now();

//     if (expired) {
//       useAuthStore.getState().setAuth({
//         status: "tokenExpired",
//         ...data,
//       });
//       return;
//     }

//     if (!auth.currentUser) {
//       // Firebase not initialized yet, skip refresh
//       useAuthStore.getState().setAuth({
//         status: "authenticated",
//         ...data,
//       });
//       return;
//     }

//     // Attempt token refresh
//     const newIdToken = await auth.currentUser.getIdToken(true);
//     const expirationTime = Date.now() + 55 * 60 * 1000;

//     const authPayload: Partial<AuthState> = {
//       status: "authenticated",
//       user: auth.currentUser,
//       idToken: newIdToken,
//       refreshToken: data.refreshToken,
//       expirationTime,
//     };

//     useAuthStore.getState().setAuth(authPayload);
//     await SecureStore.setItemAsync("auth", JSON.stringify(authPayload));

//   } catch (e) {
//     useAuthStore.getState().reset();
//     console.log("Initialize error ", e);
//   }
// }




// export async function saveAuth(user: User) {
//   const idToken = await user.getIdToken();
//   const refreshToken = user.refreshToken;
//   const expirationTime = Date.now() + 55 * 60 * 1000;

//   const payload = {
//     status: "authenticated" as const,
//     user,
//     idToken,
//     refreshToken,
//     expirationTime,
//   };

//   useAuthStore.getState().setAuth(payload);

//   await SecureStore.setItemAsync("auth", JSON.stringify(payload));
// }


import * as SecureStore from "expo-secure-store";
import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStatus = "authenticated" | "unauthenticated" | "tokenExpired";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  initialized: boolean; // 🔥 REQUIRED
  setAuth: (user: User) => void;
  reset: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "unauthenticated",
  initialized: false,

  setAuth: (user) =>
    set({
      user,
      status: "authenticated",
    }),

  reset: () =>
    set({
      user: null,
      status: "unauthenticated",
    }),

  initializeAuth: async () => {
    try {
      const saved = await SecureStore.getItemAsync("auth");

      if (!saved) {
        set({ initialized: true });
        return;
      }

      const parsed = JSON.parse(saved);

      if (!parsed || !parsed.user) {
        set({ initialized: true });
        return;
      }

      set({
        user: parsed.user,
        status: "authenticated",
        initialized: true, // 🔥 IMPORTANT
      });
    } catch (error) {
      console.log("Auth restore failed:", error);
      set({ initialized: true });
    }
  },
}));

// Helper functions outside the store
export async function saveAuth(user: User) {
  await SecureStore.setItemAsync("auth", JSON.stringify({ user }));
  useAuthStore.getState().setAuth(user);
}

export async function logout() {
  await SecureStore.deleteItemAsync("auth");
  useAuthStore.getState().reset();
}
