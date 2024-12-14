import React from "react";

const UndoTillCorrect = ({onClick}) => {
  return (
    <button
      className="flex flex-col items-center text-[#6469ff] focus:outline-none"
      aria-label="Undo Until Correct"
      title="Undo Until Correct"
      onClick={onClick}
    >
      <span className="text-5xl font-bold">↺</span>
      <span className="text-xs font-medium mt-1">UUC</span>
    </button>
  );
};

export default UndoTillCorrect;
