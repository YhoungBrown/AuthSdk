import TopAlert from "@/components/top-alert";
import { env } from "@/env";
import {
  initializeGoogle,
  signInWithGoogle as SignInGoogle,
} from "@/hooks/use-google-auth";
import { signInWithEmail } from "@/service/auth-service";
import { saveAuth } from "@/store/auth-store";
import styles from "@/stylesheets/sign-in-stylesheet";
import { AuthConfig } from "@/type";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as AppleAuthentication from "expo-apple-authentication";
import { RelativePathString, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = ({ config }: { config?: AuthConfig }) => {
  const inset = useSafeAreaInsets();

  const providerConfig = {
    emailPassword: config?.emailPassword ?? true,
    google: config?.google ?? true,
    apple: config?.apple ?? true,
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureText, setSecureText] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [appleAvailable, setAppleAvailable] = useState<boolean>(false);

  initializeGoogle({
    webClientId: env.clientId,
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    (async () => {
      const available = await AppleAuthentication.isAvailableAsync();
      setAppleAvailable(available);
    })();
  }, []);

  const signIn = async () => {
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setAlert({
          message: "Email and password are required",
          type: "error",
        });

        setLoading(false);
        return;
      }

      const user = await signInWithEmail(email, password);

      if (!user) throw new Error("Login failed");

      await saveAuth(user);

      setAlert({
        message: "Sign-In Successful",
        type: "success",
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Sign in error:", error);

      setAlert({
        message: error.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {};

  const signInWithGoogle = async () => {
    setLoading(true);

    try {
      const { user } = await SignInGoogle();

      if (!user) throw new Error("Login failed");

      await saveAuth(user);

      setAlert({
        message: "Sign-In Successful",
        type: "success",
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Sign in error:", error);

      setAlert({
        message: error.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {alert && (
          <TopAlert
            message={alert.message}
            duration={4000}
            type={alert.type}
            onHide={() => setAlert(null)}
          />
        )}

        <View
          style={{
            paddingTop: inset.top,
            paddingBottom: inset.bottom,
            ...styles.container,
          }}
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
            onPress={() =>
              router.push("/forgot-password" as RelativePathString)
            }
          >
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.activityContainer}>
              <ActivityIndicator size={"large"} color={"#4A90E2"} />

              <Text style={styles.loadingText}>Signing In...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.signInBtn} onPress={signIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.googleButton}
            onPress={signInWithGoogle}
          >
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {providerConfig.apple && appleAvailable && (
            <TouchableOpacity
              style={[styles.googleButton, { marginTop: 20 }]}
              onPress={signInWithApple}
            >
              <Text style={styles.googleText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={() => router.push("/sign-up" as RelativePathString)}
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

export default Index;
