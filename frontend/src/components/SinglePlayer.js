import React, { useState, useEffect, useCallback } from "react";
import {
  getRandomColor,
  getPseudoRandomColor,
  hexToRgb,
  rgbToHex,
  mixColors,
} from "./ColorFunctions";
import Grid from "./Grid";
import "../style/game.css";

function SinglePlayer() {
  // Initial game state setup
  const numRows = 7;
  const numColumns = 5;
  // Note: Do not call functions inside of useState() using parentheses
  // Order matters when doing this initialization
  const [grid, setGrid] = useState(initializeGrid);
  const [startSquare, setStartSquare] = useState(findAvailableSquare);
  const [goalColor, setGoalColor] = useState(createInitialGoalColor);
  const [player, setPlayer] = useState(createInitialPlayer);
  const [gameOver, setGameOver] = useState(false);
  const [lockTriggered, setLockTriggered] = useState(false);
  // log things here if needed
  // console.log("player", player);
  // console.log("start square", startSquare);

  // Function to create initial player state
  function createInitialPlayer() {
    startSquare.occupied = true;
    const playerPercentage = calculatePlayerPercentage(startSquare.color);
    const playerCurrentScore = calculatePlayerScore(playerPercentage);
    const playerTotalScore = 0;

    return {
      playerRow: startSquare.row,
      playerCol: startSquare.col,
      playerColor: startSquare.color,
      playerPercentage: playerPercentage,
      playerTotalScore: playerTotalScore,
      playerCurrentScore: playerCurrentScore,
      playerUsername: "Player1",
      locked: false,
    };
  }

  // Function to create initial goal color
  function createInitialGoalColor() {
    // Clone the grid to simulate moves
    const clonedGrid = JSON.parse(JSON.stringify(grid));
    let currentRow = startSquare.row;
    let currentCol = startSquare.col;
    let currentColor = startSquare.color;
    const directions = ["left", "right", "up", "down"];
    const numMoves = Math.floor(Math.random() * 5) + 6; // Random number between 6 and 10

    // Array to log the moves
    const moves = [];

    for (let i = 0; i < numMoves; i++) {
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      let newRow = currentRow;
      let newCol = currentCol;

      switch (randomDirection) {
        case "left":
          newCol -= 1;
          break;
        case "right":
          newCol += 1;
          break;
        case "up":
          newRow -= 1;
          break;
        case "down":
          newRow += 1;
          break;
        default:
          break;
      }

      const currentSquare = clonedGrid.find(
        (square) => square.row === currentRow && square.col === currentCol
      );
      const newSquare = clonedGrid.find(
        (square) => square.row === newRow && square.col === newCol
      );

      // Check if the new position is valid
      if (
        newSquare &&
        newRow >= 0 &&
        newRow < numRows &&
        newCol >= 0 &&
        newCol < numColumns
      ) {
        var mixedColor = "";
        if (!newSquare.deleted) {
          mixedColor = mixColors(currentColor, newSquare.color);
        } else {
          mixedColor = currentColor;
        }

        currentSquare.deleted = true;

        currentColor = mixedColor;
        currentRow = newRow;
        currentCol = newCol;

        // Log the move
        moves.push({
          direction: randomDirection,
          newRow,
          newCol,
          newColor: mixedColor,
        });
      } else {
        i--;
      }
    }

    // Function to remove unnecessary moves at the end of the array
    function cleanUpMoves(moves) {
      let lastColor = moves[numMoves - 1].newColor;

      for (let i = numMoves - 2; i >= 0; i--) {
        if (lastColor === moves[i].newColor) {
          moves.pop();
        } else {
          break;
        }
      }
      // Iterate from the end of the moves array
    }

    cleanUpMoves(moves);
    console.log("moves", moves); // You can log the moves array to see the logged moves
    // You can log the moves array to see the logged moves
    return currentColor;
  }

  // Function to find an available square
  function findAvailableSquare() {
    const availableSquares = grid.filter(
      (square) => !square.occupied && !square.deleted
    );
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    return availableSquares[randomIndex];
  }

  // Function to initialize grid with random colors
  function initializeGrid() {
    const grid = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
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

  // Function to handle player movement
  const handleMove = useCallback(
    (direction) => {
      if (gameOver) return;

      let newPlayerRow = player.playerRow;
      let newPlayerCol = player.playerCol;

      switch (direction) {
        case "left":
          newPlayerCol -= 1;
          break;
        case "right":
          newPlayerCol += 1;
          break;
        case "up":
          newPlayerRow -= 1;
          break;
        case "down":
          newPlayerRow += 1;
          break;
        default:
          return;
      }

      const newSquare = grid.find(
        (square) => square.row === newPlayerRow && square.col === newPlayerCol
      );

      // Allow movement into deleted squares as well
      if (
        newSquare &&
        !newSquare.occupied &&
        newPlayerRow >= 0 &&
        newPlayerRow < numRows &&
        newPlayerCol >= 0 &&
        newPlayerCol < numColumns
      ) {
        const updatedGrid = [...grid];
        const oldSquare = updatedGrid.find(
          (square) =>
            square.row === player.playerRow && square.col === player.playerCol
        );

        oldSquare.occupied = false;
        newSquare.occupied = true;
        const mixedColor = mixColors(oldSquare.color, newSquare.color);

        if (!newSquare.deleted) {
          newSquare.color = mixedColor;
        } else {
          newSquare.color = oldSquare.color;
          newSquare.deleted = false; // Reactivate the deleted square
        }
        const playerPercentage = calculatePlayerPercentage(newSquare.color);
        const playerCurrentScore = calculatePlayerScore(playerPercentage);
        const newPlayer = {
          ...player,
          playerRow: newPlayerRow,
          playerCol: newPlayerCol,
          playerColor: newSquare.color,
          playerPercentage: playerPercentage,
          playerCurrentScore: playerCurrentScore,
        };

        oldSquare.deleted = true;

        setGrid(updatedGrid);
        setPlayer(newPlayer);
      }
    },
    [player, grid, gameOver]
  );

  // Calculate player percentage
  function calculatePlayerPercentage(playerColor) {
    const goalRgb = hexToRgb(goalColor);
    const playerRgb = hexToRgb(playerColor);

    const colorDifference = Math.sqrt(
      Math.pow(goalRgb.r - playerRgb.r, 2) +
        Math.pow(goalRgb.g - playerRgb.g, 2) +
        Math.pow(goalRgb.b - playerRgb.b, 2)
    );

    const maxDifference = Math.sqrt(Math.pow(255, 2) * 3);
    const percentage = Math.max(
      0,
      100 - (colorDifference / maxDifference) * 100
    );

    return parseFloat(percentage.toFixed(0));
  }

  // Calculate player score

  function calculatePlayerScore(playerPercentage) {
    // difficulty should be between 0 and 100.
    // easy
    const difficulty = 92;
    // medium
    // const difficulty = 95;
    // hard
    // const difficulty = 95;

    const raw_score = playerPercentage - difficulty;
    // normalization constant to adjust raw score to an interval of 10
    const norm_const = (100 - difficulty) / 10;

    return Math.round(Math.max(0, raw_score / norm_const) ** 2);
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
        switch (e.key) {
          case "ArrowUp":
          case "w":
            handleMove("up");
            break;
          case "ArrowDown":
          case "s":
            handleMove("down");
            break;
          case "ArrowLeft":
          case "a":
            handleMove("left");
            break;
          case "ArrowRight":
          case "d":
            handleMove("right");
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMove]);

  const handleLock = useCallback(() => {
    setLockTriggered(true);
    setGrid(initializeGrid);
  }, []);

  useEffect(() => {
    if (lockTriggered) {
      const newStartSquare = findAvailableSquare();
      newStartSquare.occupied = true;
      setStartSquare(newStartSquare);
    }
  }, [lockTriggered, grid]);

  useEffect(() => {
    if (lockTriggered && startSquare) {
      setGoalColor(createInitialGoalColor);

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        playerCol: startSquare.col,
        playerRow: startSquare.row,
        playerColor: startSquare.color,
        playerCurrentScore: calculatePlayerScore(
          calculatePlayerPercentage(startSquare.color)
        ),
        playerTotalScore:
          prevPlayer.playerTotalScore + prevPlayer.playerCurrentScore,
      }));

      setLockTriggered(false);
    }
  }, [startSquare]);

  // Check if the game is over
  useEffect(() => {
    if (grid.every((square) => square.deleted)) {
      setGameOver(true);
    }
  }, [grid]);

  // Swipe handling
  useEffect(() => {
    const detectSwipe = (e) => {
      const touchStartX = e.touches[0].clientX;
      const touchStartY = e.touches[0].clientY;
      let touchEndX, touchEndY;

      const touchMoveListener = (moveEvent) => {
        touchEndX = moveEvent.touches[0].clientX;
        touchEndY = moveEvent.touches[0].clientY;
      };

      const touchEndListener = () => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            handleMove("right");
          } else {
            handleMove("left");
          }
        } else {
          if (deltaY > 0) {
            handleMove("down");
          } else {
            handleMove("up");
          }
        }

        document.removeEventListener("touchmove", touchMoveListener);
        document.removeEventListener("touchend", touchEndListener);
      };

      document.addEventListener("touchmove", touchMoveListener);
      document.addEventListener("touchend", touchEndListener);
    };

    document.addEventListener("touchstart", detectSwipe);

    return () => {
      document.removeEventListener("touchstart", detectSwipe);
    };
  }, [handleMove]);

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
        onLock={handleLock}
      />
    </div>
  );
}

export default SinglePlayer;
