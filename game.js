var gl;
var points;

const QUIT = 0;
const PLAY = 1;
const PAUSE = 2;

window.onload = function init() {

    gameState = PLAY;

    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas); //what webgl-utils is needed for
    if (!gl) {
        alert("WebGL isn't available");
    }

    var vertices = new Float32Array(
	[-0.5, -0.5,
	-0.5, 0.5,
	0.5, 0.5,
	]);

    var vColor = new Float32Array(
    [1.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    1.0,1.0,0
    ]);

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.3, 0.5, 1.0);
    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    bufferDataToAttrib(program, "vPosition", vertices, 2, gl.FLOAT);
    bufferDataToAttrib(program, "vColor", vColor, 3, gl.FLOAT);

    window.addEventListener('keydown', function(e) {
        if (keyMap.get(e.key) == DOWN){ 
            return;
        }
        keyMap.set(e.key, JUST_PRESSED);
    });

    window.addEventListener('keyup', function(e) {
        keyMap.set(e.key, JUST_RELEASED);
    });

    gameLoop();
};

function gameLoop(){
    processInput();
    render();

    requestAnimFrame(gameLoop);
}

keyMap = new Map(); //tracks keys
//values for bitwise operations
//1st & 2nd bit denotes whether down or not, 2nd and 3rd bits denotes whether just pressed or just released
const NOT_DOWN = 0b1000;
const JUST_RELEASED = 0b1100;
const DOWN = 0b0010;
const JUST_PRESSED = 0b0011;

function getKey(key){ if (keyMap.get(key) == undefined){ return NOT_DOWN; } else {return keyMap.get(key); }} //deals with keys that have never been pressed
function keyTest(key, testAgainst){ return (getKey(key) & testAgainst) == testAgainst; }
function processInput(){
    //do stuff with inputs
    if (keyTest("Enter", JUST_PRESSED)){
        console.log("Enter just pressed");
    }
    if (keyTest("Enter", JUST_RELEASED)){
        console.log("Enter just released");
    }
    if (keyTest("Enter", NOT_DOWN)){
        console.log("Enter not down");
    }
    if (keyTest("Enter", DOWN)){
        console.log("Enter down");
    }

    //update keymap
    for (key of keyMap.keys()) {
        if (keyMap.get(key) == JUST_PRESSED){
            keyMap.set(key, DOWN);
        }else if(keyMap.get(key) == JUST_RELEASED){
            keyMap.set(key, NOT_DOWN);
        }
    }
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw a triangles starting from index 0 and 
    // using 3 indices 
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}