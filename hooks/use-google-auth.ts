import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "@/firebase";
import { makeRedirectUri } from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/providers/google";

import { saveAuth } from "@/store/auth-store"; 
WebBrowser.maybeCompleteAuthSession();



export function useGoogleAuth() {
  const redirectUri = makeRedirectUri({
    scheme: "hngauth",
  });

  console.log("Redirect URI:", redirectUri);


  const [request, response, promptAsync] = useAuthRequest({
    clientId:
      "825818223932-e2afd5n1v6knbq7ef4v6gsmaisigph5o.apps.googleusercontent.com",
    redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    async function handleResponse() {
      if (response?.type !== "success") return;

      const { authentication } = response;

      if (!authentication?.accessToken) return;

      // Create Firebase credential from Google access token
      const credential = GoogleAuthProvider.credential(
        null,
        authentication.accessToken
      );

     
      const result = await signInWithCredential(auth, credential);


      await saveAuth(result.user); 
    }

    handleResponse();
  }, [response]);

  return {
    promptAsync,
    request,
  };
}
