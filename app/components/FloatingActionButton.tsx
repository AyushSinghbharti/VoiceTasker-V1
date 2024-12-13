import React from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  onPress: () => void;
  isRec: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  isRec,
}) => {
  const animatedValue = new Animated.Value(0);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.9],
        }),
      },
    ],
  };

  if (isRec) {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View style={[styles.buttonStart, animatedStyle]}>
          <MaterialCommunityIcons name="microphone" size={40} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        // style={styles.container}
        style={[styles.container]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <MaterialCommunityIcons name="microphone" size={32} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  buttonStart: {
    backgroundColor: "#FF3B30",
    height: 100,
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Default export
export default FloatingActionButton;
