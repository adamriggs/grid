import { parameters } from "./parameters";
import { gridRows, gridCols } from "./grid";

export const caStep = (grid, timestamp) => {
	const newGrid = grid;
	let aliveCount = 0;
	let deadCount = 0;

	for (let i = 0; i < grid.length; i++) {
		// const neighbors = countNeighborsWraparound(grid, i);
		const neighbors = countNeighbors(grid, i, gridRows, gridCols);
		// const neighbors = 3;
		// console.log('neighbors:', neighbors);

		if (neighbors < 2 || neighbors > 3) {
			// console.log('dead');
			deadCount++;
			grid[i].caState = false; // Cell dies
		}
	
		if (neighbors === 3) {
			// console.log('alive:', i);
			aliveCount++;
			grid[i].caState = true; // Cell becomes alive
			grid[i].animating = true;
			grid[i].animationStartTime = timestamp;
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
				if (grid[neighborIdx].caState === true) {
					count += 1;
				}
			}
		}
	}
	return count;
}

const countNeighborsWraparound = (grid, i) => {
	let count = 0;
	const rowLength = Math.floor(window.innerWidth / parameters.size);
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
		if (grid[neighborIndex].caState === true) {
			count += grid[neighborIndex].caState;
		}
	}

	return count;
}
