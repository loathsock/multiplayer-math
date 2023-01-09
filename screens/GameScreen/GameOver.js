import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";

const GameOver = () => {
  const [startGame, setStartGame] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .5)",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" && StatusBar.currentHeight,
    height: "10%",
  },
});

export default GameOver;
