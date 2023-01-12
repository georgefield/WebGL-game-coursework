class Camera{
    constructor(){
        this.pos = new vec3(0, 0, -25);
        this.vel = new vec3(0);

        this.az = 0;
        this.el = 0;

        this.mouseSensitivity = 0.1;

        this.previousTime = Date.now(); //used to calculate time between frames
    }

    frameDone(){ //call every fram
        //update position based on velocity
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds
        this.pos[0] += this.vel[0] * elapsed;
        this.previousTime = Date.now();
    }

    //setters
    setPos(pos){
        this.pos = new vec3(pos[0], pos[1], pos[2]);
    }

    setVel(vel){
        this.vel = new vec3(vel[0], vel[1], vel[2]);
    }

    setAz(az){
        this.az = az;
    }

    setEl(el){
        this.el = el;
    }

    followMouse(mouseChange){
        this.az += mouseChange.x * this.mouseSensitivity;
        this.el += mouseChange.y * this.mouseSensitivity;
    }

    //getters
    getPerspectiveMatrix(){
        //important order: p * rY * rX * t [* vPos], so perspective first then, rX ...
        let ret = mult(mult(mult(
        perspective(120.0, 1.0, 3.5, 100.0),
        rotateX(this.el)), 
        rotateY(this.az)),
        translate(this.pos[0], this.pos[1], this.pos[2]));
        
        return ret;
        //return perspective(120.0, 1.0, 3.5, 100.0);
    }
}