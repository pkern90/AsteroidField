var Asteroid = function (radius) {
    THREE.Object3D.call(this);
    createAsteroidMesh(this);
    //public
    this.movementSpeed = Math.random() * 1000;
    this.rotationSpeed = Math.random() * 45;

    //internal
    function createAsteroidMesh(object) {
        var material = new THREE.MeshPhongMaterial({
            color: 0x663333,
            specular: 0xbb3355,
            shininess: 10,
            shading: THREE.FlatShading
        });

        var geometry = new THREE.DodecahedronGeometry(radius, 0);
        geometry.computeBoundingSphere ();
        var asteroidMesh = new THREE.Mesh(geometry, material);


        object.add(asteroidMesh);

        //For debbuging draw boundingboxes
        if (game.debbug) {
            var bbox = new THREE.BoundingBoxHelper(asteroidMesh, 0xff0000);
            bbox.update();
            object.add(bbox);
        }
    }
};

Asteroid.prototype = Object.create(THREE.Object3D.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function (spaceShip, delta) {

    moveAsteroid(this);
    var maxDist = 6000.0;


    var distToSpaceShip = this.position.distanceTo (spaceShip.position);
    if (distToSpaceShip > maxDist) {
        replaceAsteroid(this);
    }

    function moveAsteroid(object) {
        object.translateZ(object.movementSpeed * delta);
        object.rotation.z += object.rotationSpeed * delta * Math.PI / 180;
    }

    function replaceAsteroid(object) {
        var spaceShipAsteroidVector = (new THREE.Vector3()).subVectors(spaceShip.position, object.position);

        var newAsteroidPosition = (new THREE.Vector3()).addVectors(spaceShipAsteroidVector, spaceShip.position);
        object.position.set(newAsteroidPosition.x, newAsteroidPosition.y, newAsteroidPosition.z);
    }
};

//factory for creating random asteroids.
Asteroid.CreateRandom = function (radius, minScale, maxScale) {
    var rndRadius = Math.random() * radius;
    var asteroid = new Asteroid(rndRadius);

    for (var i = 0; i < asteroid.children.length; i++) {
        var child = asteroid.children[i];

        var scaleFactor = Math.random() * (maxScale - minScale) + minScale;
        child.scale.x = scaleFactor;
        child.scale.y = scaleFactor;
        child.scale.z = scaleFactor;

        child.geometry.computeBoundingSphere ();
    }


    return asteroid;
};