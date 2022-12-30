

keyMap = new Map(); //tracks keys
//values for bitwise operations
//1st & 2nd bit denotes whether down or not, 2nd and 3rd bits denotes whether just pressed or just released
const NOT_DOWN = 0b1000;
const JUST_RELEASED = 0b1100;
const DOWN = 0b0010;
const JUST_PRESSED = 0b0011;

function getKey(key){ if (keyMap.get(key) == undefined){ return NOT_DOWN; } else {return keyMap.get(key); }} //deals with keys that have never been pressed
function keyTest(key, testAgainst){ return (getKey(key) & testAgainst) == testAgainst; }

///*** actual input processing ***///

function updateKeymap(){
    //update keymap
    for (key of keyMap.keys()) {
        if (keyMap.get(key) == JUST_PRESSED){
            keyMap.set(key, DOWN);
        }else if(keyMap.get(key) == JUST_RELEASED){
            keyMap.set(key, NOT_DOWN);
        }
    }
}

function setUpListeners(){
    //set up event listeners
    window.addEventListener('keydown', function(e) {
        if (keyMap.get(e.key) == DOWN){ 
            return;
        }
        keyMap.set(e.key, JUST_PRESSED);
    });
    window.addEventListener('keyup', function(e) {
        keyMap.set(e.key, JUST_RELEASED);
    });
    
}