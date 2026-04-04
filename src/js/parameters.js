import GUI from 'lil-gui';
import { initGrid, grid } from './grid';
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
	showGameOfLife: false,
	size: 10,
	interactionRadius: 15,
	animationDuration: 1000
};

const gui = new GUI();
document.body.appendChild(gui.domElement);
gui.add(parameters, 'showGrid').onChange((value) => {
	grid.visible = value;
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
gui.add(parameters, 'showGameOfLife').onChange((value) => {
	parameters.showGameOfLife = value;
	initGrid();
});
gui.add(parameters, 'size', 3, 100).onChange((value) => {
	parameters.size = value;
	initGrid();
});
gui.add(parameters, 'interactionRadius', 1, 100).onChange((value) => {
	parameters.interactionRadius = value;
});
gui.add(parameters, 'animationDuration', 100, 5000).onChange((value) => {
	parameters.animationDuration = value;
});