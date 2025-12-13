

import { User } from "firebase/auth";
import { StyleProp, ViewStyle } from "react-native";


export type AuthUser = User;


export type AuthStatus = "authenticated" | "unauthenticated" | "tokenExpired";

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  initialized: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  setTokenExpired?: () => void;
}


export interface GoogleAuthConfig {
  webClientId: string;
}

export interface AuthUIConfig {
 
  enableGoogle?: boolean;

  enableApple?: boolean;
}



export interface AuthLoginProps {
 
  config?: AuthUIConfig;

  
  onSuccess: (user: AuthUser) => void;

 
  onRegisterPress: () => void;


  onForgotPasswordPress: () => void;


  onGooglePress?: () => Promise<void>;


  onApplePress?: () => Promise<void>;


  onError?: (message: string) => void;


  style?: StyleProp<ViewStyle>;
}

export interface AuthRegisterProps {

  onSuccess: (user: AuthUser) => void;

  onLoginPress: () => void;


  onError?: (message: string) => void;


  style?: StyleProp<ViewStyle>;
}
