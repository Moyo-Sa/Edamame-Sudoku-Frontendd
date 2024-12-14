import React from "react";

const Notes = () => {
  return (
    <div>
      <button
        className="flex flex-col items-center text-[#6469ff] focus:outline-none translate-y-1"
        aria-label="Notes"
        title="Notes"
      >
        {/* Icon */}
        <span className="text-4xl font-bold">✎</span>
        {/* Label */}
        <span className="text-xs font-medium mt-1">Notes</span>
      </button>
    </div>
  );
};

export default Notes;
