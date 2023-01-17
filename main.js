

var canvas, gl, program;
var _camera;
var _mouse;
var _keyboard;
var _m;

var projectionMatrixLoc;
var modelViewMatrixLoc;


window.onload = function run(){
    initSystems();
    gameLoop();
}

function initSystems(){

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();
    _m = new Meteorite();

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    _m.setVel(vec3(5,0,0));
    _m.setScale(4);

    render();
}

function gameLoop(){
    processInput();
    render();

    requestAnimationFrame(gameLoop);
}


function render() {
 
    let projectionMatrix = _camera.getPerspectiveMatrix();
    let modelViewMatrix = _m.getModelViewMatrix();

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    _m.draw();

    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    _m.frameDone();
}

function processInput(){
    _camera.setAzEl(_mouse.getMousePos());

    let movementVel = getMovementVelocity();
    _camera.setVelLocal(movementVel[0], movementVel[1], movementVel[2]);
}

const _movementSpeed = 15;
function getMovementVelocity(){
    let vel = new vec3(0);
    if (_keyboard.keyTest("w",DOWN)){
        vel[2] += 1;
    }

    if (_keyboard.keyTest("s",DOWN)){
        vel[2] -= 1;
    }

    if (_keyboard.keyTest("a",DOWN)){
        vel[0] += 1;
    }

    if (_keyboard.keyTest("d", DOWN)){
        vel[0] -= 1;
    }

    //normalise so strafing has no benefit. then scale to movement speed
    if (length(vel) != 0){
        normalize(vel);
        vel = scale(_movementSpeed, vel);
    }

    return vel;
}
