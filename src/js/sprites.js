import * as PIXI from 'pixi.js';
import { parameters } from './parameters';

export const strokeColor = 0x000000;
const primaryColor = 0xF0F8FF; // alice blue
// const secondaryColor = 0x2C3E50;	// deep navy
// const secondaryColor = 0x708090; // slate gray
// const primaryColor = 0xFF9900;
const secondaryColor = 0xdcd0ff;	// light purple
// const primaryColor = 0xF0F8FF;	// alice blue

/**
 * PRIMARY CIRCLE
 */
export const primaryCircle = (stroke) => {
	const s = new PIXI.Graphics();
	s.circle(0, 0, parameters.fillSize / 2);
	s.fill({ color: primaryColor, alpha: 1 });
	if (stroke === true) {
		s.stroke({
			alpha: 1,
			color: strokeColor,
			width: 1
		});
	}
	s.cacheAsTexture = true;

	return s;
}

/**
 * PRIMARY SQUARE
 */
export const primarySquare = (stroke) => {
	const s = new PIXI.Graphics();
	s.rect(0, 0, parameters.fillSize, parameters.fillSize);
	s.fill({ color: primaryColor, alpha: 1 });
	if (stroke === true) {
		s.stroke({
			alpha: 1,
			color: strokeColor,
			width: 1
		});
	}
	s.cacheAsTexture = true;

	return s;
}

/**
 * SECONDARY CIRCLE
 */
export const secondaryCircle = (stroke) => {
	const s = new PIXI.Graphics();
	s.circle(0, 0, parameters.fillSize / 2);
	s.fill({ color: secondaryColor, alpha: 1 });
	if (stroke === true) {
		s.stroke({
			alpha: 1,
			color: strokeColor,
			width: 1
		});
	}
	s.cacheAsTexture = true;

	return s;
}

/**
 * SECONDARY SQUARE
 */
export const secondarySquare = (stroke) => {
	const s = new PIXI.Graphics();
	s.rect(0, 0, parameters.fillSize, parameters.fillSize);
	s.fill({ color: secondaryColor, alpha: 1 });
	if (stroke === true) {
		s.stroke({
			alpha: 1,
			color: strokeColor,
			width: 1
		});
	}
	s.cacheAsTexture = true;

	return s;
}