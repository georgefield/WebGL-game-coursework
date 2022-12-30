var gl;
var points;

const QUIT = 0;
const PLAY = 1;
const PAUSE = 2;

window.onload = function init() {

    let gameState = PLAY;

    let canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas); //what webgl-utils is needed for
    if (!gl) {
        alert("WebGL isn't available");
    }

    var vColor = new Float32Array(
    [1.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    1.0,1.0,0,
    0.0, 1.0, 1.0,
    1.0, 1.0, 0.0,
    1.0,0.0,1.0
    ]);

    //configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.3, 0.5, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    q1 = new Quad(0.0, 0.0, 1, 1);
    // Load the data into the GPU
    bufferQuad(program, q1, "vPosition");
    bufferDataToAttrib(program, "vColor", vColor, 3, gl.FLOAT);

    setUpListeners();

    gameLoop();
};

function gameLoop(){
    processInput();
    render(6);

    requestAnimFrame(gameLoop);
}

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

    updateKeymap()
}