//not sure where to put this function, used in player.js aswell
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

// level 1 ----------

var level1 = {

    meteoriteArray: [],
    spaceStation: undefined,
    meteoriteSpeed: 10,

    start: function(){
        this.meteoriteArray = [];
        this.spaceStation = new Spacestation();

        //level 1
        this.meteoriteArray.push(new Meteorite(vec3(100, -400, -60), this.spaceStation, this.meteoriteSpeed, 6));
        this.meteoriteArray.push(new Meteorite(vec3(-250, -30, 140), this.spaceStation, this.meteoriteSpeed, 5));
        this.meteoriteArray.push(new Meteorite(vec3(-130, -260, -90), this.spaceStation, this.meteoriteSpeed, 3));
        this.meteoriteArray.push(new Meteorite(vec3(190, 50, 220), this.spaceStation, this.meteoriteSpeed, 4));
        this.meteoriteArray.push(new Meteorite(vec3(140, 190, -230), this.spaceStation, this.meteoriteSpeed, 4));
        this.meteoriteArray.push(new Meteorite(vec3(-380, 20, -20), this.spaceStation, this.meteoriteSpeed, 8));
        this.meteoriteArray.push(new Meteorite(vec3(0, 250, 280), this.spaceStation, this.meteoriteSpeed, 4));
    },

    frameDone: function(){
        //remove destroyed meteorites
        removeErasedObjectsFromArray(this.meteoriteArray);

        //update meteorites
        for (let i =0; i < this.meteoriteArray.length; i++){
            this.meteoriteArray[i].frameDone();
        }
        //update spacestation
        this.spaceStation.object.frameDone();
    }
}

/// level 2 ----------

var level2 = {

    meteoriteArray: [],
    spaceStation: undefined,
    meteoriteSpeed: 15,

    start: function(){
        this.spaceStation = new Spacestation();

        //level 2
        this.meteoriteArray.push(new Meteorite(vec3(-200, 200, 60), this.spaceStation, this.meteoriteSpeed, 9));
        this.meteoriteArray.push(new Meteorite(vec3(210, -30, 180), this.spaceStation, this.meteoriteSpeed, 4));
        this.meteoriteArray.push(new Meteorite(vec3(-130, -270, 90), this.spaceStation, this.meteoriteSpeed, 2));
        this.meteoriteArray.push(new Meteorite(vec3(190, 0, -300), this.spaceStation, this.meteoriteSpeed, 4));
        this.meteoriteArray.push(new Meteorite(vec3(130, -180, 240), this.spaceStation, this.meteoriteSpeed, 3));
        this.meteoriteArray.push(new Meteorite(vec3(-180, 20, -310), this.spaceStation, this.meteoriteSpeed, 5));
        this.meteoriteArray.push(new Meteorite(vec3(0, 450, 0), this.spaceStation, this.meteoriteSpeed, 3));
        this.meteoriteArray.push(new Meteorite(vec3(280, -200, 40), this.spaceStation, this.meteoriteSpeed, 2));
        this.meteoriteArray.push(new Meteorite(vec3(0, 250, 280), this.spaceStation, this.meteoriteSpeed, 5));
    },

    frameDone: function(){
        //remove destroyed meteorites
        removeErasedObjectsFromArray(this.meteoriteArray);

        //update meteorites
        for (let i =0; i < this.meteoriteArray.length; i++){
            this.meteoriteArray[i].frameDone();
        }
        //update spacestation
        this.spaceStation.object.frameDone();
    }
}