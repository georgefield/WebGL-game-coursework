class Camera{
    constructor(){
        this.pos = vec3(0,0,0);
        this.vel = vec3(0,0,0);
        this.acc = vec3(0,0,0);

        this.az = 0;
        this.el = 0;

        this.friction = 5; //lose 5 units of speed per second

        this.mouseSensitivity = 0.01;

        this.ambientLightDirection = vec3(0,1,0);

        this.previousTime = Date.now(); //used to calculate time between frames
    }

    frameDone(){ //call every frame

        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds

        //cap velocity
        if (length(this.vel) > player.maximumMovementSpeed){
            normalize(this.vel);
            this.vel = scale(player.maximumMovementSpeed, this.vel);
        }

        //update velocity based on acceleration
        this.vel[0] += this.acc[0] * elapsed;
        this.vel[1] += this.acc[1] * elapsed;
        this.vel[2] += this.acc[2] * elapsed;
        //update position based on velocity
        this.pos[0] += this.vel[0] * elapsed;
        this.pos[1] += this.vel[1] * elapsed;
        this.pos[2] += this.vel[2] * elapsed;

        //apply friction
        if (length(this.vel) != 0){
            let velLength = length(this.vel);
            normalize(this.vel);
            let newVelLength = velLength - (this.friction * elapsed);
            if (newVelLength < 0){ newVelLength = 0; }
            this.vel = scale(newVelLength, this.vel)
        }

        //make sure azel is safe (cant wrap around)
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

        this.previousTime = Date.now();
    }

    //setters
    setPos(pos){
        this.pos = new vec3(pos[0], pos[1], pos[2]);
    }

    setVel(vel){
        this.vel = new vec3(vel[0], vel[1], vel[2]);
    }

    setAzEl(AzEl){
        this.az = AzEl[0];
        this.el = AzEl[1];
    }
    addAzEl(mouseChange){
        this.az += mouseChange.x * this.mouseSensitivity;
        this.el += mouseChange.y * this.mouseSensitivity;
    }

    setVelLocal(vel){ //move in camera space
        let globalToLocal = mult(
            rotateX(this.el),
            rotateY(this.az)
        );
        let localToGlobal = inverse(globalToLocal);

        this.vel = mult(localToGlobal, vec4(vel[0],vel[1],vel[2],0));
    }

    setAccLocal(acc){ //move in camera space
        let globalToLocal = mult(
            rotateX(this.el),
            rotateY(this.az)
        );
        let localToGlobal = inverse(globalToLocal);

        this.acc = mult(localToGlobal, vec4(acc[0],acc[1],acc[2],0));
    }

    setAmbientLightDirection(ambientLightDirection){
        //vvv pass by value
        this.ambientLightDirection = new vec3(ambientLightDirection[0],ambientLightDirection[1],ambientLightDirection[2]);
        //then normalise
        normalize(this.ambientLightDirection);
    }

    //getters
    getPerspectiveMatrix(){
        //important order: p * rY * rX * t [* vPos]
        let ret = mult(mult(mult(
        perspective(100.0, 1.0, 1.0, 750.0),
        rotateX(this.el)),
        rotateY(this.az)), 
        translate(this.pos[0], this.pos[1], this.pos[2]));
        
        return ret;
    }

    //for sun to give no parralax (seem very far away)
    getPerspectiveMatrixNoTranslate(){
        let ret = mult(mult(
            perspective(100.0, 1.0, 1.0, 750.0),
            rotateX(this.el)),
            rotateY(this.az)
        );

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

    getLocalVel(){
        let globalToLocal = mult(
            rotateX(this.el),
            rotateY(this.az)
        );
        
        let localVel = mult(globalToLocal, vec4(this.vel[0], this.vel[1], this.vel[2], 0));
        return vec3(localVel[0], localVel[1], localVel[2]);
    }
}
