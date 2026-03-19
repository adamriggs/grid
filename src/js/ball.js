import * as PIXI from 'pixi.js';
import Stats from 'stats.js';

const app = new PIXI.Application();
const contentElem = document.getElementById('content');
const backgroundColor = 0xABDADC;
const ballColor = 0xFF4400;

const ball = new PIXI.Graphics();
const ballRadius = 50;
const ballXStart = (window.innerWidth / 2) - (ballRadius / 2);
const ballYStart = 0;
let ballXVelocity = 0;
let ballYVelocity = 0;

let bottom = window.innerHeight - ballRadius;
let top = ballRadius;
let right = window.innerWidth - ballRadius;
let left = ballRadius;
let gravity = 9.81;
let prevTime = 0;
const friction = .99;
const maxVelocity = 50;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const initApp = async() => {
	await app.init({
		width: '100vw',
		height: '100vh',
		backgroundColor: backgroundColor,
		resizeTo: window,
	});

	contentElem.appendChild(app.canvas);
}

const initBall = () => {
	ball.circle(0, 0, ballRadius);
	app.stage.addChild(ball);
	resetBall();
}

const resetBall = () => {
	ball.fill(ballColor);
	ball.x = ballXStart;
	ball.y = ballYStart;

	ballXVelocity = 0;
	ballYVelocity = 0;
}

const animate = (timestamp) => {
	stats.begin();
	if (!prevTime) {
		prevTime = timestamp;
	}
	const deltaTime = timestamp - prevTime;
	prevTime = timestamp;

	ballYVelocity += gravity * deltaTime / 100;

	ballXVelocity = Math.abs(ballXVelocity) > .001 ? ballXVelocity : 0;
	ballYVelocity = Math.abs(ballYVelocity) > .001 ? ballYVelocity : 0;

	ball.y += ballYVelocity;
	ball.x += ballXVelocity;

	if (ball.y >= bottom) {
		ball.y = bottom;
		ballXVelocity *= friction;
		ballYVelocity *= Math.pow(friction, 10);
		ballYVelocity *= -1;
	}

	if (ball.y <= top) {
		ball.y = top;
		ballXVelocity *= friction;
		ballYVelocity *= -1;
	}

	if (ball.x >= right) {
		ball.x = right;
		ballXVelocity *= Math.pow(friction, 10);
		ballXVelocity *= -1;
	}

	if (ball.x <= left) {
		ball.x = left;
		ballXVelocity *= Math.pow(friction, 10);
		ballXVelocity *= -1;
	}

	stats.end();
	requestAnimationFrame(animate);
}

const handleClick = (event) => {
	let eventX, eventY;
	if (event.touches) {
		eventX = event.touches[0].clientX;
		eventY = event.touches[0].clientY;
	} else {
		eventX = event.clientX;
		eventY = event.clientY;
	}
	const distanceX = eventX - ball.x;
	const distanceY = eventY - ball.y;
	let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	const radians = Math.atan2(distanceX, distanceY);

	if (distance > maxVelocity) { distance = maxVelocity; }
	const accelerationX = Math.sin(radians) * distance > maxVelocity ? maxVelocity : Math.sin(radians) * distance;
	const accelerationY = Math.cos(radians) * distance > maxVelocity ? maxVelocity : Math.cos(radians) * distance;

	ballXVelocity += accelerationX;
	ballYVelocity += accelerationY;
}

const updatePositions = () => {
	ball.x = (window.innerWidth / 2) - (ballRadius / 2);
	bottom = window.innerHeight - 50;
}

window.addEventListener('load', () => {
	initApp();
	initBall();

	requestAnimationFrame(animate);
});

window.addEventListener('resize', () => {
	updatePositions();
});

window.addEventListener('click', handleClick, false);
document.addEventListener('touchstart', handleClick, false);