var SpaceShip = function () {
    THREE.Object3D.call(this);
    this.add(createSpaceShipObject());
    //public

    //internal
    function createSpaceShipObject() {
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

        //ship
        var ship = new THREE.Object3D();
        ship.add(wings);
        ship.add(body);
        ship.add(lThruster);
        ship.add(rThruster);

        return ship;
    }
};

SpaceShip.prototype = Object.create(THREE.Object3D.prototype);
SpaceShip.prototype.constructor = SpaceShip;