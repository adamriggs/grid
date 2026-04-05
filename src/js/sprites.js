import * as PIXI from 'pixi.js';

const primaryCircle = new PIXI.Graphics();
primaryCircle.circle(0, 0, parameters.size / 2);
primaryCircle.fill({ color: primaryColor, alpha: 1 });
primaryCircle.stroke({
	alpha: 1,
	color: strokeColor,
	width: 1
});
primaryCircle.cacheAsTexture = true;
primaryTexture = app.renderer.generateTexture(primaryCircle, {
	scaleMode: 'linear',
	resolution: 2 // Higher resolution for better quality
});

const secondaryCircle = new PIXI.Graphics();
secondaryCircle.circle(0, 0, parameters.size / 2);
secondaryCircle.fill({ color: secondaryColor, alpha: 1 });
secondaryCircle.stroke({
	alpha: 1,
	color: strokeColor,
	width: 1
});
secondaryCircle.cacheAsTexture = true;
secondaryTexture = app.renderer.generateTexture(secondaryCircle, {
	scaleMode: 'linear',
	resolution: 2 // Higher resolution for better quality
});