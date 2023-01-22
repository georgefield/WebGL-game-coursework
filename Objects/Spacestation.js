class Spacestation{
    constructor(){
        this.pos = vec3(0,0,20);
        this.object = new Meteorite(this.pos, undefined, 0, 10);
        this.object.colour = vec4(1,1,1,1);
    }

    draw(){
        this.object.draw();
    }
}