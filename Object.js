class Icosahedron{
    constructor(){
        this.numVertices = 60; //20 faces, 3 points for each face

        this.colour = vec4(0.0, 1.0 ,0.0, 1.0);
        this.points = [];
        this.colours = [];

        let phi = 1.6180339887;

        this.vertices = [
            //xy
            vec4(phi,1,0),
            vec4(phi,-1,0),
            vec4(-phi,1,0),
            vec4(-phi,-1,0),

            //xz
            vec4(1,0,-phi),
            vec4(-1,0,-phi),
            vec4(1,0,phi),
            vec4(-1,0,phi),
            
            //yz
            vec4(0,-phi,1),
            vec4(0,-phi,-1),
            vec4(0,phi,1),
            vec4(0,phi,-1)
        ]
    }



    triangle(v1,v2,v3){
        for (let i = 0; i < 3; i++){
            this.colours.push(this.colour);
        }

        let v = [v1,v2,v3];
        let ret = [];
        for(let i =0; i < 3; i++){
            for(let j =0; j < 4; j++){
                ret.push(this.vertices[v[i]][j]);
            }
        }
        return ret;
    }

    initPoints(){
        this.points.push(this.triangle(0,1,4));
        this.points.push(this.triangle(0,1,6));

        this.points.push(this.triangle(2,3,5));
        this.points.push(this.triangle(2,3,7));

        this.points.push(this.triangle(4,5,9));
        this.points.push(this.triangle(4,5,11));

        this.points.push(this.triangle(6,7,8));
        this.points.push(this.triangle(6,7,10));

        this.points.push(this.triangle(8,9,1));
        this.points.push(this.triangle(8,9,3));

        this.points.push(this.triangle(10,11,0));
        this.points.push(this.triangle(10,11,2));

        this.points.push(this.triangle(0,4,11));
        this.points.push(this.triangle(0,6,10));
        this.points.push(this.triangle(1,4,9));
        this.points.push(this.triangle(1,6,8));

        this.points.push(this.triangle(2,5,11));
        this.points.push(this.triangle(2,7,10));
        this.points.push(this.triangle(3,5,9));
        this.points.push(this.triangle(3,7,8));
    }

}

// RGBA colors
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(1.0, 1.0, 1.0, 1.0), // white
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];