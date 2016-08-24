var gl,
	shaderProgram,
	vertices;

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
// o under functions (reference at web)

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
	// 4. Create 3D Graphics in JavaScript Using WebGL
	// webgl use cartesian (-1, 1), (0, 0) - center
	// [x1, y1, z1, x2, y2, z2, ...]
	vertices = [
		-0.9, -0.9, 0.0,
		0.9, -0.9, 0.0,
		0.9, -0.9, 0.0,
		0.0, 0.9, 0.0,
		0.0, 0.9, 0.0,
		-0.9, -0.9, 0.0,
	];

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// pass data to shaders
	var coords = gl.getAttribLocation(shaderProgram, "coords");
	// gl.vertexAttrib3f(coords, 0, 0, 0);
	gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(coords);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
	gl.vertexAttrib1f(pointSize, 10);

	var color = gl.getUniformLocation(shaderProgram, "color");
	gl.uniform4f(color, 0, 0, 0, 1);
}

function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	// gl.POINTS - draw points
	// gl.LINES - draw lines from buffer from point 1 to 2 [x1, y1, z1, x2, y2, z2]
	gl.drawArrays(gl.LINES, 0, 6);
}