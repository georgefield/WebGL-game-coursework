//text namespace for handling the displaying of the css divs and the appropriate time
var text = {

    start: undefined,
    objective: undefined,
    crashed: undefined,
    spacestationDestroyed: undefined,
    nextLevel: undefined,
    win: undefined,
    levelNum: undefined,

    init: function(){ //gets all the element ids and hides all the divs to start
        this.start = document.getElementById("start");
        this.objective = document.getElementById("objective");

        this.crashed = document.getElementById("crashed");
        this.spacestationDestroyed = document.getElementById("spacestationDestroyed");
        this.nextLevel = document.getElementById("nextLevel");
        this.win = document.getElementById("win");

        this.levelNum = document.getElementById("levelNum");
        this.hideAll();
    },

    hideAll: function(){
        this.hideText(this.start);
        this.hideText(this.objective);

        this.hideText(this.crashed);
        this.hideText(this.spacestationDestroyed);
        this.hideText(this.nextLevel);
        this.hideText(this.win);

        this.hideText(this.levelNum);
    },

    showText: function(textObj){
        textObj.style.display = "block";
    },

    hideText: function(textObj){
        textObj.style.display = "none";
    },

    setText: function(textObj, text){ //needed for levelNum
        textObj.innerHTML = text;
    }
}