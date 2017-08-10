// Global variables
    var bars = [];
    var xCoords = [];
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
        
        // Create 5 boxes
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
        

        // Insert element at the beginning of the linked list
        var box = getBox(-65, 10);
        scene.add(box);
        bars.unshift(box);
        xCoords.unshift(box.position.x);
        insert(box, -27, 0, -27, -17, 0, time, delay);
        
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


    // Insert element
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


    
