import React from "react";
import { getLuminance } from "./Grid"; // Assuming Grid.js is in the same directory
import LockButton from "./LockButton"; // Import the new LockButton component
import Circle from "./Circle"; // Import new cell

function InfoBar({
  playerSessionId,
  currentPlayerSessionId,
  currentPlayerUsername,
  goalColor,
  roomId,
  cellSize,
  playerColor,
  playerPercentage,
  playerCurrentScore,
  playerTotalScore,
  playerMovesLeft,
  onLock,
}) {
  const barLuminance = goalColor ? getLuminance(goalColor) : 0;
  const textColor = barLuminance > 0.5 ? "black" : "white";
  const outlineColor = barLuminance > 0.5 ? "black" : "white";
  const lockLuminance = playerColor ? getLuminance(playerColor) : 0;
  const shadowColor = lockLuminance > 0.5 ? "black" : "white";

  return (
    <div
      className="info-bar"
      style={{ padding: 0, display: "flex", alignItems: "center" }}
    >
      <div
        className="goal-cell cell"
        id="goal-cell"
        style={{
          backgroundColor: goalColor,
          boxShadow: `2px 2px 0px ${outlineColor}`,
        }}
      >
        {playerSessionId !== "single-player" ? (
          // Multiplayer Information
          <div className="column">
            <div className="cell-text" style={{ color: textColor }}>
              <>
                <div>
                  {currentPlayerSessionId === playerSessionId
                    ? "Your Turn"
                    : `${currentPlayerUsername}'s Turn`}
                </div>
                <div>Room Id: {roomId}</div>
              </>
            </div>
          </div>
        ) : (
          // Single Player Information
          <div
            className="column"
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <div className="cell-text" style={{ color: textColor }}>
              Total Score: {playerTotalScore}
              <br />
              Moves Left: {playerMovesLeft}
            </div>
          </div>
        )}

        <div className="column">
          <div className="cell-text" style={{ color: textColor }}>
            {/* <div>{goalColor}</div> */}
          </div>
        </div>

        <div
          className="column"
          style={{ flexDirection: "row", justifyContent: "end" }}
        >
          {playerCurrentScore > 0 ? (
            <>
              <div className="cell-text" style={{ color: textColor }}>
                {playerCurrentScore} pts
              </div>
              <div className="cell-text" style={{ color: textColor }}>
                <LockButton
                  key={shadowColor}
                  onLock={onLock}
                  cellSize={cellSize}
                  playerColor={playerColor}
                  shadowColor={shadowColor}
                />
              </div>
            </>
          ) : (
            <>
              <div className="cell-text" style={{ color: textColor }}>
                No Match
              </div>
              <div className="cell-text" style={{ color: textColor }}>
                <Circle
                  cellSize={cellSize}
                  color={playerColor}
                  shadowColor={shadowColor}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
