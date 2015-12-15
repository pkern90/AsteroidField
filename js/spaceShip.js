var SpaceShip = function () {
    THREE.Object3D.call(this);

    //public
    this.alive = true;
    this.colliders = [];

    //init
    createSpaceShipObject(this);
    createCollider(this);

    //internal
    function createSpaceShipObject(object) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x6666ff,
            shininess: 100,
            shading: THREE.FlatShading
        });

        //wings
        var geometry = new THREE.IcosahedronGeometry(20, 0);
        var wings = new THREE.Mesh(geometry, material);

        wings.scale.x = 0.8;
        wings.scale.y = 0.1;
        wings.scale.z = 0.25;


        //body
        geometry = new THREE.IcosahedronGeometry(20, 0);
        var body = new THREE.Mesh(geometry, material);

        body.scale.x = 0.3;
        body.scale.y = 0.2;
        body.scale.z = 0.5;

        body.translateZ(-3);
        body.translateY(1);

        //thrusters
        geometry = new THREE.CylinderGeometry(1, .7, 4, 16);
        geometry.rotateX(90 * Math.PI / 180);

        material = new THREE.MeshPhongMaterial({
            color: 0x555555,
            specular: 0x6666ff,
            shininess: 100,
            shading: THREE.FlatShading
        });
        var lThruster = new THREE.Mesh(geometry, material);
        var rThruster = new THREE.Mesh(geometry, material);

        lThruster.translateX(-7);
        lThruster.translateY(.8);
        lThruster.translateZ(3);

        rThruster.translateX(7);
        rThruster.translateY(.8);
        rThruster.translateZ(3);

        object.add(wings);
        object.add(body);
        object.add(lThruster);
        object.add(rThruster);
    }

    function createCollider(object) {
        //collision box
        var material = new THREE.MeshPhongMaterial({
            wireframe: true,
            transparent: true,
            opacity: 0
        });
        var geometry = new THREE.BoxGeometry(26, 4, 8);
        var collisionBox = new THREE.Mesh(geometry, material);

        object.add(collisionBox);
        object.colliders.push(collisionBox);
    }
};

SpaceShip.prototype = Object.create(THREE.Object3D.prototype);
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.update = function (collidableObjectList, delta) {

    if (this.alive) {
        detectCollision(this);
    }
    else {
        explode(this);
    }

    function detectCollision(object) {
        var collidableMeshList = [];
        for (var meshIndex = 0; meshIndex < collidableObjectList.length; meshIndex++) {
            collidableMeshList[meshIndex] = collidableObjectList[meshIndex].children[0];
        }

        for (var colliderIndex = 0; colliderIndex < object.colliders.length; colliderIndex++) {
            var collider = object.colliders[0];

            for (var vertexIndex = 0; vertexIndex < collider.geometry.vertices.length; vertexIndex++) {
                var localVertex = collider.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4(collider.matrixWorld);
                var directionVector = globalVertex.sub(collider.position);

                var ray = new THREE.Raycaster(collider.position, directionVector.clone().normalize());
                var collisionResults = ray.intersectObjects(collidableMeshList);

                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    object.alive = false;
                    return;
                }
            }
        }
    }

    function explode(object) {
        var movementSpeed = 20.00;
        var rotationSpeed = 100 * Math.PI / 180;

        for (var meshIndex = 0; meshIndex < object.children.length; meshIndex++) {
            var mesh = object.children[meshIndex];

            if (!mesh.explodingDirection) {
                mesh.explodingDirection = new THREE.Vector3(
                    Math.round(Math.random()),
                    Math.round(Math.random()),
                    Math.round(Math.random()));
            }


            var explosionVector = mesh.explodingDirection.clone().multiplyScalar (movementSpeed * delta);
            mesh.translateX(explosionVector.x);
            mesh.translateY(explosionVector.y);
            mesh.translateZ(explosionVector.z);

            mesh.rotation.x += rotationSpeed * delta;
            mesh.rotation.z += rotationSpeed * delta;
            mesh.rotation.y += rotationSpeed * delta;
        }
    }
};