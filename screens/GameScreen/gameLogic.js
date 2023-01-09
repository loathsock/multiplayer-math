import { evaluate } from "mathjs";

export const randomizedOperationNumbers = () => {
  const leftHandSideNumber = Math.floor(Math.random() * 10) + 1;
  const rightHandSideNumber = Math.floor(Math.random() * 10) + 1;

  return { leftHandSideNumber, rightHandSideNumber };
};

export function randomizedOperationFuncs() {
  const operations = ["+", "-", "*"];
  const rand = Math.floor(Math.random() * operations.length);
  const randomOperation = operations[rand];
  return randomOperation;
}

export const operationEval = (leftHandSide, op, rightHandSide) => {
  const result = evaluate(`${leftHandSide} ${op} ${rightHandSide}`);
  return result;
};

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
export const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const correctAnswerForPlayerOne = (choice, correct) => {
  if (choice === correct) {
    return true;
  }
  return false;
};

export const correctAnswerForPlayerTwo = (choice, correct) => {
  if (choice === correct) {
    return true;
  }
  return false;
};

export const gameOver = (counter) => {
  if (counter === 10) {
    return true;
  }
};
