import React from "react";

function Circle({ color, cellSize, shadowColor }) {
  const size = cellSize * 0.5;
  const borderRadius = size * 0.125;
  return (
    <svg
      width={cellSize * 0.8}
      height={cellSize * 0.8}
      style={{ filter: `drop-shadow(0.15rem 0.15rem 0 ${shadowColor})` }}
    >
      <rect
        x={(cellSize * 0.8 - size) / 2}
        y={(cellSize * 0.8 - size) / 2}
        width={size}
        height={size}
        rx={borderRadius}
        ry={borderRadius}
        fill={color}
      />
    </svg>
  );
}

export default Circle;
