///*** MOUSE HANDLING ***///

class Mouse {
    constructor() {

        this.previousX = 0;
        this.previousY = 0;

        this.currentX = 0;
        this.currentY = 0;

        this.timeClicked = Date.now();
        this.timeBetweenClicks = 0;
        this.clicked = false;

        this.frameStart = true;
        this.anyChangeThisFrame = false; //to stop it from keeping the last change value

        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
        document.addEventListener("click", this.handleMouseClick.bind(this))
    }
  
    handleMouseMove(event) { //need to change so average over 10 frames as so fast that change is 0
        //only do stuff when locked
        if (document.pointerLockElement != canvas) {
            return;
        }
        this.currentX += event.movementX;
        this.currentY += event.movementY;

        if (this.currentX < -canvas.width * 0.5){
            this.currentX = -canvas.width * 0.5;
        }
        if (this.currentX > canvas.width * 0.5){
            this.currentX = canvas.width * 0.5;
        }
        if (this.currentY < -canvas.height * 0.5){
            this.currentY = -canvas.height * 0.5;
        }
        if (this.currentY > canvas.height * 0.5){
            this.currentY = canvas.height * 0.5;
        }
    }
  
    handleMouseClick(){
        //only do stuff when locked
        if (document.pointerLockElement != canvas) {
            return;
        }
        this.timeBetweenClicks = (Date.now() - this.timeClicked) * 0.001;
        this.timeClicked = Date.now();
        this.clicked = true;
    }

    frameDone() { //call every frame
        this.previousX = this.currentX;
        this.previousY = this.currentY;
    }
  
    getMouseChange() {
        return {x: this.currentX - this.previousX, y: this.currentY - this.previousY};
    }

    getMousePos(){
        return {x: this.currentX, y:this.currentY};
    }

    getMousePosVecFromTL(){
        return vec2(this.currentX + (canvas.width * 0.5), this.currentY + (canvas.height * 0.5));
    }

    getTimeBetweenClicks(){
        return this.timeBetweenClicks;
    }
}
  

///*** KEYBOARD HANDLING ***///

//values for bitwise operations
//1st & 2nd bit denotes whether down or not, 2nd and 3rd bits denotes whether just pressed or just released
const NOT_DOWN = 0b1000;
const JUST_RELEASED = 0b1100;
const DOWN = 0b0010;
const JUST_PRESSED = 0b0011;

class Keyboard{

    constructor(){
       this.keyMap = new Map(); //tracks keys

        //set up listeners
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    
    //given key and test (down, just released, just pressed .... ) returns true if key is down/just_released/..... false otherwise
    keyTest(key, testAgainst){
        //deal with undefined keys (not yet pressed so not in map)
        let k = this.keyMap.get(key);
        if (k == undefined) { k = NOT_DOWN; }

        //test
        return (k & testAgainst) == testAgainst; 
    }


    frameDone(){
        //update keymap
        for (let key of this.keyMap.keys()) {
            if (this.keyMap.get(key) == JUST_PRESSED){
                this.keyMap.set(key, DOWN);
            }else if(this.keyMap.get(key) == JUST_RELEASED){
                this.keyMap.set(key, NOT_DOWN);
            }
        }
    }

    handleKeyDown(event){
        //only do stuff when locked
        if (document.pointerLockElement != canvas) {
            return;
        }
        if (this.keyMap.get(event.key) == DOWN){ 
            return;
        }
        this.keyMap.set(event.key, JUST_PRESSED);
    }
    handleKeyUp(event){
        //only do stuff when locked
        if (document.pointerLockElement != canvas) {
            return;
        }
        this.keyMap.set(event.key, JUST_RELEASED);
    }
}