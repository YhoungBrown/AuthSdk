import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

import { signUpWithEmail } from "hng-auth-sdk";

import { AuthRegisterProps } from "../types";

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

export const AuthRegisterScreen = ({
  onSuccess,
  onLoginPress,
  onError,
  style,
}: AuthRegisterProps) => {
  const inset = useSafeAreaInsets();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureText, setSecureText] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSignUp = async () => {
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }

      const user = await signUpWithEmail(email, password);

      if (!user) throw new Error("Sign up failed");

      setToast({ message: "Account Created Successfully", type: "success" });

      setTimeout(() => {
        onSuccess(user);
      }, 1000);
    } catch (error: any) {
      console.log("Sign up error:", error);

      if (onError) {
        onError(error.message || "Sign up failed");
      } else {
        setToast({
          message: error.message || "Sign up failed",
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
        {/* Render Toast if active */}
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
            style, // Apply custom style overrides
          ]}
        >
          <Text style={styles.signInTitle}>Sign Up</Text>

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

          {loading ? (
            <View style={styles.activityContainer}>
              <ActivityIndicator size={"large"} color={"#4A90E2"} />
              <Text style={styles.loadingText}>Creating Account...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.signInContainer}
            onPress={onLoginPress}
          >
            <Text style={styles.signInText}>
              Already have an account? Sign In
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
    padding: 16,
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
  signUpBtn: {
    width: "100%",
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    marginVertical: 20,
    justifyContent: "flex-start",
    marginRight: "auto",
    marginTop: 30,
  },
  signInText: {
    color: "#4A90E2",
    fontSize: 16,
    textDecorationLine: "underline",
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
