import React from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useLocation } from "react-router-dom";

const Win = () => {
  const location = useLocation();
  const name = location.state?.name;
  const score = location.state?.score;

  console.log("name is ", name);
  {
    return (
      <div className="relative flex flex-col justify-between h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-purple-800">
        {/* Confetti */}
        <Confetti className="absolute top-0 left-0 w-full h-full" />

        {/* Winning Message */}
        <div className="flex flex-col justify-center items-center flex-grow text-center">
          <h1 className="text-4xl font-bold mb-6 animate-pulse">
            🥳 Congratulations {name}!! You Won! 🥳
          </h1>
          <div>
            <h1 className="font-bold mb">You scored {score}points</h1>
          </div>
          &nbsp; &nbsp;
          {/* Fun Animation */}
          <div className="text-6xl animate-bounce">🏆</div>
        </div>

        {/* New Game Button */}
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="text-white bg-[#6469ff] font-medium rounded-md text-sm sm:w-auto px-5 py-2.5 text-center"
          >
            New Game
          </Link>
        </div>
      </div>
    );
  }
};

export default Win;
