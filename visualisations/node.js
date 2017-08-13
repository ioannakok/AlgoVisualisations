var Node = function() {

    // Run the Mesh constructor with the given arguments
    THREE.Mesh.apply(this, arguments);

    this.left  = null;
    this.right = null;
    this.par = null;
    this.depth = undefined;
    this.height = undefined;
};

// Make Node have the same methods as Mesh
Node.prototype = Object.create(THREE.Mesh.prototype);

// Make sure the right constructor gets called
Node.prototype.constructor = Node;



Node.prototype.createNode = function(n) {

    // If the node to be inserted is less than the existing node and the left child of the 
    // existing node is null,
    if(n.geometry.parameters.radius < this.geometry.parameters.radius && this.left == null) {

        // Insert the node on the left
        this.left = n;  

        // Set the parent
        n.par = this;

        // Increase depth
        n.depth = this.depth + 1;
        n.height = this.height + 1;

        var rotation;
        var x;
        var y;

        if(this.depth == 0) {
            n.position.x = this.position.x - 30;
            n.position.y = this.position.y - 8;
            rotation = - 75 * Math.PI / 180;
            x = n.position.x + 15; 
            y = n.position.y + 4;

        } else if(this.depth == 1) {
            n.position.x = this.position.x - 16;
            n.position.y = this.position.y - 12;
            rotation = - 55 * Math.PI / 180;
            x = n.position.x + 8; 
            y = n.position.y + 6;

        } else if(this.depth == 2) {
            n.position.x = this.position.x - 8;
            n.position.y = this.position.y - 20;
            rotation = - Math.PI / 9;
            x = n.position.x + 3.5; 
            y = n.position.y + 10;

        } else if(this.depth == 3) {
            n.position.x = this.position.x - 8;
            n.position.y = this.position.y - 20;
        } 

        
        

        // Add node into the scene
        scene.add(n);



        var x1 = this.position.x + this.geometry.parameters.radius * Math.cos(Math.PI / 4);
        var y1 = this.position.y + this.geometry.parameters.radius * Math.sin(Math.PI / 4);

        var x2 = n.position.x + n.geometry.parameters.radius * Math.cos(Math.PI / 4);
        var y2 = n.position.y + n.geometry.parameters.radius * Math.sin(Math.PI / 4);

        height = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

        //getLine(x1, y1, x2, y2);
        getCylinder(height, x, y, rotation);

    } else if(n.geometry.parameters.radius < this.geometry.parameters.radius) {
        
        this.left.createNode(n);

    } else if(n.geometry.parameters.radius > this.geometry.parameters.radius && this.right == null) {


       
        var rotation;
        var x;
        var y;

        if(this.depth == 0) {
            n.position.x = this.position.x + 30;
            n.position.y = this.position.y - 8;
            rotation = 75 * Math.PI / 180;
            x = n.position.x - 15; 
            y = n.position.y + 4;
        } else if(this.depth == 1) {
            n.position.x = this.position.x + 16;
            n.position.y = this.position.y - 12;
            rotation = 55 * Math.PI / 180;
            x = n.position.x - 8; 
            y = n.position.y + 6;

        } else if(this.depth == 2) {
            n.position.x = this.position.x + 8;
            n.position.y = this.position.y - 20;
            rotation = Math.PI / 9;
            x = n.position.x - 3.5; 
            y = n.position.y + 10;

        } else if(this.depth == 3) {
            n.position.x = this.position.x + 8;
            n.position.y = this.position.y - 14;
        } 

        

        this.right = n;
        n.par = this;
        n.depth = this.depth + 1;

        scene.add(n);

        var x1 = this.position.x + this.geometry.parameters.radius * Math.cos(Math.PI / 4);
        var y1 = this.position.y + this.geometry.parameters.radius * Math.sin(Math.PI / 4);

        var x2 = n.position.x + n.geometry.parameters.radius * Math.cos(Math.PI / 4);
        var y2 = n.position.y + n.geometry.parameters.radius * Math.sin(Math.PI / 4);

        height = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

        

        //getLine(x1, y1, x2, y2);
        getCylinder(height, x, y, rotation);

    } else if(n.geometry.parameters.radius > this.geometry.parameters.radius) {
        this.right.createNode(n);
    }
}

Node.prototype.visit = function() {

    if(this.left != null) 
        this.left.visit();

    console.log(this.value);

    if(this.right != null) 
        this.right.visit();
}

Node.prototype.search = function(val) {

    if(this.value == val) {
        return this;
    } else if(this.value > val && this.left != null) {
        return this.left.search(val);
    } else if(this.value < val && this.right != null) {
        return this.right.search(val);
    }

    return null;

}

Node.prototype.givenLevel = function(level) {
    if(this == null)
        return;
    if(level == 1) {
        changeColour(this, time, delay, 0xffff00);
        delay += time;
    } else if(level > 1) {
        this.left.givenLevel(level - 1);
        this.right.givenLevel(level - 1);
    }        
}

Node.prototype.postOrderTraversal = function() {
    if(this.left == null || this.right == null) {
        changeColour(this, time, delay, 0xffff00);
        delay += time;
        return;
    }
           
    this.left.postOrderTraversal();
    this.right.postOrderTraversal();

    changeColour(this, time, delay, 0xffff00);
    delay += time;
}

Node.prototype.inOrderTraversal = function() {
    if(this.left == null || this.right == null) {
        changeColour(this, time, delay, 0xffff00);
        delay += time;
        return;
    }

    this.left.inOrderTraversal();
    changeColour(this, time, delay, 0xffff00);
    delay += time;
    this.right.inOrderTraversal();
}

Node.prototype.preOrderTraversal = function() {
    if(this.left == null || this.right == null) {
        changeColour(this, time, delay, 0xffff00);
        delay += time;
        return;
    }

    changeColour(this, time, delay, 0xffff00);
    delay += time;

    this.left.preOrderTraversal();
    this.right.preOrderTraversal();
}