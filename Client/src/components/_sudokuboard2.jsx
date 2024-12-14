// import React, { useState, useEffect } from "react";
// import GameButton from "./GameButton";
// import { useNavigate, useLocation } from "react-router-dom";
// import Notes from "./Notes";
// import UndoButton from "./UndoButton";
// import UndoTillCorrect from "./UndoTillCorrect";
// import axios from 'axios'

// const computeInitialGrid = (board) =>
//   board === 9
//     ? Array.from({ length: 9 }, () => Array(9).fill(0))
//     : Array.from({ length: 4 }, () => Array(4).fill(0));

// const SudokuBoard2 = () => {
//   const [timer, setTimer] = useState(0);
//   const [score, setScore] = useState(0);
//   const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
//   const [selectedCell, setSelectedCell] = useState(null); // Track the selected cell
//   const [name, setName] = useState("");
//   const [history, setHistory] = useState([]);
//   const [originalGrid, setOriginalGrid] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [historyStack, setHistoryStack] = useState([])

//   const variable = 0;

//   const navigate = useNavigate();
//   const [gameID, setGameID] = useState(0);

//   const location = useLocation();
//   const board = location.state?.board;
//   const nameF = location.state?.name;
//   const difficulty = location.state?.difficulty;
//   const size = board === 9 ? "9x9" : "4x4";

//   useEffect(() => {
//     const calculateGameID = () => {
//       let id = 0;

//       if (size === "4x4" && difficulty === "Easy") {
//         id = Math.floor(Math.random() * 3) + 1;
//       } else if (size === "4x4" && difficulty === "Medium") {
//         id = Math.floor(Math.random() * 3) + 4;
//       } else if (size === "4x4" && difficulty === "Hard") {
//         id = Math.floor(Math.random() * 3) + 7;
//       } else if (size === "9x9" && difficulty === "Easy") {
//         id = Math.floor(Math.random() * 3) + 10;
//       } else if (size === "9x9" && difficulty === "Medium") {
//         id = Math.floor(Math.random() * 3) + 13;
//       } else if (size === "9x9" && difficulty === "Hard") {
//         id = Math.floor(Math.random() * 3) + 16;
//       }

//       setGameID(id); // Set gameID state
//     };

//     calculateGameID();
//   }, [size, difficulty]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isPuzzleComplete) {
//         setTimer((prev) => prev + 1);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isPuzzleComplete]);

//   const backClick = () => {
//     navigate("/");
//     setTimer(0);
//     setScore(0);
//   };

//   const initialGrid = computeInitialGrid(board)
//   // console.log(typeof(initialGrid))
//   const [grid, setGrid] = useState(initialGrid);
//   // console.log('type of grid', typeof(grid))

//   // Add the initial state of the grid to history on mount
//   useEffect(() => {
//     if (!history.length) { // Only initialize history once
//       setHistory([initialGrid]);
//     }
//   }, [initialGrid, history.length]);

//   //fecth puzzle for game
//   useEffect(() => {
//     const fetchPuzzle = async () => {
//       if (gameID !== 0 && originalGrid.length === 0) {
//         try {
//           console.log("When I get here, Updated GameID:", gameID);

//           const response = await fetch(
//             `http://localhost:3000/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/gameArray`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const gameData = await response.json();
//           if (response.ok) {
//             setGrid(gameData);
//             setOriginalGrid(gameData);
//           } else {
//             throw new Error("Failed to load puzzle");
//           }
//         } catch (error) {
//           console.error("Error fetching puzzle data:", error);
//         }
//       } else {
//         console.log("GameID is 0; fetch skipped.");
//       }
//     };

//     const fetchSolution = () => {
//       axios.get(`http://localhost:3000/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/solutionArray`).then(res => {
//         console.log('Solution: ', res.data)
//         setSolutionData(res.data);
//       }).catch(err => {console.log(err)})
//     }

//     if (gameID > 0) {
//       fetchPuzzle();
//       fetchSolution();
//     }
//   }, [gameID, difficulty, size]);

//   // Function to update the grid/history stack with a selected number
//   const updateGrid = (number) => {
//     if (selectedCell) {
//       const [rowIndex, colIndex] = selectedCell;
//       console.log("This is the grid after selected cell", grid);

//       if (originalGrid[rowIndex][colIndex] === null) {
//         const updatedGrid = grid.map((r, i) =>
//           i === rowIndex ? r.map((c, j) => (j === colIndex ? number : c)) : r
//         );

//         setGrid(updatedGrid);

//         setHistoryStack((prevStack) => [
//           ...prevStack,
//           { row: rowIndex, col: colIndex, value: number }
//         ]);

//         // Update history and current step
//         // const updatedHistory = history.slice(0, currentStep + 1); // Discard future steps if we're making a new move
//         // updatedHistory.push(updatedGrid);
//         // setHistory(updatedHistory);
//         // setCurrentStep(updatedHistory.length - 1);
//       } else {
//         alert("This cell has been pre-filled");
//       }
//     }
//     //create a useState for previous history then update it with grid
//   };

//   useEffect(() => {
//   console.log("Grid updated in state:", grid);
// }, [grid]);

//   //function to undo
//   const undoGrid = () => {
//     if (historyStack.length > 0) {
//       const lastEntry = historyStack[historyStack.length - 1];

//       // Revert the grid
//       const updatedGrid = grid.map((r, i) =>
//         i === lastEntry.row
//           ? r.map((c, j) => (j === lastEntry.col ? 0 : c))
//           : r
//       );

//       setGrid(updatedGrid);

//       // Remove the last entry from historyStack
//       setHistoryStack((prevStack) => prevStack.slice(0, -1));
//     }
//   };

//   //Solution
//   const [solutionData, setSolutionData] = useState(null);

//   // Function to check if all cells in the puzzle are filled
//   const checkPuzzleComplete = () => {
//     return grid.every((row) =>
//       row.every((cell) => cell !== null && cell !== 0)
//     );
//   };

//   // useEffect to monitor puzzle changes and check if it's complete
//   useEffect(() => {
//     if (checkPuzzleComplete()) {
//       if (!isPuzzleComplete) {
//         setIsPuzzleComplete(true); // Only update if it hasn't been set already
//       }

//       if (!solutionData && gameID > 0) {
//         fetchSolution();
//       }
//     } else {
//       if (isPuzzleComplete) {
//         setIsPuzzleComplete(false); // Reset if puzzle becomes incomplete
//       }
//     }
//   }, [grid, isPuzzleComplete, solutionData]);

//   //compare arrays
//   const deepCompare = (arr1, arr2) => {
//     return arr1.every((row, i) => row.every((cell, j) => cell === arr2[i][j]));
//   };

//   //handleComplete
//   const handlePuzzleComplete = async () => {
//     console.log("I got to handle Puzzle");

//     // Compare with the solution
//     if (solutionData) {
//       if (deepCompare(solutionData, grid)) {
//         setIsPuzzleComplete(true);
//         setScore(10000 - timer);
//         setTimer(0);
//         navigate("/win", { state: { name } });
//       } else {
//         navigate("/lost", { state: { name } });
//       }
//     }
//   };

//   // Function to undo until the last correct state
// // Example of calling the updated undoUntilCorrect endpoint:
// // const undoUntilCorrect = async () => {
// //   if (!solutionData) {
// //     console.error("Solution is not available.");
// //     return;
// //   }

// //   try {
// //     const response = await fetch('http://localhost:3000/api/sudoku/undoUntilCorrect', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         originalGrid,
// //         solution: solutionData,
// //         historyStack
// //       })
// //     });

// //     if (response.ok) {
// //       const { correctedGrid } = await response.json();

// //       // Update the grid if it differs
// //       if (JSON.stringify(correctedGrid) !== JSON.stringify(grid)) {
// //         setGrid(correctedGrid);
// //         console.log("Grid successfully reverted to the state before the first mistake.");

// //         // You may also want to update the historyStack to reflect this change:
// //         // Remove all moves from first mistake onward
// //         // (This logic would need to match whatever index was found in the backend)
// //         // For simplicity, since we don't know the exact index here,
// //         // you may consider returning it from the backend as well.
// //       } else {
// //         console.log("No changes made to the grid.");
// //       }
// //     } else {
// //       console.error("Failed to undo until the correct state");
// //     }
// //   } catch (error) {
// //     console.error("Error in undoUntilCorrect:", error);
// //   }
// // };

// const undoUntilCorrect = async () => {
//   if (!solutionData) {
//     console.error("Solution is not available.");
//     return;
//   }

//   try {
//     const response = await fetch('http://localhost:3000/api/sudoku/undoUntilCorrect', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         originalGrid,
//         solution: solutionData,
//         historyStack
//       })
//     });

//     if (response.ok) {
//       const { correctedGrid, firstMistakeIndex } = await response.json();

//       // Update the grid if it differs
//       if (JSON.stringify(correctedGrid) !== JSON.stringify(grid)) {
//         setGrid(correctedGrid);
//         console.log("Grid successfully reverted to the state before the first mistake.");

//         // If firstMistakeIndex is not null, truncate historyStack
//         if (firstMistakeIndex !== null) {
//           setHistoryStack((prevStack) => prevStack.slice(0, firstMistakeIndex));
//         }
//       } else {
//         console.log("No changes made to the grid.");
//       }
//     } else {
//       console.error("Failed to undo until the correct state");
//     }
//   } catch (error) {
//     console.error("Error in undoUntilCorrect:", error);
//   }
// };

//   if (!grid || grid.length === 0) {
//     return <div>Loading puzzle...</div>;
//   }

//   return (
//     <div className="sudoku-page">
//       <div className="header flex justify-between items-center">
//         <button className="back-button" onClick={backClick}>
//           ← Back
//         </button>
//         &nbsp; &nbsp;
//         <div className="score">Score: {score}</div>
//         &nbsp; &nbsp;
//         <div className="timer">Time: {timer}s</div>
//       </div>
//       &nbsp;
//       <div className="flex justify-between items-center px-4">
//       <UndoButton onClick={undoGrid} disabled={historyStack.length === 0} />
//         &nbsp;
//         <Notes />
//         &nbsp;
//         <UndoTillCorrect onClick={undoUntilCorrect}/>
//       </div>
//       &nbsp;
//       {/* Sudoku Grid */}
//       <div
//         className={`sudoku-grid grid ${
//           board === 9 ? "grid-cols-9" : "grid-cols-4"
//         } gap-1 max-w-md`}
//       >
//         {grid.map((row, rowIndex) => (
//           <React.Fragment key={rowIndex}>
//             {row.map((cell, colIndex) => (
//               <input
//                 key={colIndex}
//                 type="text"
//                 maxLength="1"
//                 className={`sudoku-cell w-10 h-10 text-center border
//                 ${
//                   rowIndex % 3 === 2 && rowIndex !== board - 1
//                     ? "border-b-2"
//                     : "border-b"
//                 }

//                 ${
//                   colIndex % 3 === 2 && colIndex !== board - 1
//                     ? "border-r-2"
//                     : "border-r"
//                 }
//                 border-gray-400 focus:outline-none
//                 ${
//                   originalGrid[rowIndex] &&
//                   originalGrid[rowIndex][colIndex] !== null
//                     ? "bg-gray-200" // Original cell style (optional, adjust color)
//                     : ""
//                 }
//                 ${
//                   selectedCell &&
//                   selectedCell[0] === rowIndex &&
//                   selectedCell[1] === colIndex
//                     ? "bg-blue-200" // Conditional class for highlighting selected cell
//                     : ""
//                 }

//               `}
//                 value={cell === null ? "" : cell}
//                 onClick={() => setSelectedCell([rowIndex, colIndex])} // Set selected cell on click
//                 readOnly // Prevent typing directly
//               />
//             ))}
//           </React.Fragment>
//         ))}

//       </div>
//       <div>
//         <GameButton onNumberClick={updateGrid} />{" "}
//       </div>
//       <div>
//         {isPuzzleComplete ? (
//           <button
//             onClick={handlePuzzleComplete}
//             className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//           >
//             Complete Puzzle
//           </button>
//         ) : (
//           <button className="mt-3 text-white bg-[#2309172e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
//             Keep Going...
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SudokuBoard2;

// import React, { useState, useEffect } from "react";
// import GameButton from "./GameButton";
// import { useNavigate, useLocation } from "react-router-dom";
// import Notes from "./Notes";
// import UndoButton from "./UndoButton";
// import UndoTillCorrect from "./UndoTillCorrect";
// import axios from 'axios'

// const computeInitialGrid = (board) =>
//   board === 9
//     ? Array.from({ length: 9 }, () => Array(9).fill(0))
//     : Array.from({ length: 4 }, () => Array(4).fill(0));

// const SudokuBoard2 = () => {
//   const [timer, setTimer] = useState(0);
//   const [score, setScore] = useState(0);
//   const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
//   const [selectedCell, setSelectedCell] = useState(null); // Track the selected cell
//   const [name, setName] = useState("");
//   const [history, setHistory] = useState([]);
//   const [originalGrid, setOriginalGrid] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [historyStack, setHistoryStack] = useState([]);
//   const [solutionData, setSolutionData] = useState(null);
//   const [hintCounter, setHintCounter] = useState(0);

//   const variable = 0;
//   const navigate = useNavigate();
//   const [gameID, setGameID] = useState(0);
//   const location = useLocation();
//   const board = location.state?.board;
//   const nameF = location.state?.name;
//   const difficulty = location.state?.difficulty;
//   const size = board === 9 ? "9x9" : "4x4";

//   useEffect(() => {
//     const calculateGameID = () => {
//       let id = 0;

//       if (size === "4x4" && difficulty === "Easy") {
//         id = Math.floor(Math.random() * 3) + 1;
//       } else if (size === "4x4" && difficulty === "Medium") {
//         id = Math.floor(Math.random() * 3) + 4;
//       } else if (size === "4x4" && difficulty === "Hard") {
//         id = Math.floor(Math.random() * 3) + 7;
//       } else if (size === "9x9" && difficulty === "Easy") {
//         id = Math.floor(Math.random() * 3) + 10;
//       } else if (size === "9x9" && difficulty === "Medium") {
//         id = Math.floor(Math.random() * 3) + 13;
//       } else if (size === "9x9" && difficulty === "Hard") {
//         id = Math.floor(Math.random() * 3) + 16;
//       }

//       setGameID(id); // Set gameID state
//     };

//     calculateGameID();
//   }, [size, difficulty]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isPuzzleComplete) {
//         setTimer((prev) => prev + 1);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isPuzzleComplete]);

//   const backClick = () => {
//     navigate("/");
//     setTimer(0);
//     setScore(0);
//   };

//   const initialGrid = computeInitialGrid(board)
//   const [grid, setGrid] = useState(initialGrid);

//   // Add the initial state of the grid to history on mount
//   useEffect(() => {
//     if (!history.length) {
//       setHistory([initialGrid]);
//     }
//   }, [initialGrid, history.length]);

//   // Fetch puzzle for the game
//   useEffect(() => {
//     const fetchPuzzle = async () => {
//       if (gameID !== 0 && originalGrid.length === 0) {
//         try {
//           console.log("When I get here, Updated GameID:", gameID);

//           const response = await fetch(
//             `http://localhost:3000/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/gameArray`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const gameData = await response.json();
//           if (response.ok) {
//             setGrid(gameData);
//             setOriginalGrid(gameData);
//           } else {
//             throw new Error("Failed to load puzzle");
//           }
//         } catch (error) {
//           console.error("Error fetching puzzle data:", error);
//         }
//       } else {
//         console.log("GameID is 0; fetch skipped.");
//       }
//     };

//     const fetchSolution = () => {
//       axios.get(`http://localhost:3000/api/sudoku/puzzle/${difficulty}/${size}/${gameID}/solutionArray`)
//         .then(res => {
//           console.log('Solution: ', res.data)
//           setSolutionData(res.data);
//         }).catch(err => {console.log(err)})
//     }

//     if (gameID > 0) {
//       fetchPuzzle();
//       fetchSolution();
//     }
//   }, [gameID, difficulty, size, originalGrid.length]);

//   // Update grid with selected number
//   const updateGrid = (number) => {
//     if (selectedCell) {
//       const [rowIndex, colIndex] = selectedCell;
//       console.log("This is the grid after selected cell", grid);

//       if (originalGrid[rowIndex][colIndex] === null) {
//         const updatedGrid = grid.map((r, i) =>
//           i === rowIndex ? r.map((c, j) => (j === colIndex ? number : c)) : r
//         );

//         setGrid(updatedGrid);

//         setHistoryStack((prevStack) => [
//           ...prevStack,
//           { row: rowIndex, col: colIndex, value: number }
//         ]);
//       } else {
//         alert("This cell has been pre-filled");
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("Grid updated in state:", grid);
//   }, [grid]);

//   // Undo function
//   const undoGrid = () => {
//     if (historyStack.length > 0) {
//       const lastEntry = historyStack[historyStack.length - 1];

//       // Revert the grid
//       const updatedGrid = grid.map((r, i) =>
//         i === lastEntry.row
//           ? r.map((c, j) => (j === lastEntry.col ? null : c))
//           : r
//       );

//       setGrid(updatedGrid);

//       // Remove the last entry from historyStack
//       setHistoryStack((prevStack) => prevStack.slice(0, -1));
//     }
//   };

//   // Check puzzle completion
//   const checkPuzzleComplete = () => {
//     return grid.every((row) =>
//       row.every((cell) => cell !== null && cell !== 0)
//     );
//   };

//   useEffect(() => {
//     if (checkPuzzleComplete()) {
//       if (!isPuzzleComplete) {
//         setIsPuzzleComplete(true);
//       }

//       if (!solutionData && gameID > 0) {
//         fetchSolution();
//       }
//     } else {
//       if (isPuzzleComplete) {
//         setIsPuzzleComplete(false);
//       }
//     }
//   }, [grid, isPuzzleComplete, solutionData, gameID]);

//   // Compare arrays
//   const deepCompare = (arr1, arr2) => {
//     return arr1.every((row, i) => row.every((cell, j) => cell === arr2[i][j]));
//   };

//   // Handle complete puzzle
//   const handlePuzzleComplete = async () => {
//     console.log("I got to handle Puzzle");

//     if (solutionData) {
//       if (deepCompare(solutionData, grid)) {
//         setIsPuzzleComplete(true);
//         setScore(10000 - timer);
//         setTimer(0);
//         navigate("/win", { state: { name } });
//       } else {
//         navigate("/lost", { state: { name } });
//       }
//     }
//   };

//   // Undo until correct
//   const undoUntilCorrect = async () => {
//     if (!solutionData) {
//       console.error("Solution is not available.");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/sudoku/undoUntilCorrect', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           originalGrid,
//           solution: solutionData,
//           historyStack
//         })
//       });

//       if (response.ok) {
//         const { correctedGrid, firstMistakeIndex } = await response.json();

//         if (JSON.stringify(correctedGrid) !== JSON.stringify(grid)) {
//           setGrid(correctedGrid);
//           console.log("Grid successfully reverted to the state before the first mistake.");

//           if (firstMistakeIndex !== null) {
//             setHistoryStack((prevStack) => prevStack.slice(0, firstMistakeIndex));
//           }
//         } else {
//           console.log("No changes made to the grid.");
//         }
//       } else {
//         console.error("Failed to undo until the correct state");
//       }
//     } catch (error) {
//       console.error("Error in undoUntilCorrect:", error);
//     }
//   };

//   // -------------------------
//   // Added Hint Button
//   // -------------------------
//   const giveHint = () => {
//     setHintCounter(hintCounter + 1)
//     if (!solutionData) {
//       alert("Solution not loaded yet, please wait.");
//       return;
//     }

//     // Find the first cell that is null or incorrect
//     for (let i = 0; i < grid.length; i++) {
//       for (let j = 0; j < grid[i].length; j++) {
//         const currentVal = grid[i][j];
//         const correctVal = solutionData[i][j];
//         // Cell is empty (null or 0) or incorrect
//         if ((currentVal === null || currentVal === 0) || currentVal !== correctVal) {
//           // Provide the hint by setting this cell to correctVal
//           const updatedGrid = grid.map((r, rowIndex) =>
//             rowIndex === i
//               ? r.map((c, colIndex) => (colIndex === j ? correctVal : c))
//               : r
//           );

//           setGrid(updatedGrid);
//           setHistoryStack((prevStack) => [
//             ...prevStack,
//             { row: i, col: j, value: correctVal }
//           ]);

//           // Only give one hint, then break out
//           return;
//         }
//       }
//     }

//     alert("No available hints. The puzzle might already be correct or complete.");
//   };

//   if (!grid || grid.length === 0) {
//     return <div>Loading puzzle...</div>;
//   }

//   return (
//     <div className="sudoku-page">
//       <div className="header flex justify-between items-center">
//         <button className="back-button" onClick={backClick}>
//           ← Back
//         </button>
//         &nbsp; &nbsp;
//         <div className="score">Score: {score}</div>
//         &nbsp; &nbsp;
//         <div className="timer">Time: {timer}s</div>
//       </div>
//       &nbsp;
//       <div className="flex justify-between items-center px-4">
//         <UndoButton onClick={undoGrid} disabled={historyStack.length === 0} />
//         &nbsp;
//         <Notes />
//         &nbsp;
//         <UndoTillCorrect onClick={undoUntilCorrect}/>
//         &nbsp;
//         {/* Add Hint Button */}
//         <button onClick={giveHint} disabled={hintCounter > 2} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Hint
//         </button>
//       </div>
//       &nbsp;
//       {/* Sudoku Grid */}
//       <div
//         className={`sudoku-grid grid ${
//           board === 9 ? "grid-cols-9" : "grid-cols-4"
//         } gap-1 max-w-md`}
//       >
//         {grid.map((row, rowIndex) => (
//           <React.Fragment key={rowIndex}>
//             {row.map((cell, colIndex) => (
//               <input
//                 key={colIndex}
//                 type="text"
//                 maxLength="1"
//                 className={`sudoku-cell w-10 h-10 text-center border
//                 ${
//                   rowIndex % 3 === 2 && rowIndex !== board - 1
//                     ? "border-b-2"
//                     : "border-b"
//                 }

//                 ${
//                   colIndex % 3 === 2 && colIndex !== board - 1
//                     ? "border-r-2"
//                     : "border-r"
//                 }
//                 border-gray-400 focus:outline-none
//                 ${
//                   originalGrid[rowIndex] &&
//                   originalGrid[rowIndex][colIndex] !== null
//                     ? "bg-gray-200"
//                     : ""
//                 }
//                 ${
//                   selectedCell &&
//                   selectedCell[0] === rowIndex &&
//                   selectedCell[1] === colIndex
//                     ? "bg-blue-200"
//                     : ""
//                 }
//               `}
//                 value={cell === null ? "" : cell}
//                 onClick={() => setSelectedCell([rowIndex, colIndex])}
//                 readOnly
//               />
//             ))}
//           </React.Fragment>
//         ))}
//       </div>
//       <div>
//         <GameButton onNumberClick={updateGrid} />
//       </div>
//       <div>
//         {isPuzzleComplete ? (
//           <button
//             onClick={handlePuzzleComplete}
//             className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//           >
//             Complete Puzzle
//           </button>
//         ) : (
//           <button className="mt-3 text-white bg-[#2309172e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
//             Keep Going...
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SudokuBoard2;
