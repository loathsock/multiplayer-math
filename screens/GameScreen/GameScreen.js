import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  Animated,
  interpolate,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import {
  getRandomArbitrary,
  randomizedOperationFuncs,
  randomizedOperationNumbers,
  shuffleArray,
  operationEval,
  correctAnswerForPlayerOne,
  correctAnswerForPlayerTwo,
} from "./gameLogic";
import { Audio } from "expo-av";

const GameScreen = () => {
  const translation = useRef(new Animated.Value(0)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const [numbers, setNumbers] = useState({});
  const [operationResult, setOperationResult] = useState();
  const [operation, setOperation] = useState();
  const [shuffledArrayChoices, setShuffledArrayChoices] = useState([]);
  const [choices, setChoices] = useState([]);
  const [updateQuestions, setUpdateQuestions] = useState(false);
  const [playerOneCounter, setPlayerOneCounter] = useState(0);
  const [playerTwoCounter, setPlayerTwoCounter] = useState(0);
  const [playerOneWins, setplayerOneWins] = useState(false);
  const [playerTwoWins, setplayerTwoWins] = useState(false);
  const [gameRestart, setGameRestart] = useState(false);
  const [correctSoundEffect, setCorrectSoundEffect] = useState();
  const [wrongSoundEffect, setWrongSoundEffect] = useState();

  // INITIALIZING NUMBERS AND MATH OPERATION
  const nums = randomizedOperationNumbers();
  const randOp = randomizedOperationFuncs();
  // SOUND TESTING

  async function playCorrectSoundEffect() {
    const { sound } = await Audio.Sound.createAsync(
      require("./../../assets/sounds/correct.wav")
    );
    setCorrectSoundEffect(sound);

    await sound.playAsync();
  }

  async function playWrongSoundEffect() {
    const { sound } = await Audio.Sound.createAsync(
      require("./../../assets/sounds/incorrect.mp3")
    );
    setWrongSoundEffect(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return correctSoundEffect
      ? () => {
          correctSoundEffect.unloadAsync();
        }
      : undefined;
  }, [correctSoundEffect]);

  useEffect(() => {
    return wrongSoundEffect
      ? () => {
          wrongSoundEffect.unloadAsync();
        }
      : undefined;
  }, [wrongSoundEffect]);

  // -------------------------------

  useEffect(() => {
    setShuffledArrayChoices([]);
    // IN CASE LEFT-HAND-SIDE NUMBER IS LESS THAN RIGHT-HAND-SIDE ONLY IN SUBTRACTION
    if (nums.leftHandSideNumber && nums.rightHandSideNumber) {
      if (
        nums.leftHandSideNumber < nums.rightHandSideNumber &&
        randOp === "-"
      ) {
        const leftNum = nums.leftHandSideNumber;
        const rightNum = nums.rightHandSideNumber;
        nums.leftHandSideNumber = rightNum;
        nums.rightHandSideNumber = leftNum;
        setNumbers(nums);
      } else {
        setNumbers(nums);
      }
    }
    setOperation(randOp);
  }, []);

  useEffect(() => {
    if (numbers.leftHandSideNumber && numbers.rightHandSideNumber) {
      const opResult = operationEval(
        numbers.leftHandSideNumber,
        operation,
        numbers.rightHandSideNumber
      );
      setOperationResult(opResult);
      const choiceOne = getRandomArbitrary(opResult, 8);
      const choiceTwo = getRandomArbitrary(8, opResult);

      setChoices([
        opResult,
        choiceOne !== opResult ? choiceOne : getRandomArbitrary(opResult, 15),
        choiceTwo !== opResult ? choiceTwo : getRandomArbitrary(15, opResult),
      ]);
    }
  }, [numbers]);

  useEffect(() => {
    const shuffledArray = shuffleArray(choices);
    setShuffledArrayChoices(shuffledArray);
  }, [choices]);

  useEffect(() => {
    setTimeout(() => {
      setOperation(randOp);
      if (nums.leftHandSideNumber && nums.rightHandSideNumber) {
        if (
          nums.leftHandSideNumber < nums.rightHandSideNumber &&
          randOp === "-"
        ) {
          const leftNum = nums.leftHandSideNumber;
          const rightNum = nums.rightHandSideNumber;
          nums.leftHandSideNumber = rightNum;
          nums.rightHandSideNumber = leftNum;
          setNumbers(nums);
        } else {
          setNumbers(nums);
        }
      }
    }, 650);
  }, [updateQuestions]);

  const restartGame = () => {
    setGameRestart(true);
    setplayerOneWins(false);
    setplayerTwoWins(false);
    setPlayerOneCounter(0);
    setPlayerTwoCounter(0);
  };

  // // GAME ANIMATIONS
  // const nextQAnimation = () => {
  //   setTimeout(() => {
  //     translation.setValue(0);
  //   }, 600);
  //   Animated.timing(translation, {
  //     toValue: 350,
  //     duration: 600,
  //     useNativeDriver: true,
  //   }).start(() => OutAndInScreen());
  // };

  const OutAndInScreen = () => {
    Animated.timing(translation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const nextQAnimation = () =>
    Animated.sequence([
      Animated.timing(translation, {
        toValue: 380,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

  // const counterColor = () => {
  //   Animated.timing(translation, {
  //     toValue: 1,
  //     duration: 400,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const COLOR = bgColor.interpolate({
  //   inputRange: [0, 300],
  //   outputRange: ["rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)"],
  // });
  return (
    <SafeAreaView
      style={
        playerTwoWins || playerOneWins
          ? styles.gameOverScreen
          : styles.container
      }
    >
      {playerTwoWins && (
        <Fragment>
          <View style={PlayersGameOverScreen.playerTwoGameOverScreen}>
            <Text style={{ color: "white", fontSize: 26 }}> You Win</Text>
          </View>

          <View style={PlayersGameOverScreen.midScreen}>
            <TouchableOpacity
              onPress={restartGame}
              style={PlayersGameOverScreen.restartButton}
            >
              <Text style={{ color: "white", fontSize: 26 }}>restart</Text>
            </TouchableOpacity>
          </View>

          <View style={PlayersGameOverScreen.playerOneGameOverScreen}>
            <Text style={{ color: "white", fontSize: 26 }}> You Lose</Text>
          </View>
        </Fragment>
      )}
      {playerOneWins && (
        <Fragment>
          <View style={PlayersGameOverScreen.playerOneGameOverScreen}>
            <Text style={{ color: "white", fontSize: 26 }}> You Win</Text>
          </View>

          <View style={PlayersGameOverScreen.midScreen}>
            <TouchableOpacity
              onPress={restartGame}
              style={PlayersGameOverScreen.restartButton}
            >
              <Text style={{ color: "white", fontSize: 26 }}>restart</Text>
            </TouchableOpacity>
          </View>

          <View style={PlayersGameOverScreen.playerTwoGameOverScreen}>
            <Text style={{ color: "white", fontSize: 26 }}> You Lose</Text>
          </View>
        </Fragment>
      )}

      <View
        style={
          playerTwoWins || playerOneWins
            ? { display: "none" }
            : styles.playerOneContainer
        }
      >
        <View style={gridStyles.playerTwoGrid}>
          <Animated.View
            style={[
              gridStyles.operation,
              {
                transform: [{ translateX: translation }],
              },
            ]}
          >
            <Text style={{ color: "white", fontSize: 38 }}>
              {" "}
              {numbers.leftHandSideNumber} {""}
              {operation === "*"
                ? "×"
                : [operation === "/" ? "÷" : operation]}{" "}
              {numbers.rightHandSideNumber}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              gridStyles.choiceButtonContainer,
              {
                transform: [{ translateX: translation }],
              },
            ]}
          >
            {shuffledArrayChoices &&
              shuffledArrayChoices.map((choice, index) => (
                <TouchableOpacity
                  onPress={() => {
                    if (correctAnswerForPlayerTwo(choice, operationResult)) {
                      nextQAnimation();
                      playCorrectSoundEffect();
                      setUpdateQuestions(!updateQuestions);
                      setPlayerTwoCounter((prev) =>
                        prev === 9 ? setplayerTwoWins(true) : prev + 1
                      );
                    }
                    if (!correctAnswerForPlayerTwo(choice, operationResult)) {
                      playWrongSoundEffect();
                      setPlayerTwoCounter((prev) =>
                        playerTwoCounter <= 0 ? (prev = 0) : prev - 1
                      );
                    }
                  }}
                  key={index}
                  style={gridStyles.choiceButton}
                >
                  <Text style={{ color: "white", fontSize: 28 }}>
                    {" "}
                    {choice}{" "}
                  </Text>
                </TouchableOpacity>
              ))}
          </Animated.View>

          <View style={gridStyles.counter}>
            <Text style={{ color: "white", fontSize: 24 }}>
              {" "}
              {playerTwoCounter}
            </Text>
          </View>
        </View>
      </View>

      {/* ---------------------   -------------- PLAYER ONE -------------------------------------- */}
      <View
        style={
          playerTwoWins || playerOneWins
            ? { display: "none" }
            : styles.midScreenMenu
        }
      >
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={() => {
            console.log("press");
          }}
        >
          <FontAwesomeIcon icon={faPause} size={36} color={"white"} />
        </TouchableOpacity>
      </View>

      <View
        style={
          playerTwoWins || playerOneWins
            ? { display: "none" }
            : styles.playerTwoContainer
        }
      >
        <View style={styles.playerOneContainer}>
          <View style={gridStyles.playerOneGrid}>
            <Animated.View
              style={[
                gridStyles.operation,
                {
                  transform: [{ translateX: translation }],
                },
              ]}
            >
              <Text style={{ color: "white", fontSize: 38 }}>
                {" "}
                {numbers.leftHandSideNumber} {""}
                {operation === "*"
                  ? "×"
                  : [operation === "/" ? "÷" : operation]}{" "}
                {numbers.rightHandSideNumber}{" "}
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                gridStyles.choiceButtonContainer,
                {
                  transform: [{ translateX: translation }],
                },
              ]}
            >
              {shuffledArrayChoices &&
                shuffledArrayChoices.map((choice, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (correctAnswerForPlayerOne(choice, operationResult)) {
                        playCorrectSoundEffect();
                        setUpdateQuestions(!updateQuestions);
                        setPlayerOneCounter((prev) =>
                          prev === 9 ? setplayerOneWins(true) : prev + 1
                        );
                        nextQAnimation();
                        counterColor();
                      }
                      if (!correctAnswerForPlayerOne(choice, operationResult)) {
                        playWrongSoundEffect();
                        setPlayerOneCounter((prev) =>
                          playerOneCounter <= 0 ? (prev = 0) : prev - 1
                        );
                      }
                    }}
                    key={index}
                    style={gridStyles.choiceButton}
                  >
                    <Text style={{ color: "white", fontSize: 28 }}>
                      {" "}
                      {choice}{" "}
                    </Text>
                  </TouchableOpacity>
                ))}
            </Animated.View>

            <Animated.View
              style={[
                gridStyles.counter,
                {
                  backgroundColor: COLOR,
                },
              ]}
            >
              <Text style={{ color: "white", fontSize: 24 }}>
                {" "}
                {playerOneCounter}
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
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
  gameOverContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
  },

  playerOneContainer: {
    flex: 1,
    backgroundColor: "#14A9B2",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "48%",
    zIndex: -1,
  },

  playerTwoContainer: {
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "48%",
    zIndex: -1,
  },

  midScreenMenu: {
    position: "relative",
    backgroundColor: "#df5745",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "4%",
  },
  pauseButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "18%",
    backgroundColor: "orange",
    color: "white",
    borderRadius: 12,
  },
  gameOverScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .8)",
  },
});

const gridStyles = StyleSheet.create({
  playerOneGrid: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: -1,
    marginTop: 15,
  },
  playerTwoGrid: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    transform: [{ rotate: "180deg" }],
    backgroundColor: "#14A9B2",
    marginBottom: 15,
  },

  operation: {
    width: "80%",
    height: 78,
    backgroundColor: "#313f4d",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "orange",
  },
  choiceButtonContainer: {
    width: "95%",
    height: 65,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  choiceButton: {
    width: 80,
    height: 60,
    backgroundColor: "#5a1a87",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  counter: {
    width: 80,
    height: 60,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});

const PlayersGameOverScreen = StyleSheet.create({
  playerOneGameOverScreen: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "48%",
    width: "100%",
    backgroundColor: "#14A9B2",
    zIndex: -1,
  },

  playerTwoGameOverScreen: {
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "48%",
    width: "100%",
    backgroundColor: "#14A9B2",
    transform: [{ rotate: "180deg" }],
    zIndex: -1,
  },

  midScreen: {
    position: "relative",
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "4%",
  },

  restartButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: "26%",
    backgroundColor: "orange",
    color: "white",
    borderRadius: 12,
    fontSize: 22,
  },
});

export default GameScreen;
