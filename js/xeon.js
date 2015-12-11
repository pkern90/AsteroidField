var Xeon = function () {
    THREE.Object3D.call(this);
    this.add(createXeonObject());
    //public

    //internal
    function createXeonObject() {
        var material = new THREE.MeshPhongMaterial({
            color: 0xff9900,
            specular: 0x0000ff,
            shininess: 100,
            shading: THREE.FlatShading,
            emissive: 0xbe9448,
            transparent: true,
            opacity: 0.8
        });

        var geometry = new THREE.TorusKnotGeometry(10, 4, 20, 4);
        geometry.scale(0.3, 0.3, 0.3)
        var xeonObject = new THREE.Mesh(geometry, material);

        return xeonObject;
    }
};

Xeon.prototype = Object.create(THREE.Object3D.prototype);
Xeon.prototype.constructor = Xeon;

Xeon.prototype.update = function (delta) {
    var movementSpeed = 1000.00;
    var rotationSpeed = 100 * Math.PI / 180;

    this.position.z -= movementSpeed * delta;

    this.rotation.x += rotationSpeed * delta;
    this.rotation.z += rotationSpeed * delta;
    this.rotation.y += rotationSpeed * delta;

};