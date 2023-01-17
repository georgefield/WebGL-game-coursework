class Sun{
    constructor(){
        this.model1 = new Icosahedron();
        this.model2 = new Icosahedron();

        this.scale = 50.0;
        this.pos = vec3(200,375,0);

        this.rotation1 = vec3(0);
        this.rotation2 = vec3(0);

        this.spin1 = vec3(2,5,11);
        this.spin2 = vec3(13,3,7);

        this.model1.init();
        this.model2.init();

        this.previousTime = Date.now();
    }
    
    frameDone(){
        //update position based on velocity
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds

        this.rotation1 = add(this.rotation1, scale(elapsed, this.spin1));
        this.rotation2 = add(this.rotation2, scale(elapsed, this.spin2));
        this.previousTime = Date.now();
    }

    //getters
    getModel1ViewMatrix(){
        let rotation = mult(mult(
            rotateX(this.rotation1[0]),
            rotateY(this.rotation1[1])),
            rotateZ(this.rotation1[2])
        );

        return mult(mult(
            translate(this.pos[0], this.pos[1], this.pos[2]), 
            scalem(this.scale, this.scale, this.scale)),
            rotation
        );
    }

    getModel2ViewMatrix(){
        let rotation = mult(mult(
            rotateX(this.rotation2[0]),
            rotateY(this.rotation2[1])),
            rotateZ(this.rotation2[2])
        );

        return mult(mult(
            translate(this.pos[0], this.pos[1], this.pos[2]), 
            scalem(this.scale, this.scale, this.scale)),
            rotation
        );
    }

    draw(){
        let modelViewMatrixLoc = gl.getUniformLocation(sunProgram, "modelViewMatrix");
        let model1ViewMatrix = this.getModel1ViewMatrix();

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(model1ViewMatrix));

        this.model1.draw(sunProgram);

        let model2ViewMatrix = this.getModel2ViewMatrix();

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(model2ViewMatrix));

        this.model2.draw(sunProgram);
    }
}