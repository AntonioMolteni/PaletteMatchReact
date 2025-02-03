// SinglePlayer.js
import React, { useState, useEffect, useCallback } from "react";
import {
  getRandomColor,
  getPseudoRandomColor,
  hexToRgb,
  rgbToHex,
  mixColors,
  calculateColorSimilarity,
} from "./ColorFunctions";
import Grid from "./Grid";
import "../style/game.css";

function SinglePlayer() {
  // difficulty should be between 0 and 100.
  // easy (playable)
  // const difficulty = 90;
  // medium
  const difficulty = 91;
  // hard
  // const difficulty = 92;
  // Initial game state setup
  const numRows = 7;
  const numColumns = 5;
  const defaultMovesLeft = 15;
  // 190ms slightly less the length of animation in game.css
  const movementDelay = 190;
  // Note: Do not call functions inside of useState() using parentheses
  // Order matters when doing this initialization
  const [grid, setGrid] = useState(initializeGrid);
  const [startSquare, setStartSquare] = useState(findAvailableSquare);
  const [goalColor, setGoalColor] = useState(createInitialGoalColor);
  const [player, setPlayer] = useState(createInitialPlayer);
  const [lockMoves, setLockMoves] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lockTriggered, setLockTriggered] = useState(false);

  // log things here if needed
  // console.log("player", player);
  // console.log("start square", startSquare);
  // console.log("grid", grid);
  // console.log("lockmoves", lockMoves);

  // Function to create initial player state
  function createInitialPlayer() {
    startSquare.occupied = true;
    const playerPercentage = calculateColorSimilarity(
      startSquare.color,
      goalColor
    );
    const playerCurrentScore = calculatePlayerScore(playerPercentage);
    const playerTotalScore = 0;
    const playerMovesLeft = defaultMovesLeft;

    return {
      playerRow: startSquare.row,
      playerCol: startSquare.col,
      playerColor: startSquare.color,
      playerPercentage: playerPercentage,
      playerTotalScore: playerTotalScore,
      playerMovesLeft: playerMovesLeft,
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
    const numMoves = Math.floor(Math.random() * 5) + 3; // Random number between 3 and 7

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
    if (moves.length < 6) {
      return createInitialGoalColor();
    }

    console.log("moves", moves); // You can log the moves array to see the logged moves
    // You can log the moves array to see the logged moves
    return currentColor;
  }

  // Function to find an available square
  function findAvailableSquare(row, col) {
    if (row && col) {
      const index = row * numColumns + col;
      return grid[index];
    } else {
      const availableSquares = grid.filter(
        (square) => !square.occupied && !square.deleted
      );
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      return availableSquares[randomIndex];
    }
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
          directionMoving: "",
        });
      }
    }
    return grid;
  }

  // Function to handle player movement
  const handleMove = useCallback(
    (direction) => {
      if (lockMoves || gameOver) return;
      setIsMoving(true);
      setLockMoves(true);

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
        oldSquare.directionMoving = direction;
        const mixedColor = mixColors(oldSquare.color, newSquare.color);
        var newMovesLeft = player.playerMovesLeft;
        if (!newSquare.deleted) {
          newSquare.color = mixedColor;
          newMovesLeft -= 1;
        } else {
          newSquare.color = oldSquare.color;
        }
        const playerPercentage = calculateColorSimilarity(
          newSquare.color,
          goalColor
        );
        const playerCurrentScore = calculatePlayerScore(playerPercentage);

        setTimeout(() => {
          oldSquare.directionMoving = "";
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const updatedOldSquare = newGrid.find(
              (square) =>
                square.row === player.playerRow &&
                square.col === player.playerCol
            );
            const updatedNewSquare = newGrid.find(
              (square) =>
                square.row === newPlayerRow && square.col === newPlayerCol
            );
            updatedOldSquare.deleted = true;
            updatedNewSquare.occupied = true;
            if (updatedNewSquare.deleted) {
              updatedNewSquare.deleted = false;
            }
            return newGrid;
          });
          setIsMoving(false);
          setLockMoves(false);
        }, movementDelay);

        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          playerRow: newPlayerRow,
          playerCol: newPlayerCol,
          playerColor: newSquare.color,
          playerPercentage: playerPercentage,
          playerCurrentScore: playerCurrentScore,
          playerMovesLeft: newMovesLeft,
        }));
      } else {
        setIsMoving(false);
        setLockMoves(false);
      }
    },
    [player, grid, gameOver]
  );

  // Calculate player score and returns a integer betweeen 0 and 1
  function calculatePlayerScore(x) {
    var score = 0;
    if (x <= 87) {
      score = 0;
    } else if (x >= 87 && x <= 93) {
      score = 1;
    } else if (x > 93) {
      score = (99 / 7 ** 2) * Math.pow(x - 93, 2) + 1;
    } else {
      score = 0;
    }
    return Math.round(score);
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
    if (player.playerCurrentScore > 0 && !isMoving) {
      setLockMoves(true);
      setLockTriggered(true);
      setGrid(initializeGrid);
    }
  }, [player.playerCurrentScore, isMoving]);

  // Can also press enter instead to trigger the lock
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleLock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLock]);

  useEffect(() => {
    if (lockTriggered) {
      const row = player.playerRow;
      const col = player.playerCol;
      const newStartSquare = findAvailableSquare(row, col);
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
          calculateColorSimilarity(startSquare.color, goalColor)
        ),
        playerTotalScore:
          prevPlayer.playerTotalScore + prevPlayer.playerCurrentScore,
        playerMovesLeft: defaultMovesLeft,
      }));
      setLockMoves(false);
      setLockTriggered(false);
    }
  }, [startSquare]);

  // Check if the game is over
  useEffect(() => {
    if (player.playerMovesLeft <= 0) {
      setLockMoves(true);
    }
    if (player.playerMovesLeft <= 0 && player.playerCurrentScore === 0) {
      setGameOver(true);
    }
  }, [player]);

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
      {gameOver ? (
        <p style={{ marginBottom: 0 }}>Game Over!</p>
      ) : (
        <p style={{ marginBottom: 0 }}>Mix the colors to match the top bar</p>
      )}
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
