import { parameters } from "./parameters";
import { gridRows, gridCols } from "./grid";

export const caStep = (grid, timestamp) => {

	for (let i = 0; i < grid.length; i++) {
		if (grid[i].isInteractable === true) { continue; }

		const neighbors = countNeighbors(grid, i, gridRows, gridCols);

		if (neighbors < 2 || neighbors > 3) {
			grid[i].isAlive = false; // Cell dies
			// leave to decay through the draw loop
		}

		if (neighbors === 3) {
			grid[i].isAlive = true; // Cell is alive
			grid[i].lifeStart = timestamp; // set start time for decay
		}
	}

	return grid;
}


function countNeighbors(grid, idx, rows, cols) {
	let count = 0;
	// Convert 1D index to 2D coordinates
	let x = Math.floor(idx / cols);
	let y = idx % cols;

	// Iterate surrounding 8 neighbors
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			// Skip the center cell (the cell itself)
			if (i === 0 && j === 0) continue;

			let neighborRow = x + i;
			let neighborCol = y + j;

			// Boundary check: ensure the neighbor is within the grid
			if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
				// Convert back to 1D index
				let neighborIdx = neighborRow * cols + neighborCol;
				if (grid[neighborIdx].isAlive === true) {
					count += 1;
				}
			}
		}
	}
	return count;
}

const countNeighborsWraparound = (grid, i) => {
	let count = 0;
	const rowLength = Math.floor(window.innerWidth / parameters.gridSize);
	const totalCells = grid.length;

	// Calculate neighbor indices with wraparound
	const neighbors = [
		(i - rowLength - 1 + totalCells) % totalCells, // Top-left
		(i - rowLength + totalCells) % totalCells,     // Top
		(i - rowLength + 1 + totalCells) % totalCells, // Top-right
		(i - 1 + totalCells) % totalCells,             // Left
		(i + 1) % totalCells,                         // Right
		(i + rowLength - 1 + totalCells) % totalCells, // Bottom-left
		(i + rowLength + totalCells) % totalCells,     // Bottom
		(i + rowLength + 1) % totalCells              // Bottom-right
	];

	for (const neighborIndex of neighbors) {
		if (grid[neighborIndex].isAlive === true) {
			count += 1;
		}
	}

	return count;
}
