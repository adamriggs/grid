import GUI from 'lil-gui';
import { initGrid, grid, setStage, blurFilter, addFilter, clearFilter } from './grid';
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
	showLife: false,
	blur: false,
	blurStrength: 4,
	gridSize: 20,
	fillSize: 20,
	interactionRadius: 30,
	fadeoutDuration: 1000
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

gui.add(parameters, 'fadeoutDuration', 100, 5000).onChange((value) => {
	parameters.fadeoutDuration = value;
});


const animations = gui.addFolder('Animations');

animations.add(parameters, 'showKnightRider').onChange((value) => {
	parameters.showKnightRider = value;
	if (value === true) {
		initKnightRider();
	} else {
		endKnightRider();
	}
});

animations.add(parameters, 'showHeartBeat').onChange((value) => {
	parameters.showHeartBeat = value;
	if (value === true) {
		initHeartBeat();
	} else {
		endHeartBeat();
	}
});

animations.add(parameters, 'showLife').onChange((value) => {
	parameters.showLife = value;
});



const filters = gui.addFolder('Post Processing');

filters.add(parameters, 'blur').onChange((value) => {
	parameters.blurFilter = value;

	if (value === true) {
		addFilter(blurFilter);
	} else {
		clearFilter();
	}
});

filters.add(parameters, 'blurStrength', 0, 20).onChange((value) => {
	blurFilter.strength = value;
});
