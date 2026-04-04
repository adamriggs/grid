import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import { parameters } from './parameters';
import {
	initHeartBeat,
	initKnightRider,
	gridPoints,
	GRID_POINT_MOUSE
} from './animations';

const app = new PIXI.Application();
const contentElem = document.getElementById('content');

// let prevTime = 0;

export let grid = new PIXI.Graphics();

let cells = [];
// const backgroundColor = 0xF0F8FF; // alice blue
// const backgroundColor = 0xABDADC;
const backgroundColor = 0x708090; // slate gray
const strokeColor = 0x000000;
// const highlightColor = 0xFF9900;
// const highlightColor = 0x2C3E50;	// deep navy
// const highlightColor = 0x708090; // slate gray
const highlightColor = 0xF0F8FF; // alice blue
// const highlightColor = 0xdcd0ff;	// light purple

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/**
 * TODO:
 * - ✅fix heartbeat peak value
 * - ✅base animation on time, not frames
 * - ✅grid lines as seperate layer that can be toggled on/off and isn't part of the animation 
 * - ✅proper resizing and restart animations on resize
 * - ✅fix github link
 * - cellular automata
 * - add option for color schemes (get some color palettes from kuler)
 * - add option for multiple simultaneous interactions (e.g. multi-touch)
 * - add option for sinewaves
 * - add option for fireworks
 * - add option for worm
 */

const destroyCells = () => {
	for (let i = 0; i < cells.length; i++) {
		if (Object.hasOwn(cells[i], 'gfx')) {
			app.stage.removeChild(cells[i].gfx);
			cells[i].gfx.destroy();
		}
	}
	cells = [];

	app.stage.removeChild(grid);
	grid.clear();
	grid.destroy();
}

const positionCells = () => {
	let cellXPos = parameters.size / 2;
	let cellYPos = parameters.size / 2;
	const cellXCount = Math.ceil(window.innerWidth / parameters.size);
	const cellYCount = Math.ceil(window.innerHeight / parameters.size);

	grid = new PIXI.Graphics();
	grid.visible = parameters.showGrid;

	let cellNum = 0;

	for (let i = 0; i < cellYCount; i++) {
		grid.moveTo(0, cellYPos - parameters.size / 2);
		grid.lineTo(window.innerWidth, cellYPos - parameters.size / 2);

		for (let j = 0; j < cellXCount; j++) {
			grid.moveTo(cellXPos - parameters.size / 2, 0);
			grid.lineTo(cellXPos - parameters.size / 2, window.innerHeight);

			if (cells[cellNum] === undefined) {
				cells[cellNum] = {};
				const gfx = new PIXI.Graphics();
				app.stage.addChild(gfx);
				cells[cellNum].gfx = gfx;

				gfx.x = cellXPos;
				gfx.y = cellYPos;
				cells[cellNum].x = cellXPos;
				cells[cellNum].y = cellYPos;
				cells[cellNum].radius = parameters.size;

				// grid.addChild(gfx);
			}

			cellXPos += parameters.size;
			cellNum++;
		}

		cellXPos = parameters.size / 2;
		cellYPos = parameters.size * (i + 1) + (parameters.size / 2);
	}

	grid.stroke({
		width: 1,
		color: strokeColor
	});
	app.stage.addChild(grid);
}

const drawCells = (timestamp) => {
	for (let i = 0; i < cells.length; i++) {

		if (timestamp > cells[i].animationStartTime + parameters.animationDuration) {
			cells[i].animating = false;
			cells[i].gfx.clear();
		}

		if (cells[i].animating === true) {
			
			cells[i].gfx.clear();

			if (cells[i].animating === true) {

				const ratio = 1 - (timestamp - cells[i].animationStartTime) / parameters.animationDuration;

				const radius = ratio * parameters.size;
				const alpha = ratio;

				if(parameters.squares === false) {
					cells[i].gfx.circle(cells[i].x, cells[i].y, radius);
				} else {
					cells[i].gfx.rect(cells[i].x - (radius), cells[i].y - (radius), radius * 2, radius * 2);
				}
				cells[i].gfx.fill({color: highlightColor, alpha: alpha});
				cells[i].gfx.stroke({
					alpha: alpha,
					color: strokeColor,
					width: 1
				});
			} else {
				// if (parameters.showGrid === true) {
				// 	if(parameters.squares === false) {
				// 		cells[i].gfx.circle(cells[i].x, cells[i].y, cells[i].radius);
				// 	} else {
				// 		cells[i].gfx.rect(
				// 			cells[i].x - parameters.size,
				// 			cells[i].y - parameters.size,
				// 			parameters.size * 2,
				// 			parameters.size * 2
				// 		);
				// 	}
				// 	cells[i].gfx.stroke({
				// 		width: 1,
				// 		color: strokeColor
				// 	});
				// }
			}
		}
	}
}

const initApp = async () => {
	await app.init({
		width: '100vw',
		height: '100vh',
		backgroundColor: backgroundColor,
		resizeTo: contentElem,
	});

	contentElem.appendChild(app.canvas);

	if (parameters.showHeartBeat === true) {
		initHeartBeat();
	}

	if (parameters.showKnightRider === true) {
		initKnightRider();
	}

	handleResize();
}

export const initGrid = () => {
	destroyCells();
	positionCells();
	drawCells();
}

const animate = (timestamp) => {
	stats.begin();
	// if (!prevTime) {
	// 	prevTime = timestamp;
	// }
	// const deltaTime = timestamp - prevTime;
	// prevTime = timestamp;

	findInteractables(timestamp);
	drawCells(timestamp);

	stats.end();
	requestAnimationFrame(animate);
}

const handleResize = () => {
	initGrid();

	if(parameters.showHeartBeat === true) {
		initHeartBeat();
	}

	if(parameters.showKnightRider === true) {
		initKnightRider();
	}
}

const handleLeave = () => {
	gridPoints[GRID_POINT_MOUSE] = null;
}

const handleInteraction = (event) => {
	let eventX = event.clientX;
	let eventY = event.clientY;
	if (event.touches) {
		eventX = event.touches[0].clientX;
		eventY = event.touches[0].clientY;
	}

	eventX = eventX / 2;
	eventY = eventY / 2;
	gridPoints[GRID_POINT_MOUSE] = { x: eventX, y: eventY };
}

const findInteractables = (timestamp) => {
	gridPoints.forEach((point) => {
		if (point === null) {
			return;
		}
		for (let i = 0; i < cells.length; i++) {
			if (isInteractable(point.x, point.y, cells[i])) {
				cells[i].animating = true;
				// cells[i].animationCounter = parameters.animationDuration;
				cells[i].animationStartTime = timestamp;
				// cells[i].animationEndTime = timestamp + parameters.animationDuration;
			}
		}
	});
}

const isInteractable = (x, y, cell) => {
	let found = false;

	const distance = Math.hypot(cell.gfx.x - x, cell.gfx.y - y);
	if (distance < parameters.interactionRadius) {
		found = true;
	}

	return found;
}

window.addEventListener('load', () => {
	initApp();
	
	requestAnimationFrame(animate);
});

window.addEventListener('resize', handleResize, false);
window.addEventListener('mousemove', handleInteraction, false);
window.addEventListener('mouseout', handleLeave, false);
document.addEventListener('touchmove', handleInteraction, false);
document.addEventListener('touchend', handleLeave, false);