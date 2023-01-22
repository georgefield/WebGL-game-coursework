class HudArrow{
    constructor(){
        this.t1 = new Triangle2D(vec4(-0.1,-1,0.2,0.2));
        this.t2 = new Triangle2D(vec4(-0.15,-0.75,0.3,0.3));
        this.t3 = new Triangle2D(vec4(-0.2,-0.4,0.4,0.4));
    }

    getArrowModelViewMatrix(mouseObj){
        //find rotation to point towards direction of turning
        let mousePos = mouseObj.getMousePos();
        let mousePosNormalised = {x:2 * mousePos.x / canvas.width, y:2 * -mousePos.y / canvas.height};

        let rotateZdeg = Math.atan(mousePosNormalised.y / mousePosNormalised.x) * 180 / Math.PI;
        if (mousePosNormalised.x > 0) {
            rotateZdeg += 180;
        }
        rotateZdeg += 90; //start pointing right

        //scale by how close to the origin, sqrt to adjust tension
        let scale = Math.sqrt(length(vec2(mousePosNormalised.x, mousePosNormalised.y))) * 0.15;

        return myMV.getModelViewMatrix(vec3(scale,scale,scale), vec3(mousePosNormalised.x, mousePosNormalised.y, 0), vec3(0, 0, rotateZdeg));
    }

    draw(){ 
        let arrowModelViewMatrixLoc = gl.getUniformLocation(hudProgram, "arrowModelViewMatrix");

        gl.uniformMatrix4fv(arrowModelViewMatrixLoc, false, flatten(_hudArrow.getArrowModelViewMatrix(_mouse)));

        this.t1.draw(hudProgram);
        this.t2.draw(hudProgram);
        this.t3.draw(hudProgram);
    }
}