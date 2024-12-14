import React from "react";
import SudokuBoard2 from "../components/SudokuBoard2";
import { useLocation } from "react-router-dom";
import GameButton from "../components/GameButton";

const Game = () => {
  const location = useLocation();
  const { name, difficulty, board } = location.state || {}; // Retrieve state from navigation

  let boardDimension = board === 9 ? "9x9" : "4x4";

  return (
    <section className="h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Sudoku Game
        </h1>
        <h2 className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Welcome {name}! You are playing Sudoku.
        </h2>
        <p className="text-lg text-[#666e75] text-[14px]">
          <span className="font-semibold">Difficulty: </span>
          <span className="text-sm mr-4">{difficulty}</span>
          <span className="font-semibold">Board Size: </span>
          <span className="text-sm">{boardDimension}</span>
        </p>
      </div>
      &nbsp;
      <div>
        <SudokuBoard2 />
      </div>
      &nbsp;
    </section>
  );
};

export default Game;
