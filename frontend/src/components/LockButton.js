import React from 'react';

function LockButton({ onLockScore, cellSize, playerColor, lockOutlineColor }) {
    return (
        <button className="lock-button" onClick={onLockScore} style={{ padding: cellSize * 0.1 }}>
            <svg
                version="1.1"
                width={cellSize * 0.8}
                height={cellSize * 0.8}
                viewBox="0 0 256 256"
                xmlSpace="preserve"
                style={{ filter: `drop-shadow(0.15rem 0.15rem 0 ${lockOutlineColor})` }}
            >
                <g style={{ strokeWidth: 0, fill: 'none', fillRule: 'nonzero', opacity: 1 }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path
                        d="M72,38H66V28c0-13.255-10.745-24-24-24S18,14.745,18,28v10H12c-3.313,0-6,2.687-6,6v40c0,3.313,2.687,6,6,6h60c3.313,0,6-2.687,6-6V44C78,40.687,75.313,38,72,38z M30,28c0-6.627,5.373-12,12-12s12,5.373,12,12v10H30V28z"
                        style={{ fill: playerColor }}
                    />
                </g>
            </svg>
        </button>
    );
}

export default LockButton;
