import React from "react";
import { useLocation } from "react-router-dom";

const GameButton = ({ onNumberClick }) => {
  const location = useLocation();
  const { board } = location.state || {};
  const buttons = Array.from({ length: board }, (_, index) => index + 1);

  return (
    <div className="sudoku-page">
      <div className="flex flex-wrap mt-3 gap-2">
        {buttons.map((num) => (
          <button
            key={num}
            className="text-white bg-[#ff9064] font-medium rounded-md text-sm w-10 h-10 flex items-center justify-center"
            onClick={() => onNumberClick(num)} // Call onNumberClick with the button number
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameButton;
