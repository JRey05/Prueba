var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

var shaderProgram  = null; //Shader program to use.
var vaoSolid = null; //Geometry to render (stored in VAO).
var vaoWire = null;
var isSolid = false;
var indexCountSolid = 0;
var indexCountWire = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Uniform values.
var modelColor = Utils.hexToRgbFloat("#FFFFFF");

//Objects (OBJ)
var drone;
var mesa;

//Aux variables,
var angle = 0;
var scale = 1;
var parsedOBJ = null; //Parsed OBJ file

var axis;//Objeto auxiliar "Ejes"
var camera;

function loadObjects(pos_location) {

	drone = new Object(droneSource);
	drone.generateModel(pos_location);
	mesa = new Object(mesaSource);
	mesa.generateModel(pos_location);


}
function setObjectTransformations() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();

	/*
	let modelQuat = quat.create();
	let rotationQuat = quat.create();
	let scaleQuat= quat.create();

	quat.rotateY(rotationQuat, rotationQuat, glMatrix.toRadian(angle));
	quat.scale(scaleQuat, scaleQuat, scale);
	quat.mul(modelQuat, rotationQuat, scaleQuat);
	mat4.fromQuat(modelMatrix, modelQuat);
	*/

	// Set mono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.007, 0.007, 0.007]);
	mat4.fromTranslation(translation, [0.0, 0.0, 0.0]);
	mat4.multiply(matrix, translation, scaling);
	mesa.setModelMatrix(matrix);


	// Set esfera model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.005, 0.005, 0.005]);
	mat4.fromTranslation(translation, [0.35, 0.5, 0.0]);
	mat4.multiply(matrix, translation, scaling);
	drone.setModelMatrix(matrix);
}
  function onLoad() {
  	let canvas = document.getElementById('webglCanvas');
  	gl = canvas.getContext('webgl');
  	_gl = VAOHelper.getVaoExtension();

  	//SHADERS
  	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
  	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

  	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
  	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
  	u_modelColor = gl.getUniformLocation(shaderProgram, 'modelColor');

  	loadObjects(posLocation);
  	setObjectTransformations();

  	//BUFFERS
  	//let indicesSolid = parsedOBJ.indices;
  	//let indicesWire = Utils.reArrangeIndicesToRenderWithLines(parsedOBJ.indices);
  	//indexCountSolid = indicesSolid.length;
  	//indexCountWire = indicesWire.length;
  	//let positions = parsedOBJ.positions;

  	//let vertexAttributeInfoArray = [
  	//	new VertexAttributeInfo(positions, posLocation, 3)
  	//];
  	//vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);
  	//vaoWire = VAOHelper.create(indicesWire, vertexAttributeInfoArray);
  	//Ya tengo los buffers cargados en memoria de la placa grafica, puedo borrarlo de JS
  	//delete(parsedOBJ);

  	gl.enable(gl.DEPTH_TEST);
  	gl.clearColor(0.18, 0.18, 0.18, 1.0);
  	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  	axis = new Axis();
  	axis.load();
  	camera = new SphericalCamera(55, canvas.clientWidth/canvas.clientHeight);//use canvas dimensions
		onRender();
  }

		function onRender() {
			let viewMatrix = camera.getViewMatrix();
			let projMatrix = camera.getProjMatrix();
			let modelMatrix = mat4.create();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			axis.render(projMatrix, viewMatrix);

			gl.useProgram(shaderProgram);
			gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
			gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
			gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
			let _modelColor = vec3.fromValues(modelColor.r, modelColor.g, modelColor.b);
			gl.uniform3fv(u_modelColor, _modelColor);

			// Draw objects
			setObjectTransformations();
			drone.draw(isSolid, gl, _gl);
			mesa.draw(isSolid, gl, _gl);
	}
