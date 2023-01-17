
class Icosahedron{
    constructor(){
        this.numVertices = 60; //20 faces, 3 points for each face

        this.points = [];

        this.vboID;

        let phi = 1.6180339887;

        this.vertices = [
            //xy
            vec4(phi,1,0),
            vec4(phi,-1,0),
            vec4(-phi,1,0),
            vec4(-phi,-1,0),

            //xz
            vec4(1,0,-phi),
            vec4(-1,0,-phi),
            vec4(1,0,phi),
            vec4(-1,0,phi),
            
            //yz
            vec4(0,-phi,1),
            vec4(0,-phi,-1),
            vec4(0,phi,1),
            vec4(0,phi,-1)
        ]
    }

    triangle(v1,v2,v3){

        let v = [v1,v2,v3];
        let ret = [];
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 4; j++){
                ret.push(this.vertices[v[i]][j]);
            }
        }
        return ret;
    }

    init(){
        this.points.push(this.triangle(0,1,4));
        this.points.push(this.triangle(0,1,6));

        this.points.push(this.triangle(2,3,5));
        this.points.push(this.triangle(2,3,7));

        this.points.push(this.triangle(4,5,9));
        this.points.push(this.triangle(4,5,11));

        this.points.push(this.triangle(6,7,8));
        this.points.push(this.triangle(6,7,10));

        this.points.push(this.triangle(8,9,1));
        this.points.push(this.triangle(8,9,3));

        this.points.push(this.triangle(10,11,0));
        this.points.push(this.triangle(10,11,2));

        this.points.push(this.triangle(0,4,11));
        this.points.push(this.triangle(0,6,10));
        this.points.push(this.triangle(1,4,9));
        this.points.push(this.triangle(1,6,8));

        this.points.push(this.triangle(2,5,11));
        this.points.push(this.triangle(2,7,10));
        this.points.push(this.triangle(3,5,9));
        this.points.push(this.triangle(3,7,8));

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);
    }

    draw(program){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID)
        let vPosition = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}

class Quad{
    constructor(){
        this.numVertices = 6;

        this.points = [];

        this.vboID = 0;
    }
    
    init(rect){
        let vertices = [
            vec2(rect[0], rect[1]),
            vec2(rect[0] + rect[2], rect[1]),
            vec2(rect[0], rect[1] + rect[3]),
            vec2(rect[0] + rect[2], rect[1] + rect[3])
        ]

        this.points.push(vertices[0]);
        this.points.push(vertices[1]);
        this.points.push(vertices[2]);
        this.points.push(vertices[1]);
        this.points.push(vertices[2]);
        this.points.push(vertices[3]);

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);
    }

    draw(program){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID)
        let vPosition = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }

}