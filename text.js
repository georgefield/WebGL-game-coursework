var text = {

    start: undefined,
    objective: undefined,
    crashed: undefined,
    spacestationDestroyed: undefined,
    nextLevel: undefined,
    win: undefined,

    init: function(){
        this.start = document.getElementById("start");
        this.objective = document.getElementById("objective");

        this.crashed = document.getElementById("crashed");
        this.spacestationDestroyed = document.getElementById("spacestationDestroyed");
        this.nextLevel = document.getElementById("nextLevel");
        this.win = document.getElementById("win");

        this.hideAll();
    },

    hideAll: function(){
        this.hideText(this.start);
        this.hideText(this.objective);

        this.hideText(this.crashed);
        this.hideText(this.spacestationDestroyed);
        this.hideText(this.nextLevel);
        this.hideText(this.win);
    },

    showText: function(textObj){
        textObj.style.display = "block";
    },

    hideText: function(textObj){
        textObj.style.display = "none";
    },
}