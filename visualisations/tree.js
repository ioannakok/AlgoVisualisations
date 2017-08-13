function Tree() {
        this.root = null;
    }

Tree.prototype.traverse = function() {
        this.root.visit();
    }

Tree.prototype.search = function(val) {
	var found = this.root.search(val);

	return found;
}

Tree.prototype.create = function(val) {

	var geometry = new THREE.SphereGeometry(val, 20, 20);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000});
    var node = new Node(geometry, material);
        

    if(this.root == null) {
    	node.position.x = 0;
    	node.position.y = 24;
    	scene.add(node);
        this.root = node;
        this.root.depth = 0;
        this.root.height = 1;

    } else {
        this.root.createNode(node);
    }
}

Tree.prototype.levelOrder = function() {

    var h = 4;

    for(var i = 1; i <= h; i++) {
        this.root.givenLevel(i);
    }
}

Tree.prototype.postOrder = function() {

    if(this.root == null) 
        return;
    
    this.root.postOrderTraversal();
}

Tree.prototype.inOrder = function() {
    if(this.root == null)
        return;

    this.root.inOrderTraversal()
}

Tree.prototype.preOrder = function() {
    if(this.root == null)
        return;

    this.root.preOrderTraversal();
}

