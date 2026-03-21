import * as PIXI from 'pixi.js';
import Stats from 'stats.js';

const app = new PIXI.Application();
const contentElem = document.getElementById('content');

let prevTime = 0;

const backgroundColor = 0xABDADC;
const radius = 10;
let circles = [];
const circleStroke = 0xFF4400;
let circleXPos = radius;
let circleYPos = radius;

const interactionRadius = 50;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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
	let circleXPos = radius / 2;
	let circleYPos = radius / 2;
	const circleXCount = Math.ceil(window.innerWidth / (radius * 2));
	const circleYCount = Math.ceil(window.innerHeight / (radius * 2));

	let circleNum = 0;

	for (let i = 0; i < circleYCount; i++) {

		for (let j = 0; j < circleXCount; j++) {
			if (circles[circleNum] === undefined) {
				circles[circleNum] = {};
				const gfx = new PIXI.Graphics();
				app.stage.addChild(gfx);
				circles[circleNum].gfx = gfx;

				gfx.circle(circleXPos, circleYPos, radius);
				gfx.stroke({
					width: 1,
					color: circleStroke
				});

				gfx.x = circleXPos;
				gfx.y = circleYPos;
				circles[circleNum].x = circleXPos;
				circles[circleNum].y = circleYPos;
			}

			circleXPos += radius;
			circleNum++;
		}

		circleXPos = radius / 2;
		circleYPos = radius * (i + 1) + (radius / 2);
	}
}

const drawCircles = () => {
	// console.log('drawCircles()');

	for (let i = 0; i < circles.length; i++) {
		if (circles[i].animating) {
			circles[i].stroke--;
			if (circles[i].stroke <= 1) {
				circles[i].stroke = 1;
				circles[i].animating = false;
			}

			circles[i].radius--;
			if (circles[i].radius <= 10) {
				circles[i].radius = 10;
				// circles[i].animating = false;
			}

			const gfx = circles[i].gfx;
			app.stage.removeChild(gfx);
			gfx.clear();
			gfx.circle(circles[i].x, circles[i].y, circles[i].radius);
			gfx.stroke({
				width: circles[i].stroke,
				color: circleStroke
			});
			app.stage.addChild(gfx);
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

	handleResize();
}

const initGrid = () => {
	destroyCircles();
	positionCircles();
	drawCircles();
}

const animate = (timestamp) => {
	stats.begin();
	if (!prevTime) {
		prevTime = timestamp;
	}
	const deltaTime = timestamp - prevTime;
	prevTime = timestamp;

	drawCircles();

	stats.end();
	requestAnimationFrame(animate);
}

const handleResize = () => {
	app.resize(window.innerWidth, window.innerHeight);

	// const newWidth = window.innerWidth;
	// const newHeight = window.innerHeight;

	// // Resize renderer and scale stage content
	// app.renderer.resize(newWidth, newHeight);
	// app.stage.scale.set(newWidth / originalWidth, newHeight / originalHeight);

	// console.log(app);
	initGrid();
}

const handleInteraction = (event) => {
	// console.log(event);
	let eventX, eventY;
	if (event.touches) {
		eventX = event.touches[0].clientX;
		eventY = event.touches[0].clientY;
	} else {
		eventX = event.clientX;
		eventY = event.clientY;
	}

	findInteractables(eventX, eventY);
}

const findInteractables = (x, y) => {
	for (let i = 0; i < circles.length; i++) {
		if (isInteractable(x, y, circles[i])) {
			circles[i].interacting = true;
			circles[i].animating = true;
			circles[i].stroke = 20;
			circles[i].radius = 30;
		} else {
			circles[i].interacting = false;
		}
	}
}

const isInteractable = (x, y, circle) => {
	let found = false;

	const distance = Math.hypot(circle.gfx.x - x, circle.gfx.y - y);
	if (distance < interactionRadius) { found = true; }

	return found;
}

window.addEventListener('load', () => {
	initApp();
	// handleResize();

	requestAnimationFrame(animate);
});

window.addEventListener('resize', () => {
	handleResize();
});

window.addEventListener('mousemove', handleInteraction, false);
document.addEventListener('touchstart', handleInteraction, false);