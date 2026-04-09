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

const url = new URL(window.location.href);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const gui = new GUI();
document.body.appendChild(gui.domElement);

gui.add(parameters, 'total_cells').listen();

class Param {
	constructor(name) {
		this.name = name;
		this.value;
		this.controller;
		this.update;
	}

	onChange(value) {
		// value = Math.round(value);
		this.value = value;
		parameters[this.name] = value;
		this.update(value);
		this.setURLParameter();
		this.controller.updateDisplay();
	}

	setURLParameter() {
		url.searchParams.set(this.name, this.value);
		// window.history.pushState({}, '', url.toString());
	}
};

const squaresParam = new Param('squares');
squaresParam.update = (value) => {
	parameters.squares = value;
	setStage();
};
squaresParam.controller = gui.add(parameters, 'squares').onChange(value => squaresParam.onChange(value));

const showGridParam = new Param('showGrid');
showGridParam.update = (value) => {
	grid.visible = value;
};
showGridParam.controller = gui.add(parameters, 'showGrid').onChange(value => showGridParam.onChange(value));

const showStrokeParam = new Param('showStroke');
showStrokeParam.update = (value) => {
	parameters.stroke = value;
	setStage();
};
showStrokeParam.controller = gui.add(parameters, 'showStroke').onChange(value => showStrokeParam.onChange(value));

const gridSizeParam = new Param('gridSize');
gridSizeParam.update = (value) => {
	value = Math.round(value);
	parameters.gridSize = value;
	initGrid();
};
gridSizeParam.controller = gui.add(parameters, 'gridSize', 5, 500).onChange(value => gridSizeParam.onChange(value));

const fillSizeParam = new Param('fillSize');
fillSizeParam.update = (value) => {
	value = Math.round(value);
	parameters.fillSize = value;
	initGrid();
};
fillSizeParam.controller = gui.add(parameters, 'fillSize', 5, 500).onChange(value => fillSizeParam.onChange(value));

const interactionRadiusParam = new Param('interactionRadius');
interactionRadiusParam.update = (value) => {
	value = Math.round(value);
	parameters.interactionRadius = value;
};
interactionRadiusParam.controller = gui.add(parameters, 'interactionRadius', 1, 500).onChange(value => interactionRadiusParam.onChange(value));

const fadeoutDurationParam = new Param('fadeoutDuration');
fadeoutDurationParam.update = (value) => {
	value = Math.round(value);
	parameters.fadeoutDuration = value;
};
fadeoutDurationParam.controller = gui.add(parameters, 'fadeoutDuration', 10, 5000).onChange(value => fadeoutDurationParam.onChange(value));

/**
 * animatiions folder
 */
const animations = gui.addFolder('Animations');

const showKnightRiderParam = new Param('showKnightRider');
showKnightRiderParam.update = (value) => {
	parameters.showKnightRider = value;
	if (value === true) {
		initKnightRider();
	} else {
		endKnightRider();
	}
};
showKnightRiderParam.controller = animations.add(parameters, 'showKnightRider').onChange(value => showKnightRiderParam.onChange(value));

const showHeartBeatParam = new Param('showHeartBeat');
showHeartBeatParam.update = (value) => {
	parameters.showHeartBeat = value;
	if (value === true) {
		initHeartBeat();
	} else {
		endHeartBeat();
	}
};
showHeartBeatParam.controller = animations.add(parameters, 'showHeartBeat').onChange(value => showHeartBeatParam.onChange(value));

const showLifeParam = new Param('showLife');
showLifeParam.update = (value) => {
	parameters.showLife = value;
};
showLifeParam.controller = animations.add(parameters, 'showLife').onChange(value => showLifeParam.onChange(value));

/**
 * filters folder
 */
const filters = gui.addFolder('Post Processing');

const blurParam = new Param('blur');
blurParam.update = (value) => {
	parameters.blur = value;
		if (value === true) {
			addFilter(blurFilter);
		} else {
			clearFilter();
		}
};
blurParam.controller = filters.add(parameters, 'blur').onChange(value => blurParam.onChange(value));

const blurStrengthParam = new Param('blurStrength');
blurStrengthParam.update = (value) => {
	blurFilter.strength = value;
}
blurStrengthParam.controller = filters.add(parameters, 'blurStrength', 0, 20).onChange(value => blurStrengthParam.onChange(value));

/**
 * url buttons
 */

const sharing = gui.addFolder('Sharing');

const setURL = {
	setQueryString: function () {
		window.history.pushState({}, '', url.toString());
	},
	clearQueryString: function () {
		// Get the current URL without the query string
		const cleanUrl = window.location.origin + window.location.pathname;

		// Update the address bar without a reload
		window.history.replaceState({}, document.title, cleanUrl);

	}
}

sharing.add(setURL, 'setQueryString');
sharing.add(setURL, 'clearQueryString');

/**
 * 
 * Main Functions
 * 
 */

export const initParameters = () => {
	const squares = urlParams.get('squares') !== null ? returnBinary(urlParams.get('squares')) : parameters.squares;
	const showGrid = urlParams.get('showGrid') !== null ? returnBinary(urlParams.get('showGrid')) : parameters.showGrid;
	const showStroke = urlParams.get('showStroke') !== null ? returnBinary(urlParams.get('showStroke')) : parameters.showStroke;
	squaresParam.onChange(squares);
	showGridParam.onChange(showGrid);
	showStrokeParam.onChange(showStroke);

	const gridSize = urlParams.get('gridSize') !== null ? urlParams.get('gridSize') : parameters.gridSize;
	gridSizeParam.onChange(gridSize);
	const fillSize = urlParams.get('fillSize') !== null ? urlParams.get('fillSize') : parameters.fillSize;
	fillSizeParam.onChange(fillSize);
	
	const interactionRadius = urlParams.get('interactionRadius') !== null ? urlParams.get('interactionRadius') : parameters.interactionRadius;
	const fadeoutDuration = urlParams.get('fadeoutDuration') !== null ? urlParams.get('fadeoutDuration') : parameters.fadeoutDuration;
	interactionRadiusParam.onChange(interactionRadius);
	fadeoutDurationParam.onChange(fadeoutDuration);

	const showKnightRider = urlParams.get('showKnightRider') !== null ? returnBinary(urlParams.get('showKnightRider')) : parameters.showKnightRider;
	const showHeartBeat = urlParams.get('showHeartBeat') !== null ? returnBinary(urlParams.get('showHeartBeat')) : parameters.showHeartBeat;
	const showLife = urlParams.get('showLife') !== null ? returnBinary(urlParams.get('showLife')) : parameters.showLife;
	showKnightRiderParam.onChange(showKnightRider);
	showHeartBeatParam.onChange(showHeartBeat);
	showLifeParam.onChange(showLife);

	const blur = urlParams.get('blur') !== null ? returnBinary(urlParams.get('blur')) : parameters.blur;
	const blurStrength = urlParams.get('blurStrength') !== null ? urlParams.get('blurStrength') : parameters.blurStrength;
	blurParam.onChange(blur);
	blurStrengthParam.onChange(blurStrength);

}

const returnBinary = (value) => {
	if (value === '1' || value === true || value === 'true' || value === 'TRUE') {
		return true;
	} else {
		return false;
	}
}
