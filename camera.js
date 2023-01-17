class Camera{
    constructor(){
        this.pos = new vec3(-5, -5, -10);
        this.vel = new vec3(0);

        this.az = 0;
        this.el = 0;

        this.mouseSensitivity = 1;

        this.previousTime = Date.now(); //used to calculate time between frames
    }

    frameDone(){ //call every fram
        //update position based on velocity
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds
        //update pos
        this.pos[0] += this.vel[0] * elapsed;
        this.pos[1] += this.vel[1] * elapsed;
        this.pos[2] += this.vel[2] * elapsed;
        this.previousTime = Date.now();

        //make sure azel is safe
        let azWrap = 180;
        let elLim = 90;
        if (this.az > azWrap){
            this.az -= azWrap * 2;
        }
        if (this.el > elLim){
            this.el = elLim;
        }
        if (this.az < -azWrap){
            this.az += azWrap * 2;
        }
        if (this.el < -elLim){
            this.el = -elLim;
        }

    }

    //setters
    setPos(pos){
        this.pos = new vec3(pos[0], pos[1], pos[2]);
    }

    setVel(vel){
        this.vel = new vec3(vel[0], vel[1], vel[2]);
    }

    followMouse(mouseChange){
        this.az += mouseChange.x * this.mouseSensitivity;
        this.el += mouseChange.y * this.mouseSensitivity;
    }

    setAzEl(AzEl){
        this.az = AzEl.x;
        this.el = AzEl.y;
    }

    setVelLocal(x,y,z){ //move in camera space
        let localVel = new vec4(x,y,z,0);
        
        let globalToLocal = mult(
            rotateX(this.el),
            rotateY(this.az)
        );
        let localToGlobal = inverse(globalToLocal);

        this.vel = mult(localToGlobal, localVel);
    }
    
    //getters
    getPerspectiveMatrix(){
        //important order: p * rY * rX * t [* vPos], so perspective first then, rX ...
        let ret = mult(mult(mult(
        perspective(100.0, 1.0, 1.0, 150.0),
        rotateX(this.el)), 
        rotateY(this.az)),
        translate(this.pos[0], this.pos[1], this.pos[2]));
        
        return ret;
    }

    //for sun
    getPerspectiveMatrixNoTranslate(){
        let ret = mult(mult(
            perspective(100.0, 1.0, 1.0, 500.0),
            rotateX(this.el)), 
            rotateY(this.az));

        return ret;
    }

    getAzEl(){
        return vec2(this.az, this.el);
    }

    getLookDirectionVector(){
        return mult(mult(
            rotateY(this.az),
            rotateX(this.el)),
            vec4(0,0,1,0)
        );
    }
}