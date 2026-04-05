import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import { parameters } from './parameters';
import {
	initHeartBeat,
	initKnightRider,
	gridPoints,
	GRID_POINT_MOUSE
} from './animations';
import { caStep } from './ca';

const app = new PIXI.Application();
const contentElem = document.getElementById('content');

// let prevTime = 0;

export let grid = new PIXI.Graphics();
export let gridRows = 0;
export let gridCols = 0;

let cells = [];
// const backgroundColor = 0xF0F8FF; // alice blue
// const backgroundColor = 0xABDADC;
const backgroundColor = 0x708090; // slate gray
const strokeColor = 0x000000;
const secondaryColor = 0xF0F8FF; // alice blue
// const secondaryColor = 0x2C3E50;	// deep navy
// const secondaryColor = 0x708090; // slate gray
const primaryColor = 0xFF9900;
// const primaryColor = 0xdcd0ff;	// light purple
// const primaryColor = 0xF0F8FF;	// alice blue
let primaryTexture;
let secondaryTexture;


const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const destroyCells = () => {
	for (let i = 0; i < cells.length; i++) {
		// if (Object.hasOwn(cells[i], 'sprite')) {
			app.stage.removeChild(cells[i].sprite);
			cells[i].sprite.destroy();
			cells[i] = {};
		// }
	}
	cells = [];

	app.stage.removeChild(grid);
	grid.clear();
	grid.destroy();
}

const positionCells = () => {
	let cellXPos = 0;
	let cellYPos = 0;
	const cellXCount = Math.ceil(window.innerWidth / parameters.size);
	const cellYCount = Math.ceil(window.innerHeight / parameters.size);

	gridCols = cellXCount;
	gridRows = cellYCount;

	grid = new PIXI.Graphics();
	grid.visible = parameters.showGrid;

	let cellNum = 0;

	for (let i = 0; i < cellYCount; i++) {
		grid.moveTo(0, cellYPos);
		grid.lineTo(window.innerWidth, cellYPos);

		for (let j = 0; j < cellXCount; j++) {
			grid.moveTo(cellXPos + 1, 0);
			grid.lineTo(cellXPos + 1, window.innerHeight);

			cells[cellNum] = {};
			cells[cellNum].sprite = new PIXI.Sprite(secondaryTexture);

			cells[cellNum].sprite.anchor.set(.5, .5);
			cells[cellNum].sprite.x = cellXPos - (parameters.size / 2);
			cells[cellNum].sprite.y = cellYPos - (parameters.size / 2);
			cells[cellNum].sprite.alpha = 0;
			app.stage.addChild(cells[cellNum].sprite);

			cellXPos += parameters.size;
			cellNum++;
		}

		cellXPos = 0;
		cellYPos = parameters.size * (i + 1);
	}

	console.log(cellNum);

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
			cells[i].isInteractable = false;
			cells[i].caState = false;
			cells[i].sprite.alpha = 0;
		}

		if (cells[i].animating === true) {
			const decay = 1 - (timestamp - cells[i].animationStartTime) / parameters.animationDuration;
			cells[i].sprite.alpha = decay;
			cells[i].sprite.scale.set(decay);
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

	const primaryCircle = new PIXI.Graphics();
	primaryCircle.circle(0, 0, parameters.size / 2);
	primaryCircle.fill({ color: primaryColor, alpha: 1 });
	primaryCircle.stroke({
		alpha: 1,
		color: strokeColor,
		width: 1
	});
	primaryCircle.cacheAsTexture = true;
	primaryTexture = app.renderer.generateTexture(primaryCircle, {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	const secondaryCircle = new PIXI.Graphics();
	secondaryCircle.circle(0, 0, parameters.size / 2);
	secondaryCircle.fill({ color: secondaryColor, alpha: 1 });
	secondaryCircle.stroke({
		alpha: 1,
		color: strokeColor,
		width: 1
	});
	secondaryCircle.cacheAsTexture = true;
	secondaryTexture = app.renderer.generateTexture(secondaryCircle, {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

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

	if (parameters.showLife === true) {
		cells = caStep(cells, timestamp);
	}

	findInteractables(timestamp);
	drawCells(timestamp);

	stats.end();
	requestAnimationFrame(animate);
}

const findInteractables = (timestamp) => {
	gridPoints.forEach((point) => {
		if (point === null) {
			return;
		}
		for (let i = 0; i < cells.length; i++) {
			if (Math.hypot(cells[i].sprite.x - point.x, cells[i].sprite.y - point.y) < parameters.interactionRadius) {
				cells[i].animating = true;
				cells[i].isInteractable = true;
				cells[i].animationStartTime = timestamp;
				cells[i].caState = true;
			}
		}
	});
}

const handleResize = () => {
	initGrid();

	if (parameters.showHeartBeat === true) {
		initHeartBeat();
	}

	if (parameters.showKnightRider === true) {
		initKnightRider();
	}
}

const handleLeave = () => {
	gridPoints[GRID_POINT_MOUSE] = null;
}

const handleInteraction = (event) => {
	// console.log('handleInteraction()');
	let eventX = event.clientX;
	let eventY = event.clientY;
	if (event.touches) {
		eventX = event.touches[0].clientX;
		eventY = event.touches[0].clientY;
	}

	// eventX = eventX / 2;
	// eventY = eventY / 2;
	gridPoints[GRID_POINT_MOUSE] = { x: eventX, y: eventY };
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