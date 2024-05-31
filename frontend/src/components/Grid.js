// Grid.js
import React, { useEffect, useState } from 'react';
import InfoBar from './InfoBar';
import Cell from './Cell';

// Function to calculate luminance of a color
export function getLuminance(color) {
    const rgb = color.substring(1); // Remove '#'
    const r = parseInt(rgb.substring(0, 2), 16); // Red value
    const g = parseInt(rgb.substring(2, 4), 16); // Green value
    const b = parseInt(rgb.substring(4, 6), 16); // Blue value
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; // Calculate luminance
}

function Grid({
    numRows = 0,
    numColumns = 0,
    grid = [],
    playerSessionId,
    player = null,
    playerUsername,
    currentPlayerSessionId,
    currentPlayerUsername,
    goalColor,
    roomId,
    onLockScore,
    isLocked
}) {
    const [cellSpacing, setCellSpacing] = useState(10);
    const [cellSize, setCellSize] = useState(0);
    useEffect(() => {
        function calculateGridSize() {
            const gridElement = document.querySelector('.grid');

            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // 56 is height of the navbar
            // 50 is the total padding 25 + 25 on each side of the grid object
            const availableHeight = (windowHeight - 56 - 50);
            const availableWidth = windowWidth - 50;
            
            // Add an extra row for info bar
            const maxCellSize = Math.min(
                (availableHeight / (numRows + 1)),
                (availableWidth / numColumns)
            );

            // Calculate cell spacing based on the maximum cell size
            const calculatedCellSpacing = Math.max(1, maxCellSize * 0.1); // 10% of the maximum cell size
            setCellSpacing(calculatedCellSpacing);

            const cellSize = Math.min(
                (availableHeight / (numRows + 1)) - calculatedCellSpacing,
                (availableWidth / numColumns) - calculatedCellSpacing
            );
            setCellSize(cellSize)
            const cells = gridElement.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                cell.style.margin = calculatedCellSpacing / 2 + 'px';
                cell.style.borderRadius = (cellSize / 10) + 'px';

                // Dynamically set font size for each .cell-text
                const fontSize = cellSize / 5;
                const cell_texts = cell.querySelectorAll('.cell-text');
                cell_texts.forEach(cell_text => {
                    cell_text.style.fontSize = fontSize + 'px';
                    cell_text.style.textAlign = 'center'
                });
            });
        }

        calculateGridSize(); // Initial call to set grid size

        function handleResize() {
            calculateGridSize(); // Recalculate grid size on window resize
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [numRows, numColumns]);


    // Create an array of rows, each containing cells
    const rows = [];

    // InfoBar row
    const infoBarRow = (
        <div key="info-bar" className="row">
            <InfoBar
                playerSessionId={playerSessionId}
                currentPlayerSessionId={currentPlayerSessionId}
                currentPlayerUsername={currentPlayerUsername}
                goalColor={goalColor}
                roomId={roomId}
                onLockScore={onLockScore}
                cellSize={cellSize}
                playerColor={player.playerColor}
                playerPercentage={player.playerPercentage}
                playerScore={player.playerScore}
                isLocked={true }
            />
        </div>
    );
    
    // Push InfoBar row to the rows array
    rows.push(infoBarRow);

    for (let row = 0; row < numRows; row++) {
        const cells = [];
        for (let col = 0; col < numColumns; col++) {
            const index = row * numColumns + col;
            const square = grid[index]; // Get square data from the grid

            cells.push(
                <Cell
                    key={index}
                    index={index}
                    square={square}
                    player={player}
                    cellSize={cellSize}
                />
            );
        }

        rows.push(
            <div key={row} className="row">
                {cells}
            </div>
        );
    }

    return (
        <div className="grid">
            {rows}
        </div>
    );
}

export default Grid;
