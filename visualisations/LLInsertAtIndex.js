/* NEEDS A LOT OF CLEAN UP!!!*/


// Global variables
    var bars = [];
    var lines = [];
    var xCoords = [];
    var camera, renderer;
    var time = 2000;
    var delay = 0;
    var scene;
    var pointer;

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

        /* Display the boxes */
        var dist = 9;
        var x = -20;
        
        // Create 5 boxes and pointers
        for(var i = 0; i < 5; i++) {
            var bar = getBox(x, 0);
            var x1 = x + 5;
            x += dist;
            var x2 = x1 + 5;

            var line = getLine(x1, x2, 0);
            
            bars.push(bar);
            xCoords.push(bar.position.x);
            lines.push(line);
            scene.add(bar);
            scene.add(line);
        }
        


        /* Insert element at a specific index */
        
        // Traverse the list
        for(var i = 0; i < 3; i++) {
            changeColour(bars[i], time, delay, 0xff0000);
            delay += time;
        }

        // Create element to be inserted
        var box = getBox(-65, 10);
        scene.add(box);

        // Create pointer of the element
        pointer = getLine(1, 1, 5, 0);
        
        
        // Bring the box into the scene
        var position = {x: -65, y: 10, rotation: 0};

        var tween = new TWEEN.Tween(position)
            .to({x: 1, y: 7, rotation: 0.1}, time)
            .delay(delay)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                box.position.x = this.x;
                box.position.y = this.y;
                box.rotation.z -= this.rotation;   
            })
        
        // Rotate the box and create the pointer
        var tween2 = new TWEEN.Tween({rotation: 0.1})
            .to({rotation: -1.55}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                box.rotation.z = this.rotation;  
            })
            .onComplete(function() {
                
                // Add the pointer in the scene
                scene.add(pointer);
                  
            })
           
        tween.chain(tween2);
        tween.start();   


        delay += time * 2;


        // Shift new element and pointer
        var tween3 = new TWEEN.Tween({x: 1})
            .to({x: 16}, time)
            .delay(delay)
            .onUpdate(function() {

                // Shift new element
                box.position.x = this.x;
            })
            .onStart(function() {
                new TWEEN.Tween({x1: pointer.geometry.vertices[0].x, x2: pointer.geometry.vertices[1].x})
                    .to({x1: pointer.geometry.vertices[0].x + 15, x2: pointer.geometry.vertices[1].x + 15}, time)
                    .onUpdate(function() {
                        
                        // Shift pointer
                        pointer.geometry.vertices[0].x = this.x1;
                        pointer.geometry.vertices[1].x = this.x2;
                        pointer.geometry.verticesNeedUpdate = true;
                    })
                    .start();
            })
            .start();

        // Shift the next elements and pointers    
        for(var i = 2; i < bars.length; i++) {
            
            shift(bars[i], xCoords[i], 0, 15, time, delay);
            xCoords[i] += 15;
            shiftPointers(lines[i], 15, time, delay);
        }

        delay += time;

        // Rotate new element and pointer
        var tween4 = new TWEEN.Tween({x: 15, y: 7, rotation: -1.55})
            .to({x: 7, y: 0, rotation: 0}, time - 1000)
            .delay(delay)
            .onUpdate(function() {

                // Rotate element
                box.position.x = this.x;
                box.position.y = this.y;
                box.rotation.z = this.rotation;
            })
            .onStart(function() {
                new TWEEN.Tween({x1: pointer.geometry.vertices[0].x, y1: pointer.geometry.vertices[0].y, 
                    x2: pointer.geometry.vertices[1].x , y2: pointer.geometry.vertices[1].y}, time)
                    .to({x1: 9, x2: 14, y1: 0, y2: 0})
                    .onUpdate(function() {
                        
                        console.log("0x: " + pointer.geometry.vertices[0].x);
                        console.log("1x: " + pointer.geometry.vertices[1].x);

                        // Rotate pointer
                        pointer.geometry.vertices[0].x = this.x1;
                        pointer.geometry.vertices[1].x = this.x2;
                        pointer.geometry.vertices[0].y = this.y1;
                        pointer.geometry.vertices[1].y = this.y2;
                        pointer.geometry.verticesNeedUpdate = true;
                    })
                    .start();
            })
            .start();

         delay += time   

        // Grow previous pointer
        var tween5 = new TWEEN.Tween({x: lines[1].geometry.vertices[1].x})
            .to({x: 7}, time)
            .delay(delay)
            .onUpdate(function() {
                
                lines[1].geometry.vertices[1].x = this.x;
                lines[1].geometry.verticesNeedUpdate = true;
            })
            .start();


        delay += time;

        
        // Shift all elements back
        var tween6 = new TWEEN.Tween({x: 7})
            .to({x: -1}, time)
            .delay(delay)
            .onUpdate(function() {

                // Make previous pointer smaller
                lines[1].geometry.vertices[1].x = this.x;
                lines[1].geometry.verticesNeedUpdate = true;
            })
            .start();  

         // Shift new element, next elements and all pointers back    
        shift(box, 7, 0, -6, time, delay); 
        shiftPointer(pointer, 9, 14, -6, time, delay);

        for(var i = 2; i < bars.length; i++) {
            shift(bars[i], xCoords[i], 0, -6, time, delay);
            var x1 = lines[i].geometry.vertices[0].x + 15;
            var x2 = lines[i].geometry.vertices[1].x + 15;

            shiftPointer(lines[i], x1, x2, -6, time, delay);            
        }
        
        delay += time;

        // Change colour back to blue
        changeColour(bars[0], time, delay, 0x0000ff);
        changeColour(bars[1], time, delay, 0x0000ff);
        changeColour(bars[2], time, delay, 0x0000ff);

        // Print for debugging
        bars.forEach(function(bar) {
            console.log(bar);
        }) 

        
        lines.forEach(function(line) {
            console.log(line);
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

    // Insert element
    function insert(element, x, y, lineX1, lineX2, lineY1, lineY2, time, delay) {

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
            .to({x: x, y: y, rotation: -1.55}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function() {
                element.rotation.z = this.rotation;  
            })
            .onComplete(function() {
                var line = getLine(lineX1, lineX2, lineY1, lineY2);
                scene.add(line);
                lines.push(line);   
            })
           
        tween.chain(tween2);
        tween.start();    
    }



    // Shift elements
    function shift(element, x, y, inc, time, delay) {

        var tween = new TWEEN.Tween({x: x, y: y})
            .to({x: x + inc, y: y}, time)
            .delay(delay)
            .onUpdate(function() {
                element.position.x = this.x;
                element.position.y = this.y;
            })
            .start(); 
    }

    
    function shiftPointers(line, inc, time, delay) {

        var tween = new TWEEN.Tween({x1: line.geometry.vertices[0].x, x2: line.geometry.vertices[1].x})
            .to({x1: line.geometry.vertices[0].x + inc, x2: line.geometry.vertices[1].x + inc}, time)
            .delay(delay )
            .onUpdate(function() {
                line.geometry.vertices[0].x = this.x1;
                line.geometry.vertices[1].x = this.x2;
                line.geometry.verticesNeedUpdate = true;
            })
            .start();
    }


    function shiftPointer(line, x1, x2, inc, time, delay) {

        var tween = new TWEEN.Tween({x1: x1, x2: x2})
            .to({x1: x1 + inc, x2: x2 + inc}, time)
            .delay(delay )
            .onUpdate(function() {
                line.geometry.vertices[0].x = this.x1;
                line.geometry.vertices[1].x = this.x2;
                line.geometry.verticesNeedUpdate = true;
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
    function getLine(x1, x2, y1, y2) {

        var material = new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 3});

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( x1, y1, 0 ),
            new THREE.Vector3( x2, y2, 0 )
                 
        );

        var line = new THREE.Line( geometry, material );
        
        return line;
    }


    window.onload = init;

    // listen to the resize events
    window.addEventListener('resize', onResize, false);


    
