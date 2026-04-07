import GUI from 'lil-gui';
import { initGrid, grid, setStage } from './grid';
import {
	initHeartBeat,
	endHeartBeat,
	initKnightRider,
	endKnightRider
} from './animations';

export const parameters = {
	total_cells: 0,
	squares: false,
	showGrid: false,
	showStroke: true,
	showKnightRider: false,
	showHeartBeat: true,
	showLife: true,
	gridSize: 20,
	fillSize: 20,
	interactionRadius: 30,
	animationDuration: 1000
};

const gui = new GUI();
document.body.appendChild(gui.domElement);

gui.add(parameters, 'total_cells').listen();

gui.add(parameters, 'squares').onChange((value) => {
	parameters.squares = value;
	setStage();
});

gui.add(parameters, 'showGrid').onChange((value) => {
	grid.visible = value;
});

gui.add(parameters, 'showStroke').onChange((value) => {
	parameters.stroke = value;
	setStage();
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

gui.add(parameters, 'showLife').onChange((value) => {
	parameters.showLife = value;
});

gui.add(parameters, 'gridSize', 5, 100).onChange((value) => {
	parameters.gridSize = value;
	initGrid();
});

gui.add(parameters, 'fillSize', 5, 100).onChange((value) => {
	parameters.fillSize = value;
	initGrid();
});

gui.add(parameters, 'interactionRadius', 1, 100).onChange((value) => {
	parameters.interactionRadius = value;
});

gui.add(parameters, 'animationDuration', 100, 5000).onChange((value) => {
	parameters.animationDuration = value;
});
