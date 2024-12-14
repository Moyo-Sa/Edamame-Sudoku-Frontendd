import React, { useState, useEffect } from "react";
import GameButton from "./GameButton";
import { useNavigate, useLocation } from "react-router-dom";
import UndoButton from "./UndoButton";
import UndoTillCorrect from "./UndoTillCorrect";
import axios from "axios";
import CheckButton from "./CheckButton";

const computeInitialGrid = (board) =>
  board === 9
    ? Array.from({ length: 9 }, () => Array(9).fill(0))
    : Array.from({ length: 4 }, () => Array(4).fill(0));

const SudokuBoard2 = () => {
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // Track the selected cell
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);
  const [originalGrid, setOriginalGrid] = useState([]);
  const [historyStack, setHistoryStack] = useState([]);
  const [solutionData, setSolutionData] = useState(null);
  const [hintCounter, setHintCounter] = useState(0);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState([]);

  const navigate = useNavigate();
  const [gameID, setGameID] = useState(0);
  const location = useLocation();
  const board = location.state?.board;
  const nameF = location.state?.name;
  const difficulty = location.state?.difficulty;
  const size = board === 9 ? "9x9" : "4x4";

  const initialGrid = computeInitialGrid(board);
  const [grid, setGrid] = useState(initialGrid);

  // Initialize notesGrid: each cell will have an array of notes
  const [notesGrid, setNotesGrid] = useState(
    board === 9
      ? Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
      : Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => []))
  );

  // For toggling notes mode (on Notes button click)
  const toggleNotesMode = () => {
    setIsNotesMode((prev) => !prev);
  };

  //for toggling pause button
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  //time format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;

    // Start the timer only if the puzzle is not complete and the game is not paused
    if (!isPuzzleComplete && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup: clear the interval when paused or puzzle is complete
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, isPuzzleComplete]); // Dependency on isPaused and isPuzzleComplete

  useEffect(() => {
    const calculateGameID = () => {
      let id = 0;

      if (size === "4x4" && difficulty === "Easy") {
        id = Math.floor(Math.random() * 3) + 1;
      } else if (size === "4x4" && difficulty === "Medium") {
        id = Math.floor(Math.random() * 3) + 4;
      } else if (size === "4x4" && difficulty === "Hard") {
        id = Math.floor(Math.random() * 3) + 7;
      } else if (size === "9x9" && difficulty === "Easy") {
        id = Math.floor(Math.random() * 3) + 10;
      } else if (size === "9x9" && difficulty === "Medium") {
        id = Math.floor(Math.random() * 3) + 13;
      } else if (size === "9x9" && difficulty === "Hard") {
        id = Math.floor(Math.random() * 3) + 16;
      }

      setGameID(id); // Set gameID state
      setName(nameF);
    };

    calculateGameID();
  }, [size, difficulty]);

  const backClick = () => {
    navigate("/");
    setTimer(0);
    setScore(0);
  };

  // Add the initial state of the grid to history on mount
  useEffect(() => {
    if (!history.length) {
      setHistory([initialGrid]);
    }
  }, [initialGrid, history.length]);

  // Fetch puzzle for the game
  useEffect(() => {
    const fetchPuzzle = async () => {
      if (gameID !== 0 && originalGrid.length === 0) {
        try {
          console.log("When I get here, Updated GameID:", gameID);

          const response = await fetch(
            `https://edamame-sudoku-backend.onrender.com/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/gameArray`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const gameData = await response.json();
          if (response.ok) {
            setGrid(gameData);
            setOriginalGrid(gameData);
          } else {
            throw new Error("Failed to load puzzle");
          }
        } catch (error) {
          console.error("Error fetching puzzle data:", error);
        }
      } else {
        console.log("GameID is 0; fetch skipped.");
      }
    };

    const fetchSolution = () => {
      axios
        .get(
          `https://edamame-sudoku-backend.onrender.com/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/solutionArray`
        )
        .then((res) => {
          console.log("Solution: ", res.data);
          setSolutionData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (gameID > 0) {
      fetchPuzzle();
      fetchSolution();
    }
  }, [gameID, difficulty, size, originalGrid.length]);

  //scoring
  const calculateScore = () => {
    const baseScore = 1000; // Example base score
    const timePenalty = timer * 10; // Deduct points based on time taken
    const hintPenalty = hintCounter * 50; // Deduct points based on hints used
    const finalScore = Math.max(0, baseScore - timePenalty - hintPenalty);
    setScore(finalScore);
  };

  useEffect(() => {
    if (gameID > 0 && solutionData && checkPuzzleComplete()) {
      calculateScore();
    }
  }, [gameID, solutionData, timer, hintCounter, grid]);

  // Update grid or notes with selected number
  const updateGrid = (number) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;

      // If it's a pre-filled cell, do nothing
      if (
        originalGrid[rowIndex][colIndex] !== null &&
        originalGrid[rowIndex][colIndex] !== 0
      ) {
        alert("This cell has been pre-filled");
        return;
      }

      if (isNotesMode) {
        // Add or remove number from notes of the selected cell
        setNotesGrid((prevNotesGrid) => {
          const newNotes = [...prevNotesGrid[rowIndex][colIndex]];
          // If the number already exists in the notes, remove it; otherwise add it
          const noteIndex = newNotes.indexOf(number);
          if (noteIndex > -1) {
            newNotes.splice(noteIndex, 1);
          } else {
            newNotes.push(number);
          }

          const updated = prevNotesGrid.map((r, i) =>
            i === rowIndex
              ? r.map((c, j) => (j === colIndex ? newNotes : c))
              : r
          );

          return updated;
        });
      } else {
        // Setting the cell value and clearing notes for that cell
        const updatedGrid = grid.map((r, i) =>
          i === rowIndex ? r.map((c, j) => (j === colIndex ? number : c)) : r
        );

        setGrid(updatedGrid);
        setHistoryStack((prevStack) => [
          ...prevStack,
          { row: rowIndex, col: colIndex, value: number },
        ]);

        // Clear notes for that cell since it's now filled
        setNotesGrid((prevNotesGrid) => {
          const updated = prevNotesGrid.map((r, i) =>
            i === rowIndex ? r.map((c, j) => (j === colIndex ? [] : c)) : r
          );
          return updated;
        });
      }
    }
  };

  useEffect(() => {
    console.log("Grid updated in state:", grid);
  }, [grid]);

  // Undo function
  const undoGrid = () => {
    if (historyStack.length > 0) {
      const lastEntry = historyStack[historyStack.length - 1];

      // Revert the grid
      const updatedGrid = grid.map((r, i) =>
        i === lastEntry.row
          ? r.map((c, j) => (j === lastEntry.col ? null : c))
          : r
      );

      setGrid(updatedGrid);

      // Remove the last entry from historyStack
      setHistoryStack((prevStack) => prevStack.slice(0, -1));

      // Also clear notes from that cell if needed (not strictly necessary if notes were cleared at finalization)
      setNotesGrid((prevNotesGrid) => {
        const updated = prevNotesGrid.map((r, i) =>
          i === lastEntry.row
            ? r.map((c, j) => (j === lastEntry.col ? [] : c))
            : r
        );
        return updated;
      });
    }
  };

  // Check puzzle completion
  const checkPuzzleComplete = () => {
    return grid.every((row) =>
      row.every((cell) => cell !== null && cell !== 0)
    );
  };

  useEffect(() => {
    if (checkPuzzleComplete()) {
      if (!isPuzzleComplete) {
        setIsPuzzleComplete(true);
      }

      if (!solutionData && gameID > 0) {
        fetchSolution();
        setName(nameF);
      }
    } else {
      if (isPuzzleComplete) {
        setIsPuzzleComplete(false);
      }
    }
  }, [grid, isPuzzleComplete, solutionData, gameID]);

  // Compare arrays
  const deepCompare = (arr1, arr2) => {
    return arr1.every((row, i) => row.every((cell, j) => cell === arr2[i][j]));
  };

  // Handle complete puzzle
  const handlePuzzleComplete = async () => {
    console.log("I got to handle Puzzle");

    if (solutionData) {
      if (deepCompare(solutionData, grid)) {
        setIsPuzzleComplete(true);
        setTimer(0);
        navigate("/win", { state: { name, score } });
      } else {
        navigate("/lost", { state: { name, score } });
      }
    }
  };

  // Undo until correct
  const undoUntilCorrect = async () => {
    if (!solutionData) {
      console.error("Solution is not available.");
      return;
    }

    try {
      const response = await fetch(
        "https://edamame-sudoku-backend.onrender.com/api/sudoku/undoUntilCorrect",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalGrid,
            solution: solutionData,
            historyStack,
          }),
        }
      );

      if (response.ok) {
        const { correctedGrid, firstMistakeIndex } = await response.json();

        if (JSON.stringify(correctedGrid) !== JSON.stringify(grid)) {
          setGrid(correctedGrid);
          console.log(
            "Grid successfully reverted to the state before the first mistake."
          );

          if (firstMistakeIndex !== null) {
            setHistoryStack((prevStack) =>
              prevStack.slice(0, firstMistakeIndex)
            );
          }

          // Clear notes for cells that are now finalized
          // (Optional: If you want to ensure no conflicting notes remain)
          setNotesGrid((prevNotesGrid) => {
            return prevNotesGrid.map((row, i) =>
              row.map((notesArray, j) => {
                if (correctedGrid[i][j] && correctedGrid[i][j] !== 0) {
                  return []; // Clear notes if cell finalized
                }
                return notesArray;
              })
            );
          });
        } else {
          console.log("No changes made to the grid.");
        }
      } else {
        console.error("Failed to undo until the correct state");
      }
    } catch (error) {
      console.error("Error in undoUntilCorrect:", error);
    }
  };

  //check progress

  const checkProgress = async () => {
    if (!solutionData) {
      alert("Solution not loaded yet.");
      return;
    }

    try {
      const response = await fetch(
        "https://edamame-sudoku-backend.onrender.com/api/sudoku/checkProgress",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentGrid: grid,
            solutionGrid: solutionData,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIncorrectCells(data.incorrectCells);
      } else {
        console.error("Failed to check progress");
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };

  // Hint function
  const giveHint = () => {
    setHintCounter(hintCounter + 1);
    if (!solutionData) {
      alert("Solution not loaded yet, please wait.");
      return;
    }

    // Gather all cells that are empty or incorrect
    const hintableCells = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const currentVal = grid[i][j];
        const correctVal = solutionData[i][j];
        // Cell is empty (null or 0) or incorrect
        if (
          currentVal === null ||
          currentVal === 0 ||
          currentVal !== correctVal
        ) {
          hintableCells.push({ row: i, col: j, correctVal });
        }
      }
    }

    if (hintableCells.length === 0) {
      alert(
        "No available hints. The puzzle might already be correct or complete."
      );
      return;
    }

    // Select one random cell from the available hintable cells
    const randomIndex = Math.floor(Math.random() * hintableCells.length);
    const { row, col, correctVal } = hintableCells[randomIndex];

    const updatedGrid = grid.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? correctVal : c))
        : r
    );

    setGrid(updatedGrid);
    setHistoryStack((prevStack) => [
      ...prevStack,
      { row, col, value: correctVal },
    ]);

    // Clear notes for that cell because it is now filled
    setNotesGrid((prevNotesGrid) => {
      const updated = prevNotesGrid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? [] : c))
          : r
      );
      return updated;
    });
  };

  //pause
  // useEffect(() => {
  //   if (!isPuzzleComplete && !isPaused) {
  //     const interval = setInterval(() => {
  //       setTimer((prev) => prev + 1);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [isPuzzleComplete, isPaused]);

  if (!grid || grid.length === 0) {
    return <div>Loading puzzle...</div>;
  }

  return (
    <div className="sudoku-page">
      <div>
        <div className="header flex justify-between items-center">
          <button className="back-button" onClick={backClick}>
            ← Back
          </button>
          &nbsp; &nbsp;
          <div className="score">Score: {score}</div>
          &nbsp; &nbsp;
          <div className="timer">Time: {formatTime(timer)}</div>
          &nbsp; &nbsp;
          <div>
            <button
              onClick={togglePause}
              className="absolute top-4 right-4 px-6 py-2 bg-[#ff9064] text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-500 focus:outline-none"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
        &nbsp;
        <div
          className={`game-container ${
            isPaused ? "filter blur-sm pointer-events-none" : ""
          }`}
        >
          <div className="flex justify-between items-center px-4">
            <UndoButton
              onClick={undoGrid}
              disabled={historyStack.length === 0}
            />
            &nbsp;
            {/* Notes button toggles notes mode */}
            <button
              onClick={toggleNotesMode}
              className={`px-2 py-1 rounded ${
                isNotesMode ? "bg-green-500" : "bg-gray-500"
              } text-white`}
            >
              Notes
            </button>
            &nbsp;
            <UndoTillCorrect onClick={undoUntilCorrect} />
            &nbsp;
            {/* Add Hint Button */}
            <button
              onClick={giveHint}
              disabled={hintCounter > 2}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Hint
            </button>
            &nbsp;
            <div>
              <CheckButton onClick={checkProgress} />
            </div>
          </div>
          &nbsp;
          {/* Sudoku Grid */}
          <div
            className={`sudoku-grid grid ${
              board === 9 ? "grid-cols-9" : "grid-cols-4"
            } gap-1 max-w-md`}
          >
            {grid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isGiven =
                    originalGrid[rowIndex] &&
                    originalGrid[rowIndex][colIndex] !== null &&
                    originalGrid[rowIndex][colIndex] !== 0;
                  const cellValue = cell === null || cell === 0 ? "" : cell;

                  // Display notes if cell is empty and notes exist
                  const cellNotes = notesGrid[rowIndex][colIndex];
                  const showNotes =
                    !cellValue && cellNotes && cellNotes.length > 0;

                  return (
                    <div
                      key={colIndex}
                      onClick={() => setSelectedCell([rowIndex, colIndex])}
                      className={`relative sudoku-cell w-12 h-12 text-center border 
                      ${
                        rowIndex % 3 === 2 && rowIndex !== board - 1
                          ? "border-b-2"
                          : "border-b"
                      } 
                      ${
                        colIndex % 3 === 2 && colIndex !== board - 1
                          ? "border-r-2"
                          : "border-r"
                      } 
                      border-gray-400 focus:outline-none
                      ${isGiven ? "bg-gray-200" : ""}
                      ${
                        selectedCell &&
                        selectedCell[0] === rowIndex &&
                        selectedCell[1] === colIndex
                          ? "bg-blue-200"
                          : ""
                      }
                      ${
                        incorrectCells.some(
                          (cell) =>
                            cell.row === rowIndex && cell.col === colIndex
                        )
                          ? "bg-red-200"
                          : ""
                      }`}
                    >
                      {cellValue ? (
                        <span className="leading-[3.5rem] text-xl font-bold">
                          {cellValue}
                        </span>
                      ) : showNotes ? (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-center">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((noteNumber) => (
                            <div
                              key={noteNumber}
                              className={`flex items-center justify-center ${
                                cellNotes.includes(noteNumber)
                                  ? ""
                                  : "opacity-0"
                              }`}
                            >
                              <span className="text-[0.75rem] leading-[1rem] font-semibold">
                                {noteNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div>
            <GameButton onNumberClick={updateGrid} />
          </div>
          <div>
            {isPuzzleComplete ? (
              <button
                onClick={handlePuzzleComplete}
                className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Complete Puzzle
              </button>
            ) : (
              <button className="mt-3 text-white bg-[#2309172e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                Keep Going...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuBoard2;
