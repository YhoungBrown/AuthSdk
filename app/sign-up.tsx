import { router } from "expo-router";
import { AuthRegisterScreen } from "hng-auth-sdk";
import React from "react";

export default function SignUpRoute() {
  return (
    <AuthRegisterScreen
      onSuccess={(user) => {
        
        router.replace("/(tabs)");
      
      }}
      onLoginPress={() => {
        router.back(); 
      }}
    />
  );
}
