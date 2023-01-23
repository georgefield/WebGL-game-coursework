/*old spacestation stand in code
class Spacestation{
    constructor(){
        this.pos = vec3(0,0,-20);
        this.object = new Meteorite(this.pos, undefined, 0, 10);
        this.object.colour = vec4(1,1,1,1);
    }

    draw(){
        this.object.draw();
    }
}*/

class Spacestation{
    constructor(){
        this.pos = vec3(0,0,-20);
        this.model = new SpacestationModel();
        this.scale = 3;

        //check all 4
        this.collisionModel = [
            new Sphere(this.scale,this.pos),
            new Sphere(this.scale,add(this.pos,vec3(this.scale * 5,0,0))),
            new Sphere(this.scale,add(this.pos,vec3(this.scale * -5,0,0))),
            new Sphere(this.scale,add(this.pos,vec3(0,this.scale * 5,0))),
            new Sphere(this.scale,add(this.pos,vec3(0,this.scale * -5,0)))
        ];

        this.timeDestroyed = undefined;
        this.erase = false;
        this.grayOutFactor = 0;

        this.erase = false;

        this.spin = vec3(0,0,5);
        this.rotation = vec3(0,0,0);

        this.previousTime = Date.now();
    }

    frameDone(){
        let elapsed = (Date.now() - this.previousTime) * 0.001; //*0.001 as date.now() returns milliseconds

        //update rotation by spin
        this.rotation = add(this.rotation, scale(elapsed, this.spin));

        //fade to gray if destroyed
        if (this.timeDestroyed != undefined){
            let timeSinceDestroyed = (Date.now() - this.timeDestroyed) * 0.001;

            this.grayOutFactor = timeSinceDestroyed;
            if (this.grayOutFactor > 1){
                this.grayOutFactor = 1;
            }

            if (timeSinceDestroyed > 1){
                this.erase = true;
            }
        }

        this.previousTime = Date.now();
    }
    
    draw(){
        let invRotationMatrixLoc = gl.getUniformLocation(spacestationProgram, "inverseRotationMatrix");
        let ambientLightDirectionLoc = gl.getUniformLocation(spacestationProgram, "ambientLightDirection");
        let grayOutFactorLoc = gl.getUniformLocation(spacestationProgram, "grayOutFactor");

        let inverseRotationMatrix = inverse(myMV.getRotationMatrix(this.rotation));

        gl.uniformMatrix4fv(invRotationMatrixLoc, false, flatten(inverseRotationMatrix));
        gl.uniform3fv(ambientLightDirectionLoc, _camera.ambientLightDirection);
        gl.uniform1f(grayOutFactorLoc, this.grayOutFactor);
        
        //projectiles array
        let numProjectilesLoc = gl.getUniformLocation(spacestationProgram, "numProjectiles");
        let projectilePositionsLoc = gl.getUniformLocation(spacestationProgram, "projectilePositions");

        gl.uniform1i(numProjectilesLoc, player.projectilePositions.length);
        gl.uniform3fv(projectilePositionsLoc, flatten(player.projectilePositions));

        this.model.draw(spacestationProgram, _camera.getPerspectiveMatrix(), myMV.getModelViewMatrix(vec3(this.scale ,this.scale ,this.scale), this.pos, this.rotation), true);
    }

    checkCollidingWith(obj){
        for (let i =0; i < this.collisionModel.length; i++){
            if (isColliding(obj, this.collisionModel[i])){
                return true;
            }
        }
        return false;
    }
}