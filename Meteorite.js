function float32Concat(first, second)
{
    result = new Float32Array(first.length + second.length);

    result.set(first);
    result.set(second, first.length);

    return result;
}

class Icosahedron{
    constructor(){
        this.numVertices = 60; //20 faces, 3 points for each face

        this.points = [];
        this.normals = [];

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

    draw(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID)
        let vPosition = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}


class Meteorite{
    constructor(){
        this.model = new Icosahedron();

        this.scale = 1.0;
        this.pos = vec3(0,0,0);
        this.vel = vec3(0,0,0);
        this.colour = vec4(0.0,1.0,0,1.0);
        this.ambientLightDirection = vec3(0.0,1.0,0.0);

        this.model.init();

        this.previousTime = Date.now(); //used to calculate time between frames

    }

    frameDone(){ //call every frame
        //update position based on velocity
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds
        //update pos
        this.pos[0] += this.vel[0] * elapsed;
        this.pos[1] += this.vel[1] * elapsed;
        this.pos[2] += this.vel[2] * elapsed;
        this.previousTime = Date.now();
    }

    //setters
    setPos(pos){
        this.pos = new vec3(pos[0], pos[1], pos[2]);
    }

    setVel(vel){
        this.vel = new vec3(vel[0], vel[1], vel[2]);
    }

    setScale(scale){
        this.scale = scale;
    }

    //getters
    getModelViewMatrix(){
        return mult(
            translate(this.pos[0], this.pos[1], this.pos[2]), 
            scalem(this.scale, this.scale, this.scale)
        );
    }

    draw(){
        let colourUniformLoc = gl.getUniformLocation(program, "vColor");
        gl.uniform4fv(colourUniformLoc, this.colour);

        let ambientLightDirectionLoc = gl.getUniformLocation(program, "ambientLightDirection");
        gl.uniform3fv(ambientLightDirectionLoc, this.ambientLightDirection);

        this.model.draw();
    }
}