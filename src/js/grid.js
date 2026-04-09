import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import { parameters, initParameters } from './parameters';
import {
	initHeartBeat,
	initKnightRider,
	interactionPoints,
	POINT_MOUSE
} from './animations';
import { caStep } from './ca';
import { primaryCircle, primarySquare, secondaryCircle, secondarySquare, strokeColor } from './sprites';

const app = new PIXI.Application();
const contentElem = document.getElementById('content');

const filters = [];
export const blurFilter = new PIXI.BlurFilter();
blurFilter.strength = 4; // Set blur intensity

// let prevTime = 0;

export let grid = new PIXI.Graphics();
export let gridRows = 0;
export let gridCols = 0;

let cells = [];
const backgroundColor = 0x708090; // slate gray

let primaryCircleTexture;
let primarySquareTexture;
let secondaryCircleTexture;
let secondarySquareTexture;
let primaryCircleTextureNoStroke;
let primarySquareTextureNoStroke;
let secondaryCircleTextureNoStroke;
let secondarySquareTextureNoStroke;

const PRIMARY_CIRCLE = 0;
const PRIMARY_SQUARE = 1;
const SECONDARY_CIRCLE = 2;
const SECONDARY_SQUARE = 3;
const PRIMARY_CIRCLE_NO_STROKE = 4;
const PRIMARY_SQUARE_NO_STROKE = 5;
const SECONDARY_CIRCLE_NO_STROKE = 6;
const SECONDARY_SQUARE_NO_STROKE = 7;


const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const destroyCells = () => {
	for (let i = 0; i < cells.length; i++) {
		cells[i].sprites.forEach(sprite => {
			app.stage.removeChild(sprite);
			sprite.destroy();
			sprite = null;
		});
		cells[i] = null;
	}
	cells = [];

	app.stage.removeChild(grid);
	grid.clear();
	grid.destroy();
	grid = null;
}

const initTextures = () => {
	primaryCircleTexture = app.renderer.generateTexture(primaryCircle(true), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	primarySquareTexture = app.renderer.generateTexture(primarySquare(true), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	secondaryCircleTexture = app.renderer.generateTexture(secondaryCircle(true), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	secondarySquareTexture = app.renderer.generateTexture(secondarySquare(true), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	primaryCircleTextureNoStroke = app.renderer.generateTexture(primaryCircle(false), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	primarySquareTextureNoStroke = app.renderer.generateTexture(primarySquare(false), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	secondaryCircleTextureNoStroke = app.renderer.generateTexture(secondaryCircle(false), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});

	secondarySquareTextureNoStroke = app.renderer.generateTexture(secondarySquare(false), {
		scaleMode: 'linear',
		resolution: 2 // Higher resolution for better quality
	});
}

const initSprite = (sprite, x, y) => {
	sprite.anchor.set(.5, .5);
	sprite.x = x;
	sprite.y = y;
	sprite.visible = false;
}

const positionCells = () => {
	let cellXPos = 0;
	let cellYPos = 0;
	const cellXCount = Math.ceil(window.innerWidth / parameters.gridSize);
	const cellYCount = Math.ceil(window.innerHeight / parameters.gridSize);

	gridCols = cellXCount;
	gridRows = cellYCount;

	grid = new PIXI.Graphics();
	grid.visible = parameters.showGrid;

	let cellNum = 0;

	initTextures();

	for (let i = 0; i < cellYCount; i++) {
		grid.moveTo(0, cellYPos);
		grid.lineTo(window.innerWidth, cellYPos);

		for (let j = 0; j < cellXCount; j++) {
			grid.moveTo(cellXPos + 1, 0);
			grid.lineTo(cellXPos + 1, window.innerHeight);

			const cell = {};

			const x = cellXPos - (parameters.gridSize / 2);
			const y = cellYPos - (parameters.gridSize / 2);

			cell.sprites = [
				new PIXI.Sprite(primaryCircleTexture),
				new PIXI.Sprite(primarySquareTexture),
				new PIXI.Sprite(secondaryCircleTexture),
				new PIXI.Sprite(secondarySquareTexture),
				new PIXI.Sprite(primaryCircleTextureNoStroke),
				new PIXI.Sprite(primarySquareTextureNoStroke),
				new PIXI.Sprite(secondaryCircleTextureNoStroke),
				new PIXI.Sprite(secondarySquareTextureNoStroke),
			];

			cell.sprites.forEach(sprite => {
				initSprite(sprite, x, y);
			});

			cell.isInteracting = false;
			cell.interactionStart = 0;
			cell.isAlive = false;
			cell.lifeStart = 0;
			cell.x = x;
			cell.y = y;

			cells[cellNum] = cell;

			cellXPos += parameters.gridSize;
			cellNum++;
		}

		cellXPos = 0;
		cellYPos = parameters.gridSize * (i + 1);
	}

	parameters.total_cells = cellNum;

	grid.stroke({
		width: 1,
		color: strokeColor
	});
	app.stage.addChild(grid);
}

export const setStage = () => {
	let spritesOnStage = [];
	let spritesOffStage = [];
	
	if (parameters.squares === true && parameters.showStroke === true) {
		spritesOnStage = [ PRIMARY_SQUARE, SECONDARY_SQUARE ];
		spritesOffStage = [
			PRIMARY_CIRCLE, 
			SECONDARY_CIRCLE ,
			PRIMARY_CIRCLE_NO_STROKE,
			PRIMARY_SQUARE_NO_STROKE,
			SECONDARY_CIRCLE_NO_STROKE,
			SECONDARY_SQUARE_NO_STROKE
		];
	}

	if (parameters.squares === true && parameters.showStroke !== true) {
		spritesOnStage = [PRIMARY_SQUARE_NO_STROKE, SECONDARY_SQUARE_NO_STROKE];
		spritesOffStage = [
			PRIMARY_CIRCLE,
			SECONDARY_CIRCLE,
			PRIMARY_CIRCLE_NO_STROKE,
			SECONDARY_CIRCLE_NO_STROKE
		];
	}

	if (parameters.squares !== true && parameters.showStroke === true) {
		spritesOnStage = [PRIMARY_CIRCLE, SECONDARY_CIRCLE];
		spritesOffStage = [
			PRIMARY_CIRCLE_NO_STROKE,
			PRIMARY_SQUARE,
			PRIMARY_SQUARE_NO_STROKE,
			SECONDARY_CIRCLE_NO_STROKE,
			SECONDARY_SQUARE,
			SECONDARY_SQUARE_NO_STROKE
		];
	}

	if (parameters.squares !== true && parameters.showStroke !== true) {
		spritesOnStage = [PRIMARY_CIRCLE_NO_STROKE, SECONDARY_CIRCLE_NO_STROKE];
		spritesOffStage = [
			PRIMARY_CIRCLE,
			PRIMARY_SQUARE,
			PRIMARY_SQUARE_NO_STROKE,
			SECONDARY_CIRCLE,
			SECONDARY_SQUARE,
			SECONDARY_SQUARE_NO_STROKE
		];
	}

	for (let i = 0; i < cells.length; i++) {
		spritesOnStage.forEach(spriteNumber => {
			app.stage.addChild(cells[i].sprites[spriteNumber]);
		});

		spritesOffStage.forEach(spriteNumber => {
			app.stage.removeChild(cells[i].sprites[spriteNumber]);
		});
	}
}

const getSpriteNumber = (primary = true) => {
	let spriteNumber = 0;

	if (primary === true) {
		if (parameters.squares === true && parameters.showStroke === true) { spriteNumber = PRIMARY_SQUARE; }
		if (parameters.squares === true && parameters.showStroke !== true) { spriteNumber = PRIMARY_SQUARE_NO_STROKE; }
		if (parameters.squares !== true && parameters.showStroke === true) { spriteNumber = PRIMARY_CIRCLE; }
		if (parameters.squares !== true && parameters.showStroke !== true) { spriteNumber = PRIMARY_CIRCLE_NO_STROKE; }
	} else {
		if (parameters.squares === true && parameters.showStroke === true) { spriteNumber = SECONDARY_SQUARE; }
		if (parameters.squares === true && parameters.showStroke !== true) { spriteNumber = SECONDARY_SQUARE_NO_STROKE; }
		if (parameters.squares !== true && parameters.showStroke === true) { spriteNumber = SECONDARY_CIRCLE; }
		if (parameters.squares !== true && parameters.showStroke !== true) { spriteNumber = SECONDARY_CIRCLE_NO_STROKE; }
	}

	return spriteNumber;

}

const drawCells = (timestamp) => {
	for (let i = 0; i < cells.length; i++) {
		let cell = cells[i];

		if (timestamp > (cell.interactionStart + parameters.fadeoutDuration)) {
			cell.isInteracting = false;
		}

		if (timestamp > (cell.lifeStart + parameters.fadeoutDuration)) {
			cell.isAlive = false;
		}

		if (cell.isInteracting || cell.isAlive) {
			let decay = 1 - (timestamp - cell.lifeStart) / parameters.fadeoutDuration;
			let alpha = .5;
			const spriteNumber = getSpriteNumber(cell.isInteracting);

			if (cell.isInteracting === true) {
				decay = 1 - (timestamp - cell.interactionStart) / parameters.fadeoutDuration;
				alpha = decay;

				cell.sprites[getSpriteNumber(false)].visible = false;
			}

			cell.sprites[spriteNumber].visible = true;
			cell.sprites[spriteNumber].alpha = alpha;
			cell.sprites[spriteNumber].scale.set(decay);
		} else {
			cell.sprites.forEach(sprite => {
				sprite.visible = false;
			});
		}

		cells[i] = cell;
	}
}

export const addFilter = (filter) => {
	filters.push(filter);
	app.stage.filters = filters;
}

export const clearFilter = () => {
	filters.length = 0;
	app.stage.filters = [];
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
	
	// setTimeout(() => {
	// 	initParameters();
	// }, 500);
	initParameters();
}

export const initGrid = () => {
	destroyCells();
	positionCells();
	setStage();
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
	// I know this is bad but I haven't fixed it yet
	// it should be one loop through the cells where the interaction points are checked
	interactionPoints.forEach((point) => {
		if (point === null) {
			return;
		}
		for (let i = 0; i < cells.length; i++) {
			if (parameters.interactionRadius > Math.abs(cells[i].x - point.x) || parameters.interactionRadius > Math.abs(cells[i].y - point.y) ) {
				if (Math.hypot(cells[i].x - point.x, cells[i].y - point.y) < parameters.interactionRadius) {
					cells[i].isInteracting = true;
					cells[i].isAlive = true;
					cells[i].interactionStart = timestamp;
					cells[i].lifeStart = timestamp;
				}
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
	interactionPoints[POINT_MOUSE] = null;
}

const handleInteraction = (event) => {
	let eventX = event.clientX;
	let eventY = event.clientY;
	if (event.touches) {
		eventX = event.touches[0].clientX;
		eventY = event.touches[0].clientY;
	}

	interactionPoints[POINT_MOUSE] = { x: eventX, y: eventY };
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