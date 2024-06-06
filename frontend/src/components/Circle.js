import React from 'react';

function Circle({ color, cellSize, shadowColor }) {
    const radius = cellSize * 0.25; // Adjust the radius as needed
    return (
			<svg
				width={cellSize * 0.8}
				height={cellSize * 0.8}
				style={{ filter: `drop-shadow(0.15rem 0.15rem 0 ${shadowColor})` }}
			>
            <circle cx={cellSize * 0.4} cy={cellSize * 0.4} r={radius} fill={color} />
        </svg>
    );
}

export default Circle;

