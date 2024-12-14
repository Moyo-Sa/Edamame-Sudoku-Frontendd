import React from "react";

const UndoButton = ({ onClick, disabled }) => {
  return (
    <div>
      <button
        className="flex flex-col items-center text-[#6469ff] focus:outline-none"
        aria-label="Undo"
        onClick={() => {
          console.log("Undo button clicked");
          onClick();
        }}
      >
        <span className="text-5xl font-bold">↺</span>
        <span className="text-xs font-medium mt-1">Undo</span>
      </button>
    </div>
  );
};

export default UndoButton;
