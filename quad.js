class Quad {
	constructor(x, y, width, height){
		this.setRect(x, y, width, height);
	}
	setRect(x, y, width, height) {
	  // Store the vertex position data for the quad
	  this.vertices = new Float32Array([
		x, y,          // Vertex 1 (x, y) BL
		x + width, y,  // Vertex 2 (x, y) BR
		x, y + height,  // Vertex 3 (x, y) TL
		x + width, y,  // Vertex 2 (x, y) BR
		x, y + height,  // Vertex 3 (x, y) TL
		x + width, y + height // Vertex 4 (x, y) TR
	  ]);
	}
	getVertices(){
		return this.vertices;
	}
}




class Vertex3D{
	constructor(x, y, z){
		this.setPos(x,y,z);
	}
	setPos(x, y, z){
		this.pos = new Float32Array(x,y,z);
	}

}

class Quad3D {
	constructor(vertex1, vertex2, vertex3, vertex4){
		this.setVertices(vertex1, vertex2, vertex3, vertex4);
	}
	setVertices(vertex1, vertex2, vertex3, vertex4) {
	  // Store the vertex position data for the quad
	  this.vertices = new Float32Array([
		vertex1.x, vertex1.y, vertex1.z,         
		vertex2.x, vertex2.y, vertex2.z,  
		vertex3.x, vertex3.y, vertex3.z,
		vertex4.x, vertex4.y, vertex4.z  
	  ]);
	}
	getVertices(){
		return this.vertices;
	}
}

class Cube{
	constructor(size, centre){
		this.setVertices(size, centre);
	}
	setVertices(size, centre){
		let hs = size / 2;
		//front
		let BLF = new Vertex3D(centre.x - hs, centre.y - hs, centre.z - hs); //bottom left front
		let BRF = new Vertex3D(centre.x + hs, centre.y - hs, centre.z - hs); //bottom right front
		let TLF = new Vertex3D(center.x - hs, centre.y + hs, centre.z - hs); //top left ...
		let TRF = new Vertex3D(centre.x + hs, centre.y + hs, centre.z - hs); //...
		//back
		let BLB = new Vertex3D(centre.x - hs, centre.y - hs, centre.z + hs);
		let BRB = new Vertex3D(centre.x + hs, centre.y - hs, centre.z + hs);
		let TLB = new Vertex3D(center.x - hs, centre.y + hs, centre.z + hs);
		let TRB = new Vertex3D(centre.x + hs, centre.y + hs, centre.z + hs);

		//create the quads, the same letter in the acronyms is the side of the cube
		this.quad1 = new Quad3D(BLF, BRF, TLF, TRF); //front
		this.quad2 = new Quad3D(BLF, BRF, BLB, BRB); //bottom
		this.quad3 = new Quad3D(TLF, TRF, TLB, TRB); //top
		this.quad4 = new Quad3D(BRF, TRF, BRB, TRB); //right
		this.quad5 = new Quad3D(BLF, TLF, BLB, TLB); //left
		this.quad6 = new Quad3D(BLB, BRB, TLB, TRB); //back
		this.vertices = new Float32Array([
			quad1.getVertices(),
			quad2.getVertices(),
			quad3.getVertices(),
			quad4.getVertices(),
			quad5.getVertices(),
			quad6.getVertices()		
		]);
	}
}