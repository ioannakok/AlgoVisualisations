// Global variables
    var bars = [];
    var xCoords = [];
    var camera, renderer;
    var time = 3000;
    var delay = 2000;
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
            var bar = getBox(x, 0);
            var x1 = x + 3;

            x += dist;

            var x2 = x1 + 7;

            var line = getLine(x1, x2, 0);
            //dist += 3;
            bars.push(bar);
            xCoords.push(bar.position.x);
            scene.add(bar);
            scene.add(line);
        }
        
        console.log("Initial array: " + bars.length);

        // Insert element at the beginning of the linked list
        var box = getBox(-65, 10);
        scene.add(box);
        bars.unshift(box);
        xCoords.unshift(box.position.x);
        insert(box, -27, 0, -27, -17, 0, time, delay);
        
        console.log("Element added at the beginning of the list: " + bars.length);


        // Insert element at the end of the linked list
        var box1 = getBox(-65, 10);
        scene.add(box1);
        bars.push(box1);
        xCoords.push(-65);
        time = 3000;
        delay = 6000;
        insert(box1, 28, 0, 28, 35, 0, time, delay);


        console.log("Element added at the end of the list: " + bars.length);

        // Insert element at a specific index
        delay += 6000;

        // Traverse the list
        for(var i = 0; i < 3; i++) {
            time = 1000;
            changeColour(bars[i], time, delay, 0xff00ff);
            delay += time;
        }

        var box2 = getBox(-65, 10);
        scene.add(box2);
        time = 3000;
        
        // Bring the box into the scene
        insert(box2, 1, 5, 1, 7, 5, time, delay);

        bars.splice(3, 0, box2);
        xCoords.splice(3, 0, box2.position.x);



        console.log("Element added at a specifi index: " + bars.length);

        // Shift the rest of the boxes
        //for(var i = 4; i < bars.length; i++) {
          //  shift(bars[i], xCoords[i] , 0, xCoords[i] + 3, 0, time, delay);

        //}
        


        // Print for debugging
        bars.forEach(function(bar) {
            console.log(bar);
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

    // Swap elements
    function insert(element, x, y, lineX1, lineX2, lineY, time, delay) {

        var position = {x: -65, y: 10, rotation: 0};

        var tween = new TWEEN.Tween(position)
            .to({x: x, y: y, rotation: 0.1}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.position.x = this.x;
                element.position.y = this.y;
                element.rotation.z -= this.rotation;

                
                
            })
            
        var tween2 = new TWEEN.Tween({x: x, y: y, rotation: 0.1})
            .to({x: x, y: y, rotation: 0}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.rotation.z = this.rotation;
                var line = getLine(lineX1, lineX2, lineY);
                scene.add(line);
                
            })
           
        tween.chain(tween2);
        tween.start();    
  
    }

    // Shift elements
    function shift(element, x1, y1, x2, y2, time, delay) {

        var tween = new TWEEN.Tween({x: x1, y: y1})
            .to({x: x2, y: y2}, time)
            .delay(delay)
            .onUpdate(function() {
                element.position.x = this.x;
                element.position.y = this.y;
            })
            .easing(TWEEN.Easing.Quartic.In)
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


    
