import React from "react";
//import SudokuBoard from "./components/SudokuBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import { Home, Game, Win, Lost } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />

        {/* Game page route */}
        <Route path="/game" element={<Game />} />

        {/* Win page route */}
        <Route path="/win" element={<Win />} />

        {/* Lose page route */}
        <Route path="/lost" element={<Lost />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
