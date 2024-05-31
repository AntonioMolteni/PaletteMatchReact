import React from 'react';
import { getLuminance } from './Grid'; // Assuming Grid.js is in the same directory
import LockButton from './LockButton'; // Import the new LockButton component

function InfoBar({ playerSessionId, currentPlayerSessionId, currentPlayerUsername, goalColor, roomId, onLockScore, cellSize, playerColor, playerPercentage, playerScore, isLocked }) {
    const barLuminance = getLuminance(goalColor);
    const textColor = barLuminance > 0.5 ? 'black' : 'white';
    const outlineColor = barLuminance > 0.5 ? 'black' : 'white';
    const lockLuminance = getLuminance(playerColor);
    const lockOutlineColor = lockLuminance > 0.5 ? 'black' : 'white';

    return (
        <div className="info-bar" style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
            <div className="goal-cell cell" id="goal-cell" style={{
                backgroundColor: goalColor,
                boxShadow: `2px 2px 0px ${outlineColor}`
            }}>
               
                {playerSessionId !== "single-player" ? (
                    // Multiplayer Information
                     <div className="column">
                        <div className="cell-text" style={{ color: textColor }}>
                            <>
                                <div>{currentPlayerSessionId === playerSessionId ? 'Your Turn' : `${currentPlayerUsername}'s Turn`}</div>
                                <div>Room Id: {roomId}</div>
                            </>
                        </div>
                    </div>
                ) : (
                    // Single Player Restart Button
                    <div className="column" style={{ flexDirection: 'row', justifyContent: 'start' }}>
                        <div className="cell-text" style={{ color: textColor }}>
                            <LockButton
                                key={lockOutlineColor + 'single'}
                                onLockScore={onLockScore}
                                cellSize={cellSize}
                                playerColor={playerColor}
                                lockOutlineColor={lockOutlineColor}
                                isLocked={isLocked}
                            />       
                        </div>
                    </div>
                )}
                            
                <div className="column">
                    <div className="cell-text" style={{ color: textColor }}>
                        <div>{goalColor}</div>
                    </div>
                </div>

                <div className="column" style={{ flexDirection: 'row', justifyContent: 'end' }}>
                    <div className="cell-text" style={{ color: textColor }}>
                        {playerPercentage}%
                        <br />
                        {playerScore === '0' ? '×' : playerScore}
                    </div>

                    <LockButton
                        key={lockOutlineColor}
                        onLockScore={onLockScore}
                        cellSize={cellSize}
                        playerColor={playerColor}
                        lockOutlineColor={lockOutlineColor}
                    />
                </div>
            </div>
        </div>
    );
}

export default InfoBar;
