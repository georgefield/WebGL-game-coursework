//useful function used in player.js aswell for the projectiles
//when objects are destroyed the value object.erase is set to true
//this function, when given an array of objects, will remove all the objects that have been erased
//used for projectiles & meteorites
function removeErasedObjectsFromArray(array){
    //remove destroyed meteorites
    let removeIndices = []
    for (let i = 0; i < array.length; i++){
        if (array[i].erase){
            removeIndices.push(i);
        }
    }

    if (removeIndices.length >= 1){
        //have to go backwards to avoid changing index of the next to be removed
        for (let i = removeIndices.length - 1; i >= 0; i--){
            array.splice(removeIndices[i], 1);
        }
    }
}

//realised meteorites too close after typing in all the values needed to create this function
var meteoriteDistanceScale = 1.5;
function scaleMeteoriteDistance(meteoriteArray){
    for (let i = 0; i < meteoriteArray.length; i++){
        meteoriteArray[i].pos = scale(meteoriteDistanceScale, meteoriteArray[i].pos);
    }
}

//display level num and prompt of how to return to menu
function displayLevelNum(){
    text.showText(text.levelNum);
    text.setText(text.levelNum, "Level " +  + (_levelCounter + 1));
    setTimeout(function(){
        text.setText(text.levelNum, "Press 'm' to return to menu");
        setTimeout(function(){
            text.hideAll();
        },
        1500)
    },
    1500)
}

//levels have different number of meteorites, meteorite location, meteorite speed, and background changes by changing the sun properties
//level should get harder (increase number of meteorites as you go up)
var level1 = {

    meteoriteArray: [],
    spaceStation: undefined,
    meteoriteSpeed: 12,
    sunPosition: vec3(-300,200,-300),

    start: function(){
        displayLevelNum();
        
        _sun.pos = this.sunPosition;
        _sun.colour = vec4(0.95,1,0.7,1);
 
        _camera.setAmbientLightDirection(_sun.pos);

        this.meteoriteArray = [];
        this.spaceStation = new Spacestation();

        //level 1
        this.meteoriteArray.push(new Meteorite(vec3(100, -300, -60), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(-250, -30, 140), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(-130, -260, -90), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(190, 50, 220), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(50, 120, -150), this.spaceStation, this.meteoriteSpeed, 9));

        scaleMeteoriteDistance(this.meteoriteArray);
    },

    frameDone: function(){
        //remove destroyed meteorites
        removeErasedObjectsFromArray(this.meteoriteArray);

        //update meteorites
        for (let i =0; i < this.meteoriteArray.length; i++){
            this.meteoriteArray[i].frameDone();
        }
        //update spacestation
        this.spaceStation.frameDone();
    }
}

// level 2 ----------

var level2 = {

    meteoriteArray: [],
    spaceStation: undefined,
    meteoriteSpeed: 15,
    sunPosition: vec3(375,200,-50),

    start: function(){
        displayLevelNum();

        _sun.pos = this.sunPosition; 
        _sun.colour = vec4(0.9,0.95,1,1);

        _camera.setAmbientLightDirection(_sun.pos);

        this.meteoriteArray = [];
        this.spaceStation = new Spacestation();

        //level 2
        this.meteoriteArray.push(new Meteorite(vec3(100, -100, -60), this.spaceStation, this.meteoriteSpeed, 6));
        this.meteoriteArray.push(new Meteorite(vec3(-150, -40, 90), this.spaceStation, this.meteoriteSpeed, 6));
        this.meteoriteArray.push(new Meteorite(vec3(-130, -260, -90), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(190, 50, 220), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(140, 290, -230), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(-380, 20, -20), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(0, 150, 180), this.spaceStation, this.meteoriteSpeed, 9));

        scaleMeteoriteDistance(this.meteoriteArray);
    },

    frameDone: function(){
        //remove destroyed meteorites
        removeErasedObjectsFromArray(this.meteoriteArray);

        //update meteorites
        for (let i =0; i < this.meteoriteArray.length; i++){
            this.meteoriteArray[i].frameDone();
        }
        //update spacestation
        this.spaceStation.frameDone();
    }
}

/// level 3 ----------

var level3 = {

    meteoriteArray: [],
    spaceStation: undefined,
    meteoriteSpeed: 18,
    sunPosition: vec3(30,0,-450),

    start: function(){
        displayLevelNum();

        _sun.pos = this.sunPosition; 
        _sun.colour = vec4(1,0.5,0.5,1);

        _camera.setAmbientLightDirection(_sun.pos);

        this.meteoriteArray = [];
        this.spaceStation = new Spacestation();

        //level 3
        this.meteoriteArray.push(new Meteorite(vec3(-170, 150, 60), this.spaceStation, this.meteoriteSpeed, 5));
        this.meteoriteArray.push(new Meteorite(vec3(210, -30, 180), this.spaceStation, this.meteoriteSpeed, 5));
        this.meteoriteArray.push(new Meteorite(vec3(-130, -270, 90), this.spaceStation, this.meteoriteSpeed, 6));
        this.meteoriteArray.push(new Meteorite(vec3(190, 0, -300), this.spaceStation, this.meteoriteSpeed, 6));
        this.meteoriteArray.push(new Meteorite(vec3(130, -180, 240), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(-180, 20, -310), this.spaceStation, this.meteoriteSpeed, 7));
        this.meteoriteArray.push(new Meteorite(vec3(0, -300, 0), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(280, -200, 40), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(0, 250, 80), this.spaceStation, this.meteoriteSpeed, 9));

        scaleMeteoriteDistance(this.meteoriteArray);
    },

    frameDone: function(){
        //remove destroyed meteorites
        removeErasedObjectsFromArray(this.meteoriteArray);

        //update meteorites
        for (let i =0; i < this.meteoriteArray.length; i++){
            this.meteoriteArray[i].frameDone();
        }
        //update spacestation
        this.spaceStation.frameDone();
    }
}