
import React, { useState, useEffect } from "react";

const emptyBoard = Array(9).fill(null);

const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }; // Return winner & winning line
    }
  }
  return board.includes(null) ? null : { winner: "Draw", line: [] };
};

// Minimax Algorithm with Alpha-Beta Pruning (for Hard Mode)
const minimax = (board, depth, alpha, beta, isMaximizing) => {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === "X") return -10 + depth;
    if (result.winner === "O") return 10 - depth;
    return 0; // Draw
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let move = -1;

  board.forEach((cell, index) => {
    if (!cell) {
      board[index] = isMaximizing ? "O" : "X";
      let score = minimax(board, depth + 1, alpha, beta, !isMaximizing);
      board[index] = null;

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (score < bestScore) {
          bestScore = score;
          move = index;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) return bestScore;
    }
  });

  return depth === 0 ? move : bestScore;
};

// AI Move Selection Based on Difficulty
const getAIMove = (board, mode) => {
  if (mode === "Easy") {
    const availableMoves = board.map((cell, i) => (cell === null ? i : null)).filter(i => i !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  } else {
    return minimax(board, 0, -Infinity, Infinity, true);
  }
};

const TicTacToe = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [isPlayerFirst, setIsPlayerFirst] = useState(true);
  const [winningLine, setWinningLine] = useState([]);
  const [mode, setMode] = useState("Easy"); // Default mode is Easy
  const result = checkWinner(board);
  const winner = result ? result.winner : null;

  useEffect(() => {
    if (winner && winner !== "Draw") {
      setWinningLine(result.line);
    }
  }, [winner]);

  useEffect(() => {
    if (turn === "O" && !winner) {
      setTimeout(() => {
        const bestMove = getAIMove(board, mode);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = "O";
          setBoard(newBoard);
          setTurn("X");
        }
      }, 300);
    }
  }, [turn, board, winner, mode]);

  const handleClick = (index) => {
    if (board[index] || winner || turn === "O") return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setTurn("O");
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setWinningLine([]); // Reset winning line
    setIsPlayerFirst(!isPlayerFirst);
    setTurn(isPlayerFirst ? "O" : "X");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Tic-Tac-Toe</h1>
      
      {/* Mode Selection */}
      <div className="mb-4">
        <label className="mr-2">Difficulty:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="p-1 bg-gray-800 border border-white rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
           <button
           key={index}
           className={`w-24 h-24 text-6xl flex items-center justify-center 
             border-2 rounded-lg hover:cursor-pointer
             ${winningLine.includes(index) ? "bg-green-500 text-white border-green-700" : ""} 
             ${winner === "Draw" ? "bg-gray-600 animate-pulse" : "bg-amber-50"} 
             ${cell === "X" ? "text-red-600 font-bold border-red-600" : ""} 
             ${cell === "O" ? "text-blue-600 font-bold border-blue-600" : ""}`}
           onClick={() => handleClick(index)}
           disabled={!!cell || winner}
         >
           {cell}
         </button>
        ))}
      </div>

      {/* Game Status */}
      <p className="mt-4 text-lg font-bold">
        {winner
          ? winner === "Draw"
          ? "It's a Draw! 🤝"
          : winner === "X"
          ? "You Win! 🎉"
          : "You Lose! 😢"
          : `Turn: ${turn}`}
      </p>

      {/* Restart Button */}
      <button className="mt-4 bg-blue-500 px-4 py-2 rounded-lg" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
};

export default TicTacToe;

