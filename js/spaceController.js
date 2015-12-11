THREE.SpaceController = function (object) {
    this.object = object;

    // API

    this.movementSpeed = 1000.0;
    this.rollSpeed = 1;
    this.movementSpeedMultiplier = 1;

    // internals

    this.tmpQuaternion = new THREE.Quaternion();

    this.moveState = {pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0};
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);

    this.keyDown = function (event) {

        if (event.altKey) {

            return;

        }

        switch (event.keyCode) {

            case 16: /* shift */
                this.movementSpeedMultiplier = .3;
                break;

            case 87: /*W*/
                this.moveState.pitchDown = 1;
                break;
            case 83: /*S*/
                this.moveState.pitchUp = 1;
                break;

            case 65: /*A*/
                this.moveState.rollLeft = 1;
                break;
            case 68: /*D*/
                this.moveState.rollRight = 1;
                break;

            case 81: /*Q*/
                this.moveState.yawLeft = 1;
                break;
            case 69: /*E*/
                this.moveState.yawRight = 1;
                break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.keyUp = function (event) {

        switch (event.keyCode) {

            case 16: /* shift */
                this.movementSpeedMultiplier = 1;
                break;

            case 87: /*W*/
                this.moveState.pitchDown = 0;
                break;
            case 83: /*S*/
                this.moveState.pitchUp = 0;
                break;

            case 65: /*A*/
                this.moveState.rollLeft = 0;
                break;
            case 68: /*D*/
                this.moveState.rollRight = 0;
                break;

            case 81: /*Q*/
                this.moveState.yawLeft = 0;
                break;
            case 69: /*E*/
                this.moveState.yawRight = 0;
                break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.update = function (delta) {

        var moveMult = delta * this.movementSpeed * this.movementSpeedMultiplier;
        var rotMult = delta * this.rollSpeed * this.movementSpeedMultiplier;

        this.object.translateX(this.moveVector.x * moveMult);
        this.object.translateY(this.moveVector.y * moveMult);
        this.object.translateZ(this.moveVector.z * moveMult);

        this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion(this.object.quaternion, this.object.rotation.order);


    };

    this.updateMovementVector = function () {

        this.moveVector.z = ( -1 );

    };

    this.updateRotationVector = function () {

        this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
        this.rotationVector.y = ( -this.moveState.yawRight + this.moveState.yawLeft );
        this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

    };

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    }

    this.dispose = function () {
        window.removeEventListener('keydown', _keyDown, false);
        window.removeEventListener('keyup', _keyUp, false);

    };

    var _keyDown = bind(this, this.keyDown);
    var _keyUp = bind(this, this.keyUp);

    window.addEventListener('keydown', _keyDown, false);
    window.addEventListener('keyup', _keyUp, false);

    this.updateMovementVector();
    this.updateRotationVector();
};