var tools3D = {};

tools3D.setUniformProjectionMatrix = function(program, projectionMatrix, uniformName){
    let location = gl.getUniformLocation(program, uniformName);
    gl.uniformMatrix4fv(location, false, flatten(projectionMatrix));
}

tools3D.setUniformModelViewMatrix = function(program, modelViewMatrix, uniformName){
    let location = gl.getUniformLocation(program, uniformName);
    gl.uniformMatrix4fv(location, false, flatten(modelViewMatrix));
}

tools3D.enableVertexAttrib = function(program,vboID){
    gl.bindBuffer(gl.ARRAY_BUFFER, vboID)
    let vPosition = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

tools3D.enableNormalAttrib = function(program,nboID){ 
    gl.bindBuffer(gl.ARRAY_BUFFER, nboID)
    let nPosition = gl.getAttribLocation(program, "normal");
    gl.vertexAttribPointer(nPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(nPosition);
}

class ModelCreatorHelper{
    constructor(vertices = undefined){
        this.points = [];
        this.normals = [];
        this.verts = vertices;
    }

    addTriangleAndNormals(v1, v2, v3){
        let vertices = [this.verts[v1],this.verts[v2],this.verts[v3]];

        //---add normals---
        let v1tov2 = add(vertices[1], negate(vertices[0]));
        let v2tov3 = add(vertices[2], negate(vertices[1]));

        let normal = cross(v1tov2, v2tov3);
        normalize(normal);
        //assume towards (0,0,0) is inwards, want all normals to point out
        let avgVertex = vec3(add(add(vertices[0], vertices[1]), vertices[2]));

        if (length(add(avgVertex,scale(0.1,normal))) < length(avgVertex)){
            //if vertex + normal is closer to centre then negate
            normal = negate(normal);
        }

        //add 3 times so equal amount of normals and vertices
        for (let i = 0; i < 3; i++){
            this.normals.push(normal);
        }

        //---add vertices---
        this.points.push(vertices[0]);
        this.points.push(vertices[1]);
        this.points.push(vertices[2]);
    }

    loadSTL(STL){
        let splitByFace = STL.split("normal ");

        for (let i = 1; i < splitByFace.length; i++){
            let splitByLine = splitByFace[i].split('\n');
            let normal = splitByLine[0].split(" ");

            for (let j = 0; j < 3; j++){ 
                this.normals.push(vec3(parseFloat(normal[0]),parseFloat(normal[1]),parseFloat(normal[2])));
            }
            for (let j = 0; j < 3; j++){
                let vertex = splitByLine[j+1].split(" ");
                this.points.push(vec4(parseFloat(vertex[0]), parseFloat(vertex[1]), parseFloat(vertex[2]), 1.0));
            }
        }
    }
}


class Icosahedron{
    constructor(){
        this.numVertices = 60; //20 faces, 3 points for each face

        this.points = [];
        this.normals = [];

        this.vboID = 0;
        this.nboID = 0;

        this.init();
    }

    init(){
        let phi = 1.6180339887;
        let vertices = [
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

        let helper = new ModelCreatorHelper(vertices);
        helper.addTriangleAndNormals(0,1,4);
        helper.addTriangleAndNormals(0,1,6);

        helper.addTriangleAndNormals(2,3,5);
        helper.addTriangleAndNormals(2,3,7);

        helper.addTriangleAndNormals(4,5,9);
        helper.addTriangleAndNormals(4,5,11);

        helper.addTriangleAndNormals(6,7,8);
        helper.addTriangleAndNormals(6,7,10);

        helper.addTriangleAndNormals(8,9,1);
        helper.addTriangleAndNormals(8,9,3);

        helper.addTriangleAndNormals(10,11,0);
        helper.addTriangleAndNormals(10,11,2);

        helper.addTriangleAndNormals(0,4,11);
        helper.addTriangleAndNormals(0,6,10);
        helper.addTriangleAndNormals(1,4,9);
        helper.addTriangleAndNormals(1,6,8);

        helper.addTriangleAndNormals(2,5,11);
        helper.addTriangleAndNormals(2,7,10);
        helper.addTriangleAndNormals(3,5,9);
        helper.addTriangleAndNormals(3,7,8);
        this.points = helper.points;
        this.normals = helper.normals;

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

        this.nboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
    }

    draw(program, perspectiveMatrix,modelViewMatrix,enableNormalAttrib = false){
        tools3D.setUniformProjectionMatrix(program, perspectiveMatrix, "projectionMatrix");
        tools3D.setUniformModelViewMatrix(program, modelViewMatrix, "modelViewMatrix");

        if (enableNormalAttrib){
            tools3D.enableNormalAttrib(program,this.nboID);
        }
        tools3D.enableVertexAttrib(program,this.vboID);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}

class Cube{
    constructor(){
        this.numVertices = 36; //6 for each quad, 6 quads

        this.points = [];
        this.normals = [];

        this.vboID = 0;
        this.nboID = 0;

        this.init();
    }

    init(){
        let vertices = [
            vec4(1,1,1),
            vec4(-1,1,1),
            vec4(1,-1,1),
            vec4(1,1,-1),
            vec4(-1,-1,1),
            vec4(1,-1,-1),
            vec4(-1,1,-1),
            vec4(-1,-1,-1)
        ];

        let helper = new ModelCreatorHelper(vertices);
        helper.addTriangleAndNormals(0,1,2);
        helper.addTriangleAndNormals(4,1,2);

        helper.addTriangleAndNormals(0,2,3);
        helper.addTriangleAndNormals(5,2,3);

        helper.addTriangleAndNormals(0,1,3);
        helper.addTriangleAndNormals(6,1,3);

        helper.addTriangleAndNormals(7,5,6);
        helper.addTriangleAndNormals(3,5,6);

        helper.addTriangleAndNormals(7,4,6);
        helper.addTriangleAndNormals(1,4,6);

        helper.addTriangleAndNormals(7,4,5);
        helper.addTriangleAndNormals(2,4,5);

        this.points = helper.points;
        this.normals = helper.normals;

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

        this.nboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
    }

    draw(program, perspectiveMatrix, modelViewMatrix, enableNormalAttrib = false){
        tools3D.setUniformProjectionMatrix(program, perspectiveMatrix, "projectionMatrix");
        tools3D.setUniformModelViewMatrix(program, modelViewMatrix, "modelViewMatrix");

        if (enableNormalAttrib){
            tools3D.enableNormalAttrib(program,this.nboID);
        }
        tools3D.enableVertexAttrib(program,this.vboID);

        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}

class SpacestationModel{
    constructor(){
        this.points = undefined;
        this.normals = undefined;
        this.numVertices = undefined;
        
        this.init();
    }

    init(){
        let helper = new ModelCreatorHelper();
        helper.loadSTL(_spacestationSTL, this.points, this.normals);

        this.points = helper.points;
        this.normals = helper.normals;

        this.numVertices = helper.points.length;

        this.vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

        this.nboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nboID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
    }
    
    draw(program, perspectiveMatrix, modelViewMatrix, enableNormalAttrib = false){
        tools3D.setUniformProjectionMatrix(program, perspectiveMatrix, "projectionMatrix");
        tools3D.setUniformModelViewMatrix(program, modelViewMatrix, "modelViewMatrix");

        tools3D.enableVertexAttrib(program,this.vboID);
        if (enableNormalAttrib){
            tools3D.enableNormalAttrib(program,this.nboID);
        }
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}