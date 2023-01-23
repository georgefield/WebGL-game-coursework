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
    }

    draw(){
        this.model.draw(meteoriteProgram, _camera.getPerspectiveMatrix(), myMV.getModelViewMatrix(vec3(1,1,1), this.pos, vec3(0,0,0)));
    }
}