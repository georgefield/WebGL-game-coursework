class Sphere{
    constructor(radius, pos){
        this.radius = radius;
        this.pos = pos;
        this.name = "sphere";
    }

    update(radius, pos){
        this.radius = radius;
        this.pos = pos;
    }
}

class Point{
    constructor(pos){
        this.pos = pos;
        this.name = "point";
    }

    update(pos){
        this.pos = pos;
    }
}

function isColliding(obj1, obj2){
    if (obj1.name == "sphere" && obj2.name == "sphere"){
        return sphereSphere(obj1, obj2);
    }
    if (obj1.name == "sphere" && obj2.name == "point"){
        return spherePoint(obj1, obj2);
    }
    if (obj1.name == "point" && obj2.name == "sphere"){
        return spherePoint(obj2, obj1);
    }
}

function sphereSphere(s1, s2){
    if (myMV.distance(s1.pos, s2.pos) < (s1.radius + s2.radius)){
        return true;
    }
    return false;
}

function spherePoint(s, c){
    if (myMV.distance(s.pos, c.pos) < s.radius){
        return true;
    }
    return false;
}