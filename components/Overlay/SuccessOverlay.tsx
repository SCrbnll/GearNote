import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle
} from "react-native";

type Props = {
  onFinish: () => void;
  successIcon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  duration?: number; // total duration (default: 3000ms)
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const SuccessOverlay: React.FC<Props> = ({
  onFinish,
  successIcon,
  loadingText = "Guardando...",
  successText = "Completado",
  duration = 3000,
  style,
  textStyle,
}) => {
  const [showCheck, setShowCheck] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const halfway = duration * 0.6;
    const fadeOutStart = duration;

    const timer1 = setTimeout(() => setShowCheck(true), halfway);
    const timer2 = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => onFinish());
    }, fadeOutStart);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [duration]);

  return (
    <Animated.View style={[styles.overlay, style, { opacity: fadeAnim }]}>
      {showCheck ? (
        successIcon ?? (
          <Text style={{ fontSize: 64, color: "#4CAF50" }}>✔️</Text>
        )
      ) : (
        <ActivityIndicator size="large" color="#FE9525" />
      )}
      <Text style={[styles.text, textStyle]}>
        {showCheck ? successText : loadingText}
      </Text>
    </Animated.View>
  );
};

export default SuccessOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  text: {
    color: "white",
    fontSize: 18,
    marginTop: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
