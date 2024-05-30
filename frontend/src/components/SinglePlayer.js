import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid'; // Assuming you have a Grid component for rendering
import '../style/game.css';

function SinglePlayer() {
  // Initial game state setup
  const numRows = 7;
  const numColumns = 5;
  const initialGoalColor = getRandomColor();
  const initialGrid = initializeGrid(numRows, numColumns);

  const [grid, setGrid] = useState(initialGrid);
  const [goalColor, setGoalColor] = useState(initialGoalColor); // Initialize goalColor before createInitialPlayer
  const [player, setPlayer] = useState(createInitialPlayer());
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Function to create initial player state
  function createInitialPlayer() {
    const startSquare = findAvailableSquare(initialGrid);
    startSquare.occupied = true;
    const playerScore = calculatePlayerScore(startSquare.color);
    return {
      playerRow: startSquare.row,
      playerCol: startSquare.col,
      playerColor: startSquare.color,
      playerScore: playerScore,
      playerUsername: "Player1",
      locked: false,
    };
  }

  // Function to find an available square
  function findAvailableSquare(grid) {
    const availableSquares = grid.filter(square => !square.occupied && !square.deleted);
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    return availableSquares[randomIndex];
  }

  // Function to initialize grid with random colors
  function initializeGrid(rows, columns) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        grid.push({
          row: row,
          col: col,
          color: getPseudoRandomColor(),
          deleted: false,
          occupied: false,
        });
      }
    }
    return grid;
  }

  // Helper functions to generate colors
  function getRandomColor() {
    const letters = '0123456789abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getPseudoRandomColor() {
    const letters = '0123456789abcdef';
    const colors = ['#ff0000', '#0000ff', '#00ff00', '#000000', '#ffffff', '#00ffff', '#ff00ff', '#ffff00'];
    const probability = 1 / 3;

    if (Math.random() < probability) {
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }

  // Helper functions for color manipulation
  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function mixColors(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
    const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
    const mixedB = Math.round((rgb1.b + rgb2.b) / 2);

    return rgbToHex(mixedR, mixedG, mixedB);
  }

  // Function to handle player movement
const handleMove = useCallback((direction) => {
  if (gameOver) return;

  let newPlayerRow = player.playerRow;
  let newPlayerCol = player.playerCol;

  switch (direction) {
    case 'left':
      newPlayerCol -= 1;
      break;
    case 'right':
      newPlayerCol += 1;
      break;
    case 'up':
      newPlayerRow -= 1;
      break;
    case 'down':
      newPlayerRow += 1;
      break;
    default:
      return;
  }

  const newSquare = grid.find(square => square.row === newPlayerRow && square.col === newPlayerCol);

  // Allow movement into deleted squares as well
  if (newSquare && !newSquare.occupied && newPlayerRow >= 0 && newPlayerRow < numRows && newPlayerCol >= 0 && newPlayerCol < numColumns) {
    const updatedGrid = [...grid];
    const oldSquare = updatedGrid.find(square => square.row === player.playerRow && square.col === player.playerCol);

    oldSquare.occupied = false;
    newSquare.occupied = true;
    const mixedColor = mixColors(oldSquare.color, newSquare.color);

    if (!newSquare.deleted) {
      newSquare.color = mixedColor;
    } else {
      newSquare.color = oldSquare.color;
      newSquare.deleted = false;  // Reactivate the deleted square
    }

    const newPlayer = {
      ...player,
      playerRow: newPlayerRow,
      playerCol: newPlayerCol,
      playerColor: newSquare.color,
      playerScore: calculatePlayerScore(newSquare.color)  // Use new square's color
    };

    oldSquare.deleted = true;

    setGrid(updatedGrid);
    setPlayer(newPlayer);
  }
}, [player, grid, gameOver]);


  // Calculate player score
  function calculatePlayerScore(playerColor) {
    const goalRgb = hexToRgb(goalColor);
    const playerRgb = hexToRgb(playerColor);

    const colorDifference = Math.sqrt(
      Math.pow(goalRgb.r - playerRgb.r, 2) +
      Math.pow(goalRgb.g - playerRgb.g, 2) +
      Math.pow(goalRgb.b - playerRgb.b, 2)
    );

    const maxDifference = Math.sqrt(Math.pow(255, 2) * 3);
    const percentage = Math.max(0, 100 - (colorDifference / maxDifference) * 100);

    return parseFloat(percentage.toFixed(1));
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            handleMove('up');
            break;
          case 'ArrowDown':
          case 's':
            handleMove('down');
            break;
          case 'ArrowLeft':
          case 'a':
            handleMove('left');
            break;
          case 'ArrowRight':
          case 'd':
            handleMove('right');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove]);

  // Check if the game is over
  useEffect(() => {
    if (grid.every(square => square.deleted)) {
      setGameOver(true);
    }
  }, [grid]);

  return (
    <div className="game">
      {gameOver && <p>Game Over!</p>}
      <Grid
        numRows={numRows}
        numColumns={numColumns}
        grid={grid}
        playerSessionId={"single-player"}
        player={player}
        playerUsername={player.playerUsername}
        currentPlayerSessionId={"single-player"}
        currentPlayerUsername={player.playerUsername}
        goalColor={goalColor}
      />
    </div>
  );
}

export default SinglePlayer;
