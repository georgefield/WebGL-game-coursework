class Mouse {
    constructor() {

        this.previousX = 0;
        this.previousY = 0;

        this.currentX = 0;
        this.currentY = 0;

        this.frameStart = true;
        this.anyChangeThisFrame = false; //to stop it from keeping the last change value

        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }
  
    handleMouseMove(event) { //need to change so average over 10 frames as so fast that change is 0 
        this.currentX = event.clientX;
        this.currentY = event.clientY;
    }
  
    frameDone() { //call every frame
        this.previousX = this.currentX;
        this.previousY = this.currentY;
    }
  
    getMouseChange() {
        return {x: this.currentX - this.previousX, y: this.currentY - this.previousY};
    }
}
  