import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { initializeAuth, saveAuth, useAuthStore } from '@/store/auth-store';
import { router } from 'expo-router';


import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [authChecked, setAuthChecked] = useState(false);


  useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  const checkAuth = async () => {
    await initializeAuth(); 

    const { status, user } = useAuthStore.getState();

    
    if (status === 'tokenExpired') {
      router.replace('/');
      setAuthChecked(true);
      return;
    }

    
    if (status === 'authenticated' && user) {
      router.replace('/(tabs)');
      setAuthChecked(true);
      return;
    }

    
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveAuth(user);
        router.replace('/(tabs)');
      }
      setAuthChecked(true);
    });
  };

  checkAuth();

  return () => unsubscribe?.();
}, []);



  if (!authChecked) {
   
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='index'>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
