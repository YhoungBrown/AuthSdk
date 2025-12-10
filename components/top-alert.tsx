import styles from "@/stylesheets/top-alert-stylesheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import { Animated, Text, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopAlertProps {
  message: string;
  duration?: number;
  type?: "success" | "error";
  onHide?: () => void;
}

const TopAlert = ({ message, duration = 3000, type = "success", onHide }: TopAlertProps) => {
  const inset = useSafeAreaInsets();

 
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const containerStyle: ViewStyle =
    type === "error" ? styles.alertError : styles.alertSuccess;

  const textStyle =
    type === "error" ? styles.alertErrorText : styles.alertSuccessText;



useEffect(() => {
  const visibleOffset = inset.top + 10 - 65;

  Animated.parallel([
    Animated.timing(slideAnim, {
      toValue: visibleOffset,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }),
  ]).start();

  const timer = setTimeout(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => finished && onHide?.());
  }, duration);

  return () => clearTimeout(timer);
}, [duration, inset.top]);


  return (
    <Animated.View
      style={[
         styles.alertBase,   
        containerStyle,          
        {
          position: "absolute",
          left: 0,
          right: 0,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          zIndex: 9999,
          padding: 15
        },
      ]}
    >
      <Ionicons
        name={type === "error" ? "warning" : "checkmark-circle"}
        size={24}
        color="#fff"
      />
      <Text style={textStyle}>{message}</Text>
    </Animated.View>
  );
};

export default TopAlert;
