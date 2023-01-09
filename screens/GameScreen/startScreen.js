import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const StartScreen = (props) => {
  console.log(props.setStartGameState);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.setStartGameState(true);
        }}
        style={styles.startButton}
      >
        <Text style={{ color: "white", fontSize: 30 }}>Start Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14A9B2",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" && StatusBar.currentHeight,
    height: "10%",
  },
  startButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: "60%",
    backgroundColor: "orange",
    borderRadius: 12,
  },
});

export default StartScreen;
