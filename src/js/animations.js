import gsap from 'gsap';
import { parameters } from './parameters';

export let interactionPoints = [];
export const POINT_MOUSE = 0;
export const POINT_KNIGHT = 1;
export const POINT_HEARTBEAT = 2;

export const endKnightRider = () => {
	gsap.killTweensOf(interactionPoints[POINT_KNIGHT]);
	interactionPoints[POINT_KNIGHT] = null;
}

export const initKnightRider = () => {
	const yPos = Math.floor(window.innerHeight / 2 / parameters.gridSize) * parameters.gridSize + (parameters.gridSize / 2);

	interactionPoints[POINT_KNIGHT] = { x: 0, y: yPos };
	const xBuffer = window.innerWidth / 4;

	gsap.fromTo(interactionPoints[POINT_KNIGHT],
		{
			x: (window.innerWidth / 2) - xBuffer
		},
		{
			x: (window.innerWidth / 2) + xBuffer,
			duration: 1,
			repeat: -1,
			yoyo: true,
			ease: 'linear',
		},
	);
};

export const endHeartBeat = () => {
	gsap.killTweensOf(interactionPoints[POINT_HEARTBEAT]);
	interactionPoints[POINT_HEARTBEAT] = null;
}

export const initHeartBeat = () => {
	const heartBeatDuration = 1;
	const yBaseline = window.innerHeight / 3 * 2;
	const yPeak = window.innerHeight / 3;
	interactionPoints[POINT_HEARTBEAT] = { x: 0, y: yBaseline };

	const heartBeat = gsap.timeline({
		repeat: -1,
		repeatDelay: 1,
		delay: 1,
	});

	heartBeat.fromTo(interactionPoints[POINT_HEARTBEAT],
	// horizontal movement
		{
			x: -parameters.fillSize * 2,
			y: yBaseline
		},
		{
			x: window.innerWidth + (parameters.gridSize * 2),
			duration: heartBeatDuration,
		},
	);

	heartBeat.fromTo(interactionPoints[POINT_HEARTBEAT],
	// vertical up
		{
			y: yBaseline
		},
		{
			y: yPeak,
			duration: heartBeatDuration / 4,
			ease: 'power2.inOut',
		},
		"<" + heartBeatDuration / 4
	);

	heartBeat.fromTo(interactionPoints[POINT_HEARTBEAT],
	// vertical down
		{
			y: yPeak
		},
		{
			y: yBaseline,
			duration: heartBeatDuration / 8,
			ease: 'power2.out',
		},
		"<" + heartBeatDuration / 8
	);
}