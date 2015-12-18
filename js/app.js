var game = {};
game.debbug = false;

(function () {
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    var canvasWidth = $(window).width();
    var canvasHeight = $(window).height();

    /*global THREE, requestAnimationFrame, Detector, Stats, dat window document Coordinates*/
    var camera, scene, renderer;
    var clock = new THREE.Clock();
    var ambientLight, light;
    var asteroids = [];
    var spaceShip;
    var xeon;

    var controller;


    function init() {
        var canvasRatio = canvasWidth / canvasHeight;
        // CAMERA

        camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 5000);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 0);
        // LIGHTS

        ambientLight = new THREE.AmbientLight(0x111111);

        light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(-800, 900, 300);

        // RENDERER
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setClearColor(0x000000, 1.0);

        var container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        game.mainCamera = camera;
    }

    function fillScene() {
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 5000);
        scene.add(camera);

        // LIGHTS
        scene.add(ambientLight);
        scene.add(light);

        var asteroidAmount = 700;
        for (var i = 0; i < asteroidAmount; i++) {
            var asteroid = Asteroid.CreateRandom(200, 0.7, 1.3);

            var rndXPosition = Math.random() * 6000 - 3000;
            var rndYPosition = Math.random() * 6000 - 3000;
            var rndZPosition = Math.random() * 6000;
            asteroid.translateZ(rndZPosition);
            asteroid.translateX(rndXPosition);
            asteroid.translateY(rndYPosition);

            asteroids[i] = asteroid;
            scene.add(asteroids[i]);
        }

        spaceShip = new SpaceShip();
        scene.add(spaceShip);
        controller = new THREE.SpaceController(spaceShip);

        xeon = new Xeon();
        xeon.translateZ(-500);
        scene.add(xeon);
    }

    function updateAsteroids(delta) {
        for (var i = 0; i < asteroids.length; i++) {
            var asteroid = asteroids[i];
            asteroid.update(spaceShip, delta);
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

    function updateCamera(delta) {
        camera.position.x = spaceShip.position.x;
        camera.position.y = spaceShip.position.y + 10;
        camera.position.z = spaceShip.position.z + 100;

        camera.lookAt(spaceShip.position);
    }

    function render() {
        var delta = clock.getDelta();

        updateAsteroids(delta);
        controller.update(delta);
        spaceShip.__dirtyRotation = true;
        spaceShip.__dirtyPosition = true;

        spaceShip.update(delta);

        updateCamera(delta);

        xeon.update(spaceShip, delta);

        spaceShip.detectCollision(asteroids);
        renderer.render(scene, camera);
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