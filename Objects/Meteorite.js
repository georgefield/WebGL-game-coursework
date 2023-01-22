class Meteorite{
    constructor(pos, spacestation, speed, scaleAmt){
        this.model = new Icosahedron();
        this.scaleStart = scaleAmt;

        //model view matrix vars
        this.scale = vec3(scaleAmt,scaleAmt,scaleAmt);
        this.pos = pos;
        this.rotation = vec3(Math.random() * 360,Math.random() * 180,Math.random() * 360);

        this.collisionRadius = 1.6180339887 * scaleAmt; //phi  *scale
        this.collisionModel = new Sphere(this.collisionRadius, this.pos);

        //auxiliary uniform vars
        this.colour = vec4(0.4,0.35,0.3,1);

        //other properties
        if (spacestation != undefined){
            let towardsSSvector = normalize(myMV.differenceVector(this.pos, spacestation.pos));
            this.vel = scale(speed, towardsSSvector);
        }
        else{
            this.vel = vec3(0,0,0);
        }

        this.erase = false;
        this.disappearTime = 1; //in seconds, once destroyed
        this.timeDestroyed = undefined;

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

        if (this.timeDestroyed != undefined){
            let timeSinceDestroyed = (Date.now() - this.timeDestroyed) * 0.001;
            //make smaller linearly
            let scaleAmt = this.scaleStart * ((this.disappearTime - timeSinceDestroyed) / this.disappearTime);
            this.scale = vec3(scaleAmt, scaleAmt, scaleAmt);
            this.collisionRadius = 1.6180339887 * scaleAmt; //phi/2  *scale

            if (scaleAmt < 0){
                this.scale = vec3(0,0,0);
                this.erase = true;
            }
        }

        //update collision model
        this.collisionModel.update(this.collisionRadius, this.pos);
    }

    draw(){
        //auxiliary uniforms
        let colourUniformLoc = gl.getUniformLocation(meteoriteProgram, "vColor");
        let ambientLightDirectionLoc = gl.getUniformLocation(meteoriteProgram, "ambientLightDirection");
        let invRotationMatrixLoc = gl.getUniformLocation(meteoriteProgram, "inverseRotationMatrix");
        
        let inverseRotationMatrix = inverse(myMV.getRotationMatrix(this.rotation));

        gl.uniform4fv(colourUniformLoc, this.colour);
        gl.uniform3fv(ambientLightDirectionLoc, _camera.ambientLightDirection);
        gl.uniformMatrix4fv(invRotationMatrixLoc, false, flatten(inverseRotationMatrix));

        this.model.draw(meteoriteProgram, _camera.getPerspectiveMatrix(), myMV.getModelViewMatrix(this.scale, this.pos, this.rotation));
    }
}