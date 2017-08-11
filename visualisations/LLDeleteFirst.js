// Global variables
    var boxes = [];
    var xCoords = [];
    var lines = [];
    var linesX = [];
    var camera, renderer;
    var time = 3000;
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
        
        /* Remove element from the head of th list */

        // Rotate pointer
        var tween1 = new TWEEN.Tween({x: lines[0].geometry.vertices[1].x, y: lines[0].geometry.vertices[1].y})
            .to({x: lines[0].geometry.vertices[1].x - 2, y: lines[0].geometry.vertices[1].y + 2}, time)
            .onUpdate(function() {
                lines[0].geometry.vertices[1].x = this.x;
                lines[0].geometry.vertices[1].y = this.y;
                lines[0].geometry.verticesNeedUpdate = true; 
            })
            .start();

        delay += time * 2;

        // Send element and pointer out of scene
        var x2 = linesX[1] + 2;
        remove(boxes[0], xCoords[0], 0, lines[0], linesX[0], 0, x2, 0, time, delay);


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

    function remove(element, x, y, line, lineX1, lineY1, lineX2, lineY2, time, delay) {

         var tween = new TWEEN.Tween({x: x, y: y, rotation: 0})
            .to({x: -65, y: 10, rotation: 0.1}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.x = this.x;
                element.position.y = this.y;
                element.rotation.z += this.rotation;
            })
            .start();


        var tween2 = new TWEEN.Tween({x: lineX1, y: lineY1, rotation: 0.1})
            .to({x: -65, y: 10, rotation: 0.1}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                line.position.x = this.x;
                line.position.y = this.y;
                line.rotation.z += this.rotation;
            })
            .start();

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


    
