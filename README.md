# Grid

## Interactive grid

This creates a grid. The cells either display circles or squares. Use your mouse pointer to interact with it.

###Controls
* squares: toggle circles or squares
* showGrid: toggle showing the grid lines
* showStroke: toggle showing an outline on the circles or squares
* gridSize: width and height of grid cells
* fillSize: width and height of the grid fill - making it larger than the grid size creates a cloudy effect if you also turn off the stroke
* interactionRadius: distance from the x,y coordinate of the mouse or animation point that affects the grid cells
* fadeoutDuration: length of time for a cell that is no longer being interacted with to alpha and scale to zero
animations
* showKnightRider: knight rider animation tweens x,y coordinates back and forth
* showHeartBeat: heartbeat is same as above but with a different path
* showLife: toggle conways game of life on and off
post processing
* blur: toggle blur on and off
* blurStrength: how hard it blurs

TODO:
✅fix heartbeat peak value
✅base animation on time, not frames
✅grid lines as separate layer that can be toggled on/off and isn't part of the animation loop
✅proper resizing and restart animations on resize
✅fix github link
✅conways game of life
✅sprites instead of graphics
perlin noise
✅test post processing
video cloud
fix scale/alpha banding on decay - anti alias?
consolodate various loops that happen pre-render
✅add parameters to url variables for linking to specific configurations

[View Here](https://adamriggs.github.io/grid/)
