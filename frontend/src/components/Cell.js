// Cell.js
import React from "react";
import { getLuminance } from "./Grid";

function Cell({ square, index, player, cellSize }) {
  if (!square || square.deleted) {
    return (
      <div
        key={index}
        className="cell"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <div className="cell-text"></div>
      </div>
    );
  }

  let cellClassName = "cell";
  if (square.occupied) {
    if (square.row === player.playerRow && square.col === player.playerCol) {
      cellClassName += " User"; // Occupied by current user
    } else {
      cellClassName += " Opponent"; // Occupied by opponent
    }
  }
  // sliding animation & direction class;
  if (square.directionMoving !== "") {
    cellClassName += " Moving_" + square.directionMoving;
  }

  const hex = (
    <div
      className="cell-text"
      style={{ color: getLuminance(square.color) > 0.5 ? "black" : "white" }}
    >
      {square.color}
    </div>
  );

  return (
    <div
      key={index}
      className={cellClassName}
      style={{
        backgroundColor: square.color,
        boxShadow: `0.15rem 0.15rem 0px ${
          getLuminance(square.color) > 0.5 ? "black" : "white"
        }`,
      }}
    >
      {/* {hex} */}
    </div>
  );
}

export default Cell;
