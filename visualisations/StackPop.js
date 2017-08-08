// Global variables
    var bars = [];
    var camera, renderer;
    var time = 2000;
    var delay = 3000;
    var scene;

    // once everything is loaded, we run our Three.js stuff.
    function init() {

        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // position and point the camera to the center of the scene
        camera.position.x = -25;
        camera.position.y = 0;
        camera.position.z = 50;
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

        // Display the bars
        var dist = 3;
        var y = -16;
        
        // Create 8 elements that are in the stack
        for(var i = 0; i < 8; i++) {

            var colour;

            switch(i) {
                case 0: 
                    colour = 0x0000ff;
                    break;
                case 1:
                    colour = 0xff0000;
                    break;
                case 2:
                    colour = 0x00ff00;
                    break;
                case 3:
                    colour = 0xff00ff;
                    break;
                case 4:
                    colour = 0xffff00;
                    break;
                case 5: 
                    colour = 0x00ffff;
                    break;
                case 6: 
                    colour = 0xff8000;
                    break;
                case 7:
                    colour = 0x00ff80;
                    break;
            } 

            var bar = getBox(0, y, 0, colour);
            scene.add(bar);
            bars.push(bar);
            y += dist;
        }

        // Pops an element out of the stack
        pop(bars[bars.length - 1], bars[bars.length - 1].position.y, time, delay);

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

    
    // Push an element into the stack
    function pop(element, y, time, delay) {

        // Pops the element out of the stack
        var tween1 = new TWEEN.Tween({y: y})
            .to({y: 16}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.y = this.y;
            })
        
        // Rotate the element
        var tween2 = new TWEEN.Tween({rotation: 0})
            .to({rotation: 0.1}, time)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.rotation.z += this.rotation;
            })

        // Send the element out of scene
        var tween3 = new TWEEN.Tween({x: 0, y: 16})
            .to({x: -65, y: -10}, time)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.x = this.x;
                element.position.y = this.y;
            })
        
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween1.start(); 
    }

    // Create one bar
    function getBox(x, y, z, colour) {

        var geometry = new THREE.BoxGeometry(15, 3, 2);
        var material = new THREE.MeshPhongMaterial({color: colour});
        var cube = new THREE.Mesh(geometry, material);

            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;

        return cube;    
    }

    window.onload = init;

    // listen to the resize events
    window.addEventListener('resize', onResize, false);


    
