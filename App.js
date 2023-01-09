import React, { Fragment, useState } from "react";
import GameScreen from "./screens/GameScreen/GameScreen";
import StartScreen from "./screens/GameScreen/startScreen";

export default function App() {
  const [startGame, setStartGame] = useState(false);
  console.log(startGame);

  return (
    <GameScreen />
    // <Fragment>
    //   {startGame ? (
    //     <GameScreen />
    //   ) : (
    //     <StartScreen setStartGameState={() => setStartGame(true)} />
    //   )}
    // </Fragment>
  );
}
