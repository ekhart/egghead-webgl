var gl;

// 1. Setting Up WebGL
initGL();
draw();

function initGL () {
	var canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");	// experimental-webgl

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 0, 0, 1);
	// didn't do anything
}

function draw () {
	gl.clear(gl.COLOR_BUFFER_BIT);
}