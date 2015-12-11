(function () {
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    var canvasWidth = $(window).width();
    var canvasHeight = $(window).height();

    /*global THREE, requestAnimationFrame, Detector, Stats, dat window document Coordinates*/
    var camera, scene, renderer;
    var clock = new THREE.Clock();
    var ambientLight, light;
    var meteors = [];
    var spaceShip;
    var xeon;

    var controller;


    function init() {
        var canvasRatio = canvasWidth / canvasHeight;
        // CAMERA

        camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 80000);
        camera.position.set(0, 10, 50);
        camera.lookAt(0, 0, 0);
        // LIGHTS

        ambientLight = new THREE.AmbientLight(0x111111);

        light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(-800, 900, 300);

        // RENDERER
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setClearColor(0x111111, 1.0);

        var container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

    }

    function fillScene() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x111111, 0.0005);
        scene.add(camera);

        // LIGHTS
        scene.add(ambientLight);
        scene.add(light);

        var meteorAmount = 75;
        for (var i = 0; i < meteorAmount; i++) {
            var meteor = Meteor.CreateRandom(70, 0.7, 1.3);

            var rndXPosition = Math.random() * 1000 - 500;
            var rndYPosition = Math.random() * 500 - 250;
            var rndZPosition = -Math.floor(Math.random() * (6000 - 3000)) - 3000;
            meteor.translateZ(rndZPosition);
            meteor.translateX(rndXPosition);
            meteor.translateY(rndYPosition);

            meteors[i] = meteor;
            scene.add(meteors[i]);
        }

        spaceShip = new SpaceShip();
        scene.add(spaceShip);
        controller = new THREE.SpaceController(spaceShip);

        xeon = new Xeon();
        xeon.translateZ(-500);
        scene.add(xeon);
    }

    function updateMeteors() {
        for (var i = 0; i < meteors.length; i++) {
            var meteor = meteors[i];
            if (meteor.position.z > spaceShip.position.z) {
                var rndZPosition = -Math.floor(Math.random() * (6000 - 3000)) - 3000;
                meteor.translateZ(rndZPosition);
            }
        }
    }

    function addToDOM() {
        var container = document.getElementById('container');
        var canvas = container.getElementsByTagName('canvas');
        if (canvas.length > 0) {
            container.removeChild(canvas[0]);
        }
        container.appendChild(renderer.domElement);
    }

    function animate() {

        window.requestAnimationFrame(animate);
        render();

    }

    function render() {
        var delta = clock.getDelta();

        if (fixedUpdateTrigger + delta > 0.5) {
            fixedUpdateTrigger = fixedUpdateTrigger + delta - 1;
            fixedUpdate();
        }
        else {
            fixedUpdateTrigger += delta;
        }

        updateMeteors(delta);
        controller.update(delta);
        spaceShip.update(meteors, delta);

        camera.position.x = spaceShip.position.x;
        camera.position.y = spaceShip.position.y + 10;
        camera.position.z = spaceShip.position.z + 50;

        camera.lookAt(spaceShip.position);

        xeon.update(delta);

        renderer.render(scene, camera);
    }

    var fixedUpdateTrigger = 0;

    function fixedUpdate() {

    }

    try {
        init();
        fillScene();
        addToDOM();
        animate();
    } catch (e) {
        console.error(e);
    }
})();