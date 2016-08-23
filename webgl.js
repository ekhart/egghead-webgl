var gl,
	shaderProgram;

// 1. Setting Up WebGL
initGL();
createShaders();
draw();

function initGL() {
	var canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");	// experimental-webgl

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 1, 1, 1);
	// didn't do anything
}

function createShaders() {
	// vertex shader
	var vertexShaderSource = "";
	vertexShaderSource += "void main(void) {";
	vertexShaderSource += "	gl_Position = vec4(0.5, 0.5, 0.0, 1.0);";	//position in world
	vertexShaderSource += "	gl_PointSize = 100.0;";		// size of point rendered
	vertexShaderSource += "}";

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	// fragment shader
	var fragmentShaderSource = "";
	fragmentShaderSource += "void main(void) {";
	fragmentShaderSource += "	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);";	// color of point
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

function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, 1);
}