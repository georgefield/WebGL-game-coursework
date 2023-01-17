class HudArrow{
    constructor(){
        this.body = new Quad();

        this.body.init(vec4(-0.25,-1.0,0.5,1.0));

        this.head = new Triangle();

        this.head.init(vec4(-0.5,0.0,1.0,1.0));
    }

    draw(){
        this.body.draw(hudProgram);
        this.head.draw(hudProgram);
    }
}