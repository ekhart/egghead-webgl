var gl,
	shaderProgram,
	vertices,
	// vertexCount = 5000,
	vertexCount = 30,
	mouseX = 0,
	mouseY = 0,
	matrix = mat4.create();

// convert canvas coordinate system (with (0,0) at left top corner)
// to WebGL coords system (with (0,0) at center of canvas)
canvas.addEventListener("mousemove", function(event) {
	mouseX = map(event.clientX, 0, canvas.width, -1, 1);
	mouseY = map(event.clientY, 0, canvas.height, 1, -1);
});

function map(value, minSrc, maxSrc, minDst, maxDst) {
	return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
}

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
// o move shaders to separate files
// o experiment with other transformation
// o add new shapes then transform

function createShaders() {
	var vertexShader = getShader(gl, "shader-vs");
	var fragmentShader = getShader(gl, "shader-fs");

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
	// vertices = [
	// 	-0.9, .5, 0,
	// 	-0.7, -.5, 0,
	// 	-.5, .5, 0,
	// 	-.3, -.5, 0,
	// 	-.1, .5, 0,
	// 	.1, -.5, 0,
	// 	.3, .5, 0,
	// 	.5, -.5, 0,
	// 	0.7, .5, 0,
	// 	0.9, -.5, 0,
	// ];

	// vertices = [];
	// for (var i = 0; i < vertexCount; ++i) {
	// 	vertices.push(Math.random() * 2 - 1);
	// 	vertices.push(Math.random() * 2 - 1);
	// }

	// vertices = [
	// 	-0.9, -0.9, 0.0,
	// 	0.9, -0.9, 0.0,
	// 	0.0, 0.9, 0.0,
	// ];

	vertices = [];
	for (var i = 0; i < vertexCount; i++) {
		vertices.push(Math.random() * 2 - 1);
		vertices.push(Math.random() * 2 - 1);
		vertices.push(Math.random() * 2 - 1);
	}

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
	// gl.bindBuffer(gl.ARRAY_BUFFER, null); 	// for simple program with one buffer it its make points moving
	// but for more buffers we need to

	// pass data to shaders
	var coords = gl.getAttribLocation(shaderProgram, "coords");
	// gl.vertexAttrib3f(coords, 0, 0, 0);
	gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(coords);

	var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
	gl.vertexAttrib1f(pointSize, 1);

	var color = gl.getUniformLocation(shaderProgram, "color");
	gl.uniform4f(color, 0, 0, 0, 1);
}

function draw() {
	// draw animated sand
	// for (var i = 0; i < vertexCount * 2; i += 2) {
	// 	var dx = vertices[i] - mouseX,
	// 		dy = vertices[i + 1] - mouseY,
	// 		dist = Math.sqrt(dx * dx + dy * dy);

	// 	if (dist < 0.2) {
	// 		vertices[i] = mouseX + dx / dist * 0.2;
	// 		vertices[i + 1] = mouseY + dy / dist * 0.2;
	// 	}
	// 	else {
	// 		vertices[i] += Math.random() * 0.01 - 0.005;
	// 		vertices[i + 1] += Math.random() * 0.01 - 0.005;
	// 	}
	// }
	// gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
	// requestAnimationFrame(draw);

	gl.clear(gl.COLOR_BUFFER_BIT);

	// gl.POINTS - draw points
	// gl.LINES - draw lines from buffer from point 1 to 2 [x1, y1, z1, x2, y2, z2]
	// gl.LINE_STRIP - not closed triangle from lines
	// gl.LINE_LOOP - triangle from lines
	// gl.TRIANGLES - filled triangle
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
	// gl.drawArrays(gl.LINE_STRIP, 5, 5);

	// gl.drawArrays(gl.LINE_STRIP, 0, 3);
	// gl.drawArrays(gl.LINE_STRIP, 7, 3);

	// gl.drawArrays(gl.POINTS, 0, vertexCount);

	mat4.rotateY(matrix, matrix, 0.01);
	mat4.rotateZ(matrix, matrix, 0.01);
	var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
	gl.uniformMatrix4fv(transformMatrix, false, matrix);

	gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
	requestAnimationFrame(draw);
}

// function rotateY(angle) {
// 	var cos = Math.cos(angle),
// 		sin = Math.sin(angle),
// 		matrix = new Float32Array(
// 			[cos, 0, sin, 0,
// 			   0, 1,   0, 0,
// 			-sin, 0, cos, 0,
// 			   0, 0,   0, 1]);

// 	var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
// 	gl.uniformMatrix4fv(transformMatrix, false, matrix);
// }

// // column order of matrix in WebGL
// function rotateZ(angle) {
// 	var cos = Math.cos(angle),
// 		sin = Math.sin(angle),
// 		matrix = new Float32Array(
// 			[cos, sin, 0, 0,
// 			-sin, cos, 0, 0,
// 			0, 0, 1, 0,
// 			0, 0, 0, 1]);

// 	var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
// 	gl.uniformMatrix4fv(transformMatrix, false, matrix);
// }

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

