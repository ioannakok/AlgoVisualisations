// Global variables
    var boxes = [];
    var xCoords = [];
    var lines = [];
    var linesX = [];
    var camera, renderer;
    var time = 2000;
    var delay = 0;
    var scene;

    // once everything is loaded, we run our Three.js stuff.
    function init() {

        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // position and point the camera to the center of the scene
        camera.position.x = 0;
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
        var dist = 9;
        var x = -20;
        
        // Create 20 bars

        
        for(var i = 0; i < 5; i++) {
            var box = getBox(x, 0);
            var x1 = x + 3;

            x += dist;

            var x2 = x1 + 7;

            var line = getLine(x1, x2, 0);
            //dist += 3;
            boxes.push(box);
            xCoords.push(box.position.x);
            lines.push(line);
            linesX.push(x1, x2);
            scene.add(box);
            scene.add(line);
        }
        
        for(var i = 0; i < 3; i++) {
            changeColour(boxes[i], time, delay, 0xff00ff);
            delay += time;

            if(i < 2) {
                changeColour(boxes[i], time, delay, 0x0000ff);
                delay += time;    
            } else {
                moveZ(boxes[i], 0, time, delay);
                delay = delay + time * 2;  
                changeColour(boxes[i], time, delay, 0x0000ff);
                
            }
        }

        


        // Print for debugging
        boxes.forEach(function(box) {
            console.log(box);
        }) 

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
            .onUpdate(function() {
                element.material.color.setHex(hex);
            })
            .start();
    }

    function moveZ(element, z, time, delay) {
         var tween = new TWEEN.Tween({z: z})
            .to({z: 15}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.z = this.z;
            })
        
        var tweenBack = new TWEEN.Tween({z: 15})
            .to({z: 0}, time)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.z = this.z;
            })

        tween.chain(tweenBack);
        tween.start();
    }

    // Create one bar
    function getBox(x, y) {

        var geometry = new THREE.BoxGeometry(5, 3, 2);
        var material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        var cube = new THREE.Mesh(geometry, material);

            cube.position.x = x + 2 + 1;
            cube.position.y = y;
            cube.position.z = 0;

        return cube;    
    }


    // Create the pointer
    function getLine(x1, x2, y) {

        var material = new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 3});

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( x1, y, 0 ),
            new THREE.Vector3( x2, y, 0 )
                 
        );

        var line = new THREE.Line( geometry, material );
        
        return line;
    }


    window.onload = init;

    // listen to the resize events
    window.addEventListener('resize', onResize, false);


    
