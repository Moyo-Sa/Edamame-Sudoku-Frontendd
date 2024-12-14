import React from "react";

const CheckButton = ({onClick}) => {
  return (
    <div>
      <button
      onClick={onClick}
        className="flex flex-col items-center text-[#6469ff] focus:outline-none translate-y-1"
        aria-label="Check-Puzzle"
        title="check puzzle"
      >
        {/* Icon */}
        <span className="text-4xl font-bold">✔</span>
        {/* Label */}
        <span className="text-xs font-medium mt-1">Check</span>
      </button>
    </div>
  );
};

export default CheckButton;
