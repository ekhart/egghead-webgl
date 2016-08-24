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
		-0.9, .5, 0,
		-0.7, -.5, 0,
		-.5, .5, 0,
		-.3, -.5, 0,
		-.1, .5, 0,
		.1, -.5, 0,
		.3, .5, 0,
		.5, -.5, 0,
		0.7, .5, 0,
		0.9, -.5, 0,
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
	// gl.LINE_STRIP - not closed triangle from lines
	// gl.LINE_LOOP - triangle from lines
	// gl.TRIANGLES - filled triangle
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
	// gl.drawArrays(gl.LINE_STRIP, 5, 5);

	gl.drawArrays(gl.LINE_STRIP, 0, 3);
	gl.drawArrays(gl.LINE_STRIP, 7, 3);
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample2/webgl-demo.js
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.
  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, theSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}