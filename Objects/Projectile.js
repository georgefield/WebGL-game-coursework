class Projectile{
    constructor(){
        this.erase = false;

        this.model = new Cube();

        this.scale = vec3(0.5,0.5,1.5);
        this.pos = vec3(0,0,0);
        this.rotation = vec3(0,0,0);

        this.collisionModel = new Point(this.pos, this.scale, this.rotation);

        this.spin = vec3(0,0,150);

        this.vel = vec3(0,0,0);

        this.creationTime = Date.now();
        this.timeToDeath = 3; //3 seconds before despawn (save resources)

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

        this.rotation = add(this.rotation, scale(elapsed, this.spin));

        let elapsedSinceCreation = (Date.now() - this.creationTime) * 0.001;
        if (elapsedSinceCreation > this.timeToDeath){
            this.erase = true;
        }

        //update collision model
        this.collisionModel.update(this.pos);
    }

    draw(){
        //auxiliary uniforms
        let rotationMatrixLoc = gl.getUniformLocation(projectileProgram, "rotationMatrix");
        let ambientLightDirectionLoc = gl.getUniformLocation(projectileProgram, "ambientLightDirection");
        
        let rotationMatrix = myMV.getRotationMatrix(this.rotation);

        gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
        gl.uniform3fv(ambientLightDirectionLoc, _camera.ambientLightDirection);

        this.model.draw(projectileProgram, _camera.getPerspectiveMatrix(), myMV.getModelViewMatrix(this.scale,this.pos,this.rotation), true);
    }
}