import { Redirect, router } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";


import { AuthLoginScreen, signInWithGoogle, useAuthSDK } from "hng-auth-sdk";

export default function IndexRoute() {
  const { status, initialized } = useAuthSDK();

  if (status === "authenticated") {
    return <Redirect href="/(tabs)" />;
  }

  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0D0D0D",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }


  return (
    <AuthLoginScreen
      config={{
        enableGoogle: true,
        enableApple: false, 
      }}
      onSuccess={(user) => {
        console.log("Login Success:", user.email);
        router.replace("/(tabs)");
      }}
      onRegisterPress={() => {
        router.push("/sign-up");
      }}
      onForgotPasswordPress={() => {
        router.push("/forgot-password");
      }}
      onGooglePress={async () => {
        await signInWithGoogle();
       
      }}
    />
  );
}
