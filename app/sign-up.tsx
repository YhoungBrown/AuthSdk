import { router } from "expo-router";
import { AuthRegisterScreen } from "hng-auth-sdk";
import React from "react";

export default function SignUpRoute() {
  return (
    <AuthRegisterScreen
      onSuccess={(user) => {
        // Option A: Go straight to tabs
        router.replace("/(tabs)");
        // Option B: Go to login
        // router.replace("/");
      }}
      onLoginPress={() => {
        router.back(); // Go back to Index (Login)
      }}
    />
  );
}
