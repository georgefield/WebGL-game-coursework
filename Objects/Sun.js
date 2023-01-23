class Sun{
    constructor(){
        this.model1 = new Icosahedron();
        this.model2 = new Icosahedron();

        //model view vars
        this.scale = vec3(50,50,50);
        this.pos = vec3(0,0,0);
        this.rotation1 = vec3(0,0,0);
        this.rotation2 = vec3(0,0,0);

        this.colour = vec4(0.95,1,0.7,1); //default

        //other properties
        this.spin1 = vec3(2,5,11);
        this.spin2 = vec3(13,3,7);

        this.previousTime = Date.now();
    }
    
    frameDone(){
        //update rotation based on spin
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds

        this.rotation1 = add(this.rotation1, scale(elapsed, this.spin1));
        this.rotation2 = add(this.rotation2, scale(elapsed, this.spin2));

        this.previousTime = Date.now();
    }

    draw(){
        let model1ViewMatrix = myMV.getModelViewMatrix(this.scale, this.pos, this.rotation1);
        let model2ViewMatrix = myMV.getModelViewMatrix(this.scale, this.pos, this.rotation2);

        let sunColorLoc = gl.getUniformLocation(sunProgram, "sunColor");
        gl.uniform4fv(sunColorLoc, this.colour);

        //no translate so sun has no parralax effect (looks far away)
        this.model1.draw(sunProgram, _camera.getPerspectiveMatrixNoTranslate(), model1ViewMatrix);
        this.model2.draw(sunProgram, _camera.getPerspectiveMatrixNoTranslate(), model2ViewMatrix);
    }
}