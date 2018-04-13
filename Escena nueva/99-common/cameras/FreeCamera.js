class FreeCamera extends Camera {

	constructor(fovy, aspect) {
		super(fovy, aspect);
		//Position of camera.
		this.position = vec3.fromValues(2, 0.5, 0);
		//Unit vector. Forward direction
		this.forward = vec3.fromValues(-1, 0, 0);
		//Unit vector. Right direction.
		this.right = vec3.fromValues(0, 0, -1);
		//Number. Delta for position movement.
		this.deltaPos = 0.1;
		//Number. Delta for rotations.
		this.deltaRot = glMatrix.toRadian(5);
	}

	getViewMatrix() {
		let eye = this.position;
		let up = this._up();
		let target = vec3.create();
		vec3.add(target, eye, this.forward);

		mat4.lookAt(this.viewMatrix, eye, target, up);
		return this.viewMatrix;
	}

	_deltaVec(unitDirection) {
		let deltaVec = vec3.create();
		vec3.scale(deltaVec, unitDirection, this.deltaPos);
		return deltaVec;
	}

	_up() {
		let up = vec3.create();
		vec3.cross(up, this.right, this.forward);
		return vec3.normalize(up, up);
	}

	moveForward() {
		let deltaVec = this._deltaVec(this.forward);
		vec3.add(this.position, this.position, deltaVec);
	}

	moveBackward() {
		let deltaVec = this._deltaVec(this.forward);
		vec3.sub(this.position, this.position, deltaVec);
	}

	moveLeft() {
		let deltaVec = this._deltaVec(this.right);
		vec3.sub(this.position, this.position, deltaVec);
	}

	moveRight() {
		let deltaVec = this._deltaVec(this.right);
		vec3.add(this.position, this.position, deltaVec);
	}
	moveUp() {
		let up = this._up();
		let deltaVec = this._deltaVec(up);
		vec3.add(this.position, this.position, deltaVec);
	}

	moveDown() {
		let up = this._up();
		let deltaVec = this._deltaVec(up);
		vec3.sub(this.position, this.position, deltaVec);
	}

	yawLeft() {
		this._yaw(this.deltaRot);
	}

	yawRight() {
		this._yaw(-1 * this.deltaRot);
	}

	pitchUp() {
		this._pitch(this.deltaRot);
	}

	pitchDown() {
		this._pitch(-1 * this.deltaRot);
	}

	rollLeft() {
		this._roll(-1 * this.deltaRot);
	}

	rollRight() {
		this._roll(this.deltaRot);
	}

	_toCartesianArray() {
		let _theta = glMatrix.toRadian(this.theta);
		let _phi = glMatrix.toRadian(this.phi);

		let x = this.r * Math.sin(_phi) * Math.cos(_theta);
		let z = this.r * Math.sin(_phi) * Math.sin(_theta);
		let y = this.r * Math.cos(_phi);
		return [x, y, z];
	}

	_yaw(angle) {
		/*let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this._up());

		vec3.transformMat4(this.forward, this.forward, rotationMatrix);
		vec3.transformMat4(this.right, this.right, rotationMatrix);*/

		let yRot = quat.create();
		quat.rotateY(yRot, yRot, angle);

		vec3.transformQuat(this.forward, this.forward, yRot);
		vec3.transformQuat(this.right, this.right, yRot);

		vec3.normalize(this.forward, this.forward);
		vec3.normalize(this.right, this.right);
	}

	_pitch(angle) {
		/*let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this.right);

		vec3.transformMat4(this.forward, this.forward, rotationMatrix);*/

		let zRot = quat.create();
		quat.rotateZ(zRot, zRot, angle);

		vec3.transformQuat(this.forward, this.forward, zRot);

		vec3.normalize(this.forward, this.forward);
	}

	_roll(angle) {
		/*let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this.forward);

		vec3.transformMat4(this.right, this.right, rotationMatrix);*/

		let xRot = quat.create();
		quat.rotateX(xRot, xRot, angle);

		vec3.transformQuat(this.right, this.right, xRot);

		vec3.normalize(this.right, this.right);
	}
}
