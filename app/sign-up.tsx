import TopAlert from '@/components/top-alert';
import { signUpWithEmail } from '@/service/auth-service';
import { saveAuth } from "@/store/auth-store";
import styles from '@/stylesheets/sign-up-stylesheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RelativePathString, router } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const Index = () => {
  const inset = useSafeAreaInsets();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureText, setSecureText] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);



const signUp = async () => {
  setLoading(true);

  try {

    if (!email.trim() || !password.trim()) {
      setAlert({
        message: "Email and password are required",
        type: "error",
      });
      return; 
    }


    const user = await signUpWithEmail(email, password);

    if (!user) throw new Error("Sign up failed");

    await saveAuth(user);

    setAlert({
      message: "Account Created Successfully",
      type: "success",
    });

    router.replace("/(tabs)");

  } catch (error: any) {
    console.log("Sign up error:", error);

    setAlert({
      message: error.message || "Sign up failed",
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
            ...styles.container
          }}
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
          ): (
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
              <ActivityIndicator size={'large'} color={"#4A90E2"}/>

              <Text style={styles.loadingText}>Signing In...</Text>
            </View>
          ): (
          <TouchableOpacity style={styles.signUpBtn} onPress={signUp}>
            <Text style={styles.signUpText}>
               Sign Up
            </Text>
          </TouchableOpacity>

          )}


          <TouchableOpacity
            style={styles.signInContainer}
            onPress={() => router.push('/sign-in' as RelativePathString)}
          >
            <Text style={styles.signInText}>Already have an account? Sign In</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Index;
