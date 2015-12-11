var Meteor = function (radius, type) {
    THREE.Object3D.call(this);
    this.add(createMeteorMesh(radius));
    //public


    //internal
    function createMeteorMesh() {
        var material = new THREE.MeshPhongMaterial({
            color: 0x663333,
            specular: 0xbb3355,
            shininess: 10,
            shading: THREE.FlatShading
        });

        var geometry;

        if (type === 0) {
            geometry = new THREE.DodecahedronGeometry(radius, 0);
        }
        else if (type === 1) {
            geometry = new THREE.IcosahedronGeometry(radius, 0);
        }
        else if (type === 2) {
            geometry = new THREE.OctahedronGeometry(radius, 0);
        }
        else {
            console.error("Unknown meteor type. Not able to create the meteor.");
            return new THREE.Object3D();
        }

        var meteorMesh = new THREE.Mesh(geometry, material);

        return meteorMesh;
    }
};

Meteor.prototype = Object.create(THREE.Object3D.prototype);
Meteor.prototype.constructor = Meteor;

//factory for creating random meteors.
Meteor.CreateRandom = function (radius, minScale, maxScale) {
    var rndType = Math.floor(Math.random() * 3);
    var rndRadius = Math.random() * radius;
    var meteor = new Meteor(rndRadius, rndType);

    for (var i = 0; i < meteor.children.length; i++) {
        var child = meteor.children[i];

        child.rotation.x = Math.floor(Math.random() * 360) * Math.PI / 180;
        child.rotation.y = Math.floor(Math.random() * 360) * Math.PI / 180;
        child.rotation.z = Math.floor(Math.random() * 360) * Math.PI / 180;

        child.scale.x = Math.random() * (maxScale - minScale) + minScale;
        child.scale.y = Math.random() * (maxScale - minScale) + minScale;
        child.scale.z = Math.random() * (maxScale - minScale) + minScale;
    }

    return meteor;
}