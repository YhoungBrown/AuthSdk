import { Image } from 'expo-image';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TopAlert from '@/components/top-alert';
import { logout } from '@/service/auth-service';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
   const [alert, setAlert] = useState<{
      message: string;
      type: "success" | "error";
    } | null>(null);


 const handleLogout = async () => {
  setLoading(true);

  try {
    await logout(); 
console.log("got here")
    router.replace("/"); 
  } catch (error: any) {
    console.log("Logout error:", error);

    
    setAlert({
      message: error.message || "Logout failed",
      type: "error"
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>


      {alert && (
          <TopAlert
            message={alert.message}
            duration={4000}
            type={alert.type}
            onHide={() => setAlert(null)} 
          />
        )}


      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => ""} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => ""}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => ""}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>


      <View style={{marginTop: 20}}/>

      {loading ? (
        <ActivityIndicator size={"large"} color={"#4A90E2"} style={styles.ActivityIndicator}/>
      ) : (
      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logOutText}>Log Out</Text>
      </TouchableOpacity>

      )}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  logoutContainer: {
    borderWidth: 1,
    padding: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    height: 55,
    borderColor: "#4A90E2"
  },
  logOutText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#4A90E2"
  },
  ActivityIndicator:{
    justifyContent: "center",
    alignItems: "center"
  },
});
