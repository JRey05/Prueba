var gl = null

//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)
var vaoExtension = null;
var shaderProgram  = null; //Shader program to use.
var vao = null; //Geometry to render (stored in VAO).
var indexCount = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Aux variables,
var angle = 0;
var scale = 1;

var camera;

function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
  let vertexShader = createShader(gl.VERTEX_SHADER,vertexShaderSource);
  let fragmentShader = createShader(gl.FRAGMENT_SHADER,fragmentShaderSource);
  let shaderProgram = gl.createProgram();

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return (shaderProgram);
}

function getVertexShaderSource() {
return `
	attribute vec3 vertexPos;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;

	varying vec3 vColor;

	void main(void) {
  	vColor = vec3(vertexPos.x + 1.0, vertexPos.y + 1.0, vertexPos.z + 1.0);
  	gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1.0);
	}
`;
}

function getFragmentShaderSource() {
return `
	precision mediump float;

  varying vec3 vColor;

  void main(void) {
		gl_FragColor = vec4(vColor, 1.0);
	}
`;
}

function createShader(type, shaderSource) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  return (shader);
}

function createVBO(data) {
  let vbo = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return (vbo);
}

function createEBO(data) {
  let ebo = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return (ebo);
}

function createVAO(indices, positions, posLocation) {
	let vao = vaoExtension.createVertexArrayOES();
  let ebo = createEBO(indices);
  let vboPosition = createVBO(positions);

  vaoExtension.bindVertexArrayOES(vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition);
  gl.enableVertexAttribArray(posLocation);
  gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

	vaoExtension.bindVertexArrayOES(null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return (vao);
}

function onLoad() {
  let canvas = document.getElementById('webglCanvas');
  gl = canvas.getContext('webgl');
  vaoExtension = gl.getExtension('OES_vertex_array_object');

  let vertexShaderSource = getVertexShaderSource();
  let fragmentShaderSource = getFragmentShaderSource();
  let positions = [
    -1,0,-1, // Base
    1,0,-1, // Base
    1,0,1, // Base
    0,4,0, // Punta
    -1,0,1 // Base
  ];
  let indices = [
    0,1,3, // Cara frontal
    1,2,3, // Cara derecha
    2,4,3, // Cara trasera
    0,4,3, // Cara izquierda
    4,0,1, // Cara inferior
    4,1,2 // Cara inferior
  ];
  indexCount = indices.length;

  shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);
  let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	u_modelColor = gl.getUniformLocation(shaderProgram, 'modelColor');

	vao = createVAO(indices, positions, posLocation);

  gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  camera = new SphericalCamera(55, canvas.clientWidth / canvas.clientHeight);//use canvas dimensions
  onRender();
}

function onRender() {
  let modelMatrix = createModelMatrix();
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaderProgram);
  gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);

	vaoExtension.bindVertexArrayOES(vao);
  gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

	vaoExtension.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function createModelMatrix() {
	let modelMatrix = mat4.create();
	let rotationMatrix = mat4.create();
	let scaleMatrix = mat4.create();
	mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle));
	mat4.fromScaling(scaleMatrix, [scale, scale, scale]);

	mat4.multiply(modelMatrix, rotationMatrix, scaleMatrix);

	return modelMatrix;
}
