function float32Concat(first, second)
{
    result = new Float32Array(first.length + second.length);

    result.set(first);
    result.set(second, first.length);

    return result;
}



class Meteorite{
    constructor(){
        this.model = new Icosahedron();

        this.scale = 1.0;
        this.pos = vec3(0,0,0);
        this.vel = vec3(0,0,0);
        this.colour = vec4(0.4,0.35,0.3,1.0);
        this.ambientLightDirection = vec3(0.0,1.0,0.0);

        this.model.init();

        this.previousTime = Date.now(); //used to calculate time between frames

        this.colourUniformLoc = gl.getUniformLocation(meteoriteProgram, "vColor");
        this.ambientLightDirectionLoc = gl.getUniformLocation(meteoriteProgram, "ambientLightDirection");

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

    setAmbientLightDirection(vec){
        this.ambientLightDirection = new vec3(vec);
        normalize(this.ambientLightDirection);
    }

    //getters
    getModelViewMatrix(){

        return mult(
            translate(this.pos[0], this.pos[1], this.pos[2]), 
            scalem(this.scale, this.scale, this.scale)
        );
    }

    draw(){
        gl.uniform4fv(this.colourUniformLoc, this.colour);
        gl.uniform3fv(this.ambientLightDirectionLoc, this.ambientLightDirection);

        this.model.draw(meteoriteProgram);
    }
}