import React from 'react';

function LockButton({ onLockScore, cellSize, playerColor, lockOutlineColor, isLocked }) {
    return (
        <button className="lock-button" onClick={onLockScore} style={{ padding: cellSize * 0.1 }}>
            {isLocked ? (
                <svg
                    width={cellSize * 0.8}
                    height={cellSize * 0.8}
                    viewBox="0 0 1024 1024"
                    style={{ filter: `drop-shadow(0.15rem 0.15rem 0 ${lockOutlineColor})` }}
                >					
                    <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1156 0zm152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z"
                    style={{ fill: playerColor }}/>
                </svg>
            ) : (
                <svg
                    width={cellSize * 0.8}
                    height={cellSize * 0.8}
                    viewBox="0 0 1024 1024"
                    style={{ filter: `drop-shadow(0.15rem 0.15rem 0 ${lockOutlineColor})` }}
                >
                    <path d="M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1156 0z"
                    style={{ fill: playerColor }}/>
                </svg>
            )}
        </button>
    );
}

export default LockButton;
