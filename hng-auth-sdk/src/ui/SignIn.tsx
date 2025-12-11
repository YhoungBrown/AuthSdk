import Ionicons from "@expo/vector-icons/Ionicons";
import * as AppleAuthentication from "expo-apple-authentication";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
} from "hng-auth-sdk";

import { AuthLoginProps } from "../types";

const { width } = Dimensions.get("window");

const SDKToast = ({
  message,
  type,
  onHide,
}: {
  message: string;
  type: "success" | "error";
  onHide: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        toastStyles.container,
        { transform: [{ translateY: slideAnim }] },
        type === "error" ? toastStyles.error : toastStyles.success,
      ]}
    >
      <Ionicons
        name={type === "error" ? "warning" : "checkmark-circle"}
        size={24}
        color="#fff"
      />
      <Text style={toastStyles.text}>{message}</Text>
    </Animated.View>
  );
};

export const AuthLoginScreen = ({
  config,
  onSuccess,
  onRegisterPress,
  onForgotPasswordPress,
  onGooglePress,
  onApplePress,
  onError,
  style,
}: AuthLoginProps) => {
  const inset = useSafeAreaInsets();

  const providerConfig = {
    google: config?.enableGoogle ?? true,
    apple: config?.enableApple ?? true,
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureText, setSecureText] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [appleAvailable, setAppleAvailable] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    (async () => {
      const available = await AppleAuthentication.isAvailableAsync();
      setAppleAvailable(available);
    })();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }

      const user = await signInWithEmail(email, password);

      if (!user) throw new Error("Login failed");

      setToast({ message: "Sign-In Successful", type: "success" });

      setTimeout(() => {
        onSuccess(user);
      }, 500);
    } catch (error: any) {
      if (onError) {
        onError(error.message || "Something went wrong");
      } else {
        setToast({
          message: error.message || "Something went wrong",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (onGooglePress) await onGooglePress();
      else await signInWithGoogle();

      setToast({ message: "Sign-In Successful", type: "success" });
    } catch (error: any) {
      if (onError) {
        onError(error.message || "Google Sign-In Failed");
      } else {
        setToast({
          message: error.message || "Google Sign-In Failed",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      if (onApplePress) await onApplePress();
      else await signInWithApple();

      setToast({ message: "Sign-In Successful", type: "success" });
    } catch (error: any) {
      if (onError) {
        onError(error.message || "Apple Sign-In Failed");
      } else {
        setToast({
          message: error.message || "Apple Sign-In Failed",
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
        {toast && (
          <SDKToast
            message={toast.message}
            type={toast.type}
            onHide={() => setToast(null)}
          />
        )}

        <View
          style={[
            {
              paddingTop: inset.top,
              paddingBottom: inset.bottom,
            },
            styles.container,
            style,
          ]}
        >
          <Text style={styles.signInTitle}>Sign In</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.emailTextInput}
            onChangeText={setEmail}
            value={email}
          />

          {Platform.OS === "ios" ? (
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry={secureText}
                style={styles.passwordTextInput}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#4A90E2"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.androidPasswordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry={secureText}
                style={styles.passwordTextInput}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#4A90E2"
                />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={onForgotPasswordPress}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.activityContainer}>
              <ActivityIndicator size={"large"} color={"#4A90E2"} />
              <Text style={styles.loadingText}>Signing In...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}

          {providerConfig.google && (
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          )}

          {providerConfig.apple && appleAvailable && (
            <TouchableOpacity
              style={[styles.googleButton, { marginTop: 20 }]}
              onPress={handleAppleSignIn}
            >
              <Text style={styles.googleText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={onRegisterPress}
          >
            <Text style={styles.signUpText}>
              Don’t have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  error: {
    backgroundColor: "#FF5252",
  },
  text: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  signInTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
  },
  emailTextInput: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: "#fff",
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  androidPasswordContainer: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passwordTextInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  signInBtn: {
    width: "100%",
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    width: "100%",
    borderColor: "#4A90E2",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  forgotPasswordContainer: {
    marginVertical: 10,
    marginBottom: 20,
    marginLeft: "auto",
  },
  forgotPasswordText: {
    color: "#4A90E2",
    fontSize: 16,
  },
  signUpText: {
    color: "#4A90E2",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signUpContainer: {
    marginVertical: 20,
    justifyContent: "flex-start",
    marginRight: "auto",
    marginTop: 30,
  },
  activityContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
  },
  loadingText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#fff",
  },
});
