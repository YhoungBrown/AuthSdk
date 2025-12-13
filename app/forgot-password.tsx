import { RelativePathString, router } from "expo-router";
import {
  AuthOperationFailedException,
  forgotPassword,
  mapError,
} from "hng-auth-sdk";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TopAlert from "@/components/top-alert";
import styles from "@/stylesheets/reset-password-stylesheet";

const Index = () => {
  const inset = useSafeAreaInsets();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onForgotPassword = async () => {
    setLoading(true);

    try {
      if (!email.trim()) {
        setAlert({
          message: "Email is required",
          type: "error",
        });
        return;
      }

      await forgotPassword(email);

      setAlert({
        message: "Password reset email sent!",
        type: "success",
      });

      setEmail("");
    } catch (error: any) {
      // Developer can access mapped errors
      const mapped = mapError(error);

      if (mapped instanceof AuthOperationFailedException) {
        setAlert({
          message: "Operation failed",
          type: "error",
        });
      } else {
        setAlert({
          message: "Another thing",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {alert?.type === "success" ? (
          <TopAlert
            message={alert.message}
            duration={4000}
            type={alert.type}
            onHide={() => setAlert(null)}
          />
        ) : alert?.type === "error" ? (
          <TopAlert message={alert.message} duration={4000} type={alert.type} />
        ) : null}

        <View
          style={{
            paddingTop: inset.top,
            paddingBottom: inset.bottom,
            ...styles.container,
          }}
        >
          <Text style={styles.signInTitle}>Forgot Password</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.emailTextInput}
            onChangeText={setEmail}
            value={email}
          />

          {loading ? (
            <View style={styles.activityContainer}>
              <ActivityIndicator size={"large"} color={"#4A90E2"} />

              <Text style={styles.loadingText}>Sending Email...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={onForgotPassword}
            >
              <Text style={styles.signUpText}>Reset Password</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.signInContainer}
            onPress={() => router.push("/sign-in" as RelativePathString)}
          >
            <Text style={styles.signInText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Index;
