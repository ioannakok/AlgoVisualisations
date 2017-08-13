


// Global variables
    var nodes = [];
    var xCoords = [];
    var yCoords = [];
    var radii = [];
    var colours = [];
    var time = 1000;
    var delay = 2000;

    var animation = true;
    var camera, renderer, scene;

    // once everything is loaded, we run our Three.js stuff.
    function init() {

        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 2;
        camera.position.z = 80;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x323232);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, 40, 60);

        scene.add(spotLight);

        // create a render and set the size
        renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0x000000, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // add the output of the renderer to the html element
        document.getElementById("WebGL").appendChild(renderer.domElement);

        // Create the tree
        var tree = new Tree();

        tree.create(2.5);
        tree.create(3.5);
        tree.create(4);
        tree.create(3);
        tree.create(4.5);
        tree.create(3.7);
        tree.create(3.2);
        tree.create(2.7);
        tree.create(1.5);
        tree.create(2);
        tree.create(2.2);
        tree.create(1.8);
        tree.create(1.2);
        tree.create(0.8);
        tree.create(1.4);

        // Pre order traversal
        tree.preOrder();

        console.log(tree);  
    
        // Call the render function
        render();

        function render() {

            stats.update();  

            TWEEN.update();
            
            requestAnimationFrame( render );
            renderer.render(scene,camera);
        }


        function initStats() {

            var stats = new Stats();

            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.getElementById("Stats").appendChild(stats.domElement);

            return stats;
        }
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Change colour to show comparison
    function changeColour(element, time, delay, hex) {

        var tween = new TWEEN.Tween(element.material.color)
            .to({hex: hex}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Quartic.In)
            .onUpdate(function() {
                element.material.color.setHex(hex);
            })
            .start();
    }


    function getCylinder(height, x, y, rot) {

        var material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        var geometry = new THREE.CylinderGeometry(0.3, 0.3, height);
        
        var cylinder = new THREE.Mesh( geometry, material );

        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.rotation.z = rot;
        
        scene.add(cylinder);
    }


    window.onload = init;

    // listen to the resize events
    window.addEventListener('resize', onResize, false);