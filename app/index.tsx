import { Redirect, router } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

// Import UI and Logic from YOUR SDK
import { AuthLoginScreen, signInWithGoogle, useAuthSDK } from "../hng-auth-sdk";

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

  // 3. Render YOUR SDK UI
  return (
    <AuthLoginScreen
      config={{
        enableGoogle: true,
        enableApple: false, // Set to true if you have Apple config
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
        // No need to navigate here, the 'status' change will trigger the Redirect above
        // OR the onSuccess callback if you wired it that way.
      }}
    />
  );
}
