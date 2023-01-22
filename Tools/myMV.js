var myMV = {};

myMV.getRotationMatrix = function(){ //el, az, spin

    //input checking and fixing
    let args = _argumentsToArray(arguments);
    if (args.length < 3){
        for (let i = 0; i < 3 - args.length; i++){
            args.push(0);
        }
    }

    //return matrix
    return mult(mult(
        rotateY(args[1]),
        rotateX(args[0])),
        rotateZ(args[2])
    );
}

myMV.triangle = function(v1,v2,v3,vertices){

    let v = [v1,v2,v3];
    let ret = [];
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            ret.push(vertices[v[i]][j]);
        }
    }
    return ret;
}

myMV.getModelViewMatrix = function(scale, pos, rotation){
    return mult(mult(
        translate(pos[0],pos[1],pos[2]),
        myMV.getRotationMatrix(rotation)),
        scalem(scale[0],scale[1],scale[2])
    );
}

myMV.differenceVector = function(v1, v2){
    return add(v2, negate(v1));
}

myMV.distance = function(v1, v2){
    return length(this.differenceVector(v1,v2));
}