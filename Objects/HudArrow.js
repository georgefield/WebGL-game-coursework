class HudArrow{
    constructor(){
        this.t1 = new Triangle();
        this.t2 = new Triangle();
        this.t3 = new Triangle();
        this.t1.init(vec4(-0.1,-1,0.2,0.2));
        this.t2.init(vec4(-0.15,-0.75,0.3,0.3));
        this.t3.init(vec4(-0.2,-0.4,0.4,0.4));
    }

    getArrowModelViewMatrix(mouseObj){
        let mousePos = mouseObj.getMousePos();
        let mousePosNormalised = {x:2 * mousePos.x / canvas.width, y:2 * -mousePos.y / canvas.height};

        let rotateZdeg = Math.atan(mousePosNormalised.y / mousePosNormalised.x) * 180 / Math.PI;
        if (mousePosNormalised.x > 0) {
            rotateZdeg += 180;
        }
        rotateZdeg += 90; //start pointing right

        let s = Math.sqrt(length(vec2(mousePosNormalised.x, mousePosNormalised.y))) * 0.15;

        return mult(mult(
            translate(mousePosNormalised.x, mousePosNormalised.y, 0),
            rotateZ(rotateZdeg)),
            scalem(s,s,s)
        );
    }

    draw(){
        this.t1.draw(hudProgram);
        this.t2.draw(hudProgram);
        this.t3.draw(hudProgram);
    }
}