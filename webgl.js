var gl,
	shaderProgram;

// 1. Setting Up WebGL
initGL();
createShaders();
createVertices();
draw();

function initGL() {
	var canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");	// experimental-webgl

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 1, 1, 1);
	// didn't do anything
}

// todo:
// o experiment with data
// o refact duplication
function createShaders() {
	// vertex shader
	var vertexShaderSource = "";
	vertexShaderSource += "attribute vec4 coords;";
	vertexShaderSource += "attribute float pointSize;";
	vertexShaderSource += "void main(void) {";
	vertexShaderSource += "	gl_Position = coords;";	//position in world
	vertexShaderSource += "	gl_PointSize = pointSize;";		// size of point rendered
	vertexShaderSource += "}";

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	// fragment shader
	var fragmentShaderSource = "";
	fragmentShaderSource += "precision mediump float;";
	fragmentShaderSource += "uniform vec4 color;";
	fragmentShaderSource += "void main(void) {";
	fragmentShaderSource += "	gl_FragColor = color;";	// color of point
	fragmentShaderSource += "}";

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);
}

function createVertices() {
	var coords = gl.getAttribLocation(shaderProgram, "coords");
	gl.vertexAttrib3f(coords, 0, 0, 0);

	var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
	gl.vertexAttrib1f(pointSize, 10);

	var color = gl.getUniformLocation(shaderProgram, "color");
	gl.uniform4f(color, 0, 1, 1, 1);
}

function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, 1);
}