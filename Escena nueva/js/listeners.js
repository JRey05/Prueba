function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.setFovy(fovy);
	writeValue(labelId, fovy);
	onRender();
}

function onColorModel(picker, labelId) {
	modelColor = Utils.hexToRgbFloat(picker.value);
	writeValue(labelId, picker.value);
	onRender();
}

function onCheckboxSolid(checkbox) {
	isSolid = !isSolid;
	onRender();
}

function onCheckboxCamera(checkbox) {
	if (free) {
		camera = new FreeCamera(55, 800/600);
	} else {
		camera = new SphericalCamera(55, 800/600);
	}
	free = !free;
}

function writeValue(labelId, value) {
	if (labelId) {
		document.getElementById(labelId).innerText = value;
	}
}

function onSliderRotation(slider, labelId) {
	angle = parseFloat(slider.value);
	writeValue(labelId, angle);
	onRender();
}

function onSliderTheta(slider, labelId) {
	let theta = parseFloat(slider.value);
	camera.setTheta(theta);
	writeValue(labelId, theta);
	onRender();
}

function onSliderPhi(slider, labelId) {
	let phi = parseFloat(slider.value);
	camera.setPhi(phi);
	writeValue(labelId, phi);
	onRender();
}

var radius_step = 0.5;
function increaseRadius() {
	let radius = camera.getRadius();
	radius = radius + radius_step;
	if (radius <= 10.0) {
		camera.setRadius(radius);

		//writeValue('lblRadius', radius);
	}
}

function decreaseRadius() {
	let radius = camera.getRadius();
	radius = radius - radius_step;
	if (radius > 0.0) {
		camera.setRadius(radius);

		//writeValue('lblRadius', radius);
	}
}

/*
// Key Listeners
// *************
var radius_step = 0.5;
var theta_step = 5.0;
var phi_step = 5.0;

function increaseRadius() {
	let radius = camera.getRadius();
	radius = radius + radius_step;
	if (radius <= 10.0) {
		camera.setRadius(radius);

		writeValue('lblRadius', radius);
	}
}

function decreaseRadius() {
	let radius = camera.getRadius();
	radius = radius - radius_step;
	if (radius > 0.0) {
		camera.setRadius(radius);

		writeValue('lblRadius', radius);
	}
}

function increaseTheta() {
	let theta = camera.getTheta();
	theta = theta + theta_step;
	if (theta <= 360.0) {
		camera.setTheta(theta);

		writeValue('lblTheta', theta);
	}
}

function decreaseTheta() {
	let theta = camera.getTheta();
	theta = theta - theta_step;
	if (theta > 0.0) {
		camera.setTheta(theta);

		writeValue('lblTheta', theta);
	}
}

function increasePhi() {
	let phi = camera.getPhi();
	phi = phi + phi_step;
	if (phi <= 179.0) {
		camera.setPhi(phi);

		writeValue('lblPhi', phi);
	}
}

function decreasePhi() {
	let phi = camera.getPhi();
	phi = phi - phi_step;
	if (phi > 0.0) {
		camera.setPhi(phi);

		writeValue('lblPhi', phi);
	}
}
*/
function onKeyDown(evt) {
	switch(evt.code) {
		case "NumpadAdd":
			increaseRadius();
			break;
		case "NumpadSubtract":
			decreaseRadius();
			break;
		case "KeyW":
			camera.moveForward();
			break;
		case "KeyS":
			camera.moveBackward();
			break;
		case "KeyA":
			camera.moveLeft();
			break;
		case "KeyD":
			camera.moveRight();
			break;
		case "KeyQ":
			camera.moveDown();
			break;
		case "KeyE":
			camera.moveUp();
			break;
		case "KeyJ":
			camera.yawLeft();
			break;
		case "KeyL":
			camera.yawRight();
			break;
		case "KeyI":
			camera.pitchUp();
			break;
		case "KeyK":
			camera.pitchDown();
			break;
		case "KeyU":
			camera.rollLeft();
			break;
		case "KeyO":
			camera.rollRight();
			break;
		/*
		case "NumpadAdd":
			increaseRadius();
			break;
		case "NumpadSubtract":
			decreaseRadius();
			break;
		case "KeyD":
			increaseTheta();
			break;
		case "KeyA":
			decreaseTheta();
			break;
		case "KeyW":
			increasePhi();
			break;
		case "KeyS":
			decreasePhi();
			break;*/
	}
	onRender();
}
