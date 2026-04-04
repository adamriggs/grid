import gsap from 'gsap';
import { parameters } from './parameters';

export let gridPoints = [];
export const GRID_POINT_MOUSE = 0;
export const GRID_POINT_KNIGHT = 1;
export const GRID_POINT_HEARTBEAT = 2;

export const endKnightRider = () => {
	gsap.killTweensOf(gridPoints[GRID_POINT_KNIGHT]);
	gridPoints[GRID_POINT_KNIGHT] = null;
}

export const initKnightRider = () => {
	gridPoints[GRID_POINT_KNIGHT] = { x: 0, y: window.innerHeight / 4 };
	const xBuffer = 300;

	gsap.fromTo(gridPoints[GRID_POINT_KNIGHT],
		{
			x: xBuffer
		},
		{
			x: window.innerWidth / 2 - xBuffer,
			duration: .75,
			repeat: -1,
			yoyo: true,
			ease: 'linear',
		},
	);
};

export const endHeartBeat = () => {
	gsap.killTweensOf(gridPoints[GRID_POINT_HEARTBEAT]);
	gridPoints[GRID_POINT_HEARTBEAT] = null;
}

export const initHeartBeat = () => {
	const xBuffer = 0;
	const yBuffer = 125;
	const heartBeatDuration = .5;
	gridPoints[GRID_POINT_HEARTBEAT] = { x: 0, y: window.innerHeight / 2 };

	const heartBeat = gsap.timeline({
		// duration: 2,
		repeat: -1,
		repeatDelay: 1,
	});

	heartBeat.fromTo(gridPoints[GRID_POINT_HEARTBEAT],
		{
			x: xBuffer,
			y: window.innerHeight / 4
		},
		{
			x: window.innerWidth / 2 - xBuffer + (parameters.size * 2),
			duration: heartBeatDuration,
		},
	);

	heartBeat.fromTo(gridPoints[GRID_POINT_HEARTBEAT],
		{
			y: window.innerHeight / 4
		},
		{
			y: window.innerHeight / 4 - yBuffer,
			duration: heartBeatDuration / 4,
			ease: 'power2.inOut',
		},
		"<" + heartBeatDuration / 4
	);

	heartBeat.fromTo(gridPoints[GRID_POINT_HEARTBEAT],
		{
			y: window.innerHeight / 4 - yBuffer
		},
		{
			y: window.innerHeight / 4,
			duration: heartBeatDuration / 8,
			ease: 'power2.out',
		},
		"<" + heartBeatDuration / 8
	);
}