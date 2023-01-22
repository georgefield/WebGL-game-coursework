var tools2D = {};

tools2D.draw = function(program,vboID,numVertices){
    gl.bindBuffer(gl.ARRAY_BUFFER, vboID)
    let vPosition = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

class Quad2D{
    constructor(rect){
        this.numVertices = 6;

        this.points = [];

        this.vboID = 0;

        this.init(rect);
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

class Triangle2D{
    constructor(rect){
        this.numVertices = 3;

        this.points = [];
        this.colours = [];

        this.vboID = 0;

        this.init(rect);
    }

    init(rect){
        this.points.push(vec2(rect[0],rect[1]));
        this.points.push(vec2(rect[0] + rect[2], rect[1]));
        this.points.push(vec2(rect[0] + (0.5 * rect[2]), rect[1] + rect[3]));

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);
    }

    draw(program){
        tools2D.draw(program, this.vboID, this.numVertices)
    }
}