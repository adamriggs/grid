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

let prevTime = 0;

let grid = new PIXI.Graphics();
app.stage.addChild(grid);

let circles = [];
// const backgroundColor = 0xABDADC;
const backgroundColor = 0x708090;
const circleColor = 0x000000;
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
 * + fix heartbeat peak value
 * - base animation on time, not frames (currently if fps drops, animation slows down)
 * - grid lines as seperate layer that can be toggled on/off and isn't part of the animation (currently if you have the grid on, it gets redrawn every frame which is inefficient)
 * - add option for color schemes (get some color palettes from kuler)
 * - add option for multiple simultaneous interactions (e.g. multi-touch)
 * - add option for sinewaves
 * - add option for fireworks
 * - add option for worm
 */

const destroyCircles = () => {
	for (let i = 0; i < circles.length; i++) {
		if (Object.hasOwn(circles[i], 'gfx')) {
			app.stage.removeChild(circles[i].gfx);
			circles[i].gfx.destroy();
		}
	}
	circles = [];
}

const positionCircles = () => {
	let circleXPos = parameters.size / 2;
	let circleYPos = parameters.size / 2;
	const circleXCount = Math.ceil(window.innerWidth / (parameters.size * 2));
	const circleYCount = Math.ceil(window.innerHeight / (parameters.size * 2));
	grid = new PIXI.Graphics();
	// app.stage.addChild(grid);

	let circleNum = 0;

	for (let i = 0; i < circleYCount; i++) {

		for (let j = 0; j < circleXCount; j++) {
			if (circles[circleNum] === undefined) {
				circles[circleNum] = {};
				const gfx = new PIXI.Graphics();
				app.stage.addChild(gfx);
				circles[circleNum].gfx = gfx;

				if (parameters.showGrid === true) {
					if (parameters.squares === false) {
						gfx.circle(circleXPos, circleYPos, parameters.size);
					} else {
						gfx.rect(circleXPos - parameters.size, circleYPos - parameters.size, parameters.size * 2, parameters.size * 2);
					}
					gfx.stroke({
						width: 1,
						color: circleColor
					});
				}

				gfx.x = circleXPos;
				gfx.y = circleYPos;
				circles[circleNum].x = circleXPos;
				circles[circleNum].y = circleYPos;
				circles[circleNum].radius = parameters.size;
			}

			circleXPos += parameters.size;
			circleNum++;
		}

		circleXPos = parameters.size / 2;
		circleYPos = parameters.size * (i + 1) + (parameters.size / 2);
	}
}

const drawGrid = () => {

}

const drawCircles = (deltaTime) => {
	for (let i = 0; i < circles.length; i++) {
		if (circles[i].animating === true) {
			circles[i].animationCounter--;
			if (circles[i].animationCounter <= 0) {
				circles[i].animating = false;
			}
			
			circles[i].gfx.clear();

			if (circles[i].animating === true) {

				const radius = circles[i].radius * circles[i].animationCounter / parameters.maxAnimationTime;
				const alpha = circles[i].animationCounter / parameters.maxAnimationTime;

				if(parameters.squares === false) {
					circles[i].gfx.circle(circles[i].x, circles[i].y, radius);
				} else {
					circles[i].gfx.rect(circles[i].x - radius, circles[i].y - radius, radius * 2, radius * 2);
				}
				circles[i].gfx.fill({color: highlightColor, alpha: alpha});
				circles[i].gfx.stroke({
					alpha: alpha,
					color: circleColor,
					width: 1
				});
			} else {
				if (parameters.showGrid === true) {
					if(parameters.squares === false) {
						circles[i].gfx.circle(circles[i].x, circles[i].y, circles[i].radius);
					} else {
						circles[i].gfx.rect(
							circles[i].x - parameters.size,
							circles[i].y - parameters.size,
							parameters.size * 2,
							parameters.size * 2
						);
					}
					circles[i].gfx.stroke({
						width: 1,
						color: circleColor
					});
				}
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
	destroyCircles();
	positionCircles();
	drawGrid();
	drawCircles();
}

const animate = (timestamp) => {
	stats.begin();
	if (!prevTime) {
		prevTime = timestamp;
	}
	const deltaTime = timestamp - prevTime;
	prevTime = timestamp;

	findInteractables();
	drawCircles(deltaTime);

	stats.end();
	requestAnimationFrame(animate);
}

const handleResize = () => {
	initGrid();
}

const handleLeave = (event) => {
	console.log('leave');
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

const findInteractables = () => {
	gridPoints.forEach((point) => {
		if (point === null) {
			return;
		}
		for (let i = 0; i < circles.length; i++) {
			if (isInteractable(point.x, point.y, circles[i])) {
				circles[i].animating = true;
				circles[i].animationCounter = parameters.maxAnimationTime;
			}
		}
	});
}

const isInteractable = (x, y, circle) => {
	let found = false;

	const distance = Math.hypot(circle.gfx.x - x, circle.gfx.y - y);
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