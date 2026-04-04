import GUI from 'lil-gui';
import { initGrid } from './circles';
import {
	initHeartBeat,
	endHeartBeat,
	initKnightRider,
	endKnightRider
} from './animations';

export const parameters = {
	showGrid: false,
	squares: false,
	showKnightRider: false,
	showHeartBeat: true,
	size: 10,
	interactionRadius: 15,
	animationMaxTime: 500
};

const gui = new GUI();
document.body.appendChild(gui.domElement);
gui.add(parameters, 'showGrid').onChange((value) => {
	parameters.showGrid = value;
	initGrid();
});
gui.add(parameters, 'squares').onChange((value) => {
	parameters.squares = value;
	initGrid();
});
gui.add(parameters, 'showKnightRider').onChange((value) => {
	parameters.showKnightRider = value;
	if (value === true) {
		initKnightRider();
	} else {
		endKnightRider();
	}
});
gui.add(parameters, 'showHeartBeat').onChange((value) => {
	parameters.showHeartBeat = value;
	if (value === true) {
		initHeartBeat();
	} else {
		endHeartBeat();
	}
});
gui.add(parameters, 'size', 3, 100).onChange((value) => {
	parameters.size = value;
	initGrid();
});
gui.add(parameters, 'interactionRadius', 1, 100).onChange((value) => {
	parameters.interactionRadius = value;
});
gui.add(parameters, 'animationMaxTime', 100, 1000).onChange((value) => {
	parameters.animationMaxTime = value;
});