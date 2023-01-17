

var canvas, gl;

var meteoriteProgram;
var backgroundProgram;
var sunProgram;
var hudProgram;

var _camera;
var _mouse;
var _keyboard;
var _m;
var _background;
var _sun;
var _hudArrow;


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
    meteoriteProgram = initShaders(gl, "meteorite-vert", "meteorite-frag");
    backgroundProgram = initShaders(gl, "background-vert", "background-frag");
    sunProgram = initShaders(gl, "sun-vert", "sun-frag");
    hudProgram = initShaders(gl, "hud-vert", "hud-frag");


    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();

    _m = new Meteorite();
    _sun = new Sun();
    _hudArrow = new HudArrow();

    _background = new Quad();
    _background.init(vec4(-1,-1,2,2));

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    _m.setVel(vec3(5,0,0));
    _m.setScale(4);
    _m.setAmbientLightDirection(_sun.pos);

    render();
}

function gameLoop(){
    processInput();
    render();

    frameDone();
    requestAnimationFrame(gameLoop);
}

function frameDone(){
    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    _m.frameDone();
    _sun.frameDone();
}

function render(){
    renderBackground();
    renderSun();
    renderMeteorites();
    renderHud();
}

function renderMeteorites() {
 
    gl.useProgram(meteoriteProgram);

    let projectionMatrix = _camera.getPerspectiveMatrix();
    let modelViewMatrix = _m.getModelViewMatrix();

    let projectionMatrixLoc = gl.getUniformLocation(meteoriteProgram, "projectionMatrix");
    let modelViewMatrixLoc = gl.getUniformLocation(meteoriteProgram, "modelViewMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    _m.draw();
}

function renderSun(){
    gl.useProgram(sunProgram);

    let projectionMatrix = _camera.getPerspectiveMatrixNoTranslate();

    let sunProjectionMatrixLoc = gl.getUniformLocation(sunProgram, "projectionMatrix");

    gl.uniformMatrix4fv(sunProjectionMatrixLoc, false, flatten(projectionMatrix));

    _sun.draw();
}

function renderBackground(){

    gl.useProgram(backgroundProgram);

    let sunLookDirection = _sun.pos;
    let cameraLookDirection = _camera.getLookDirectionVector();
    let vec3CameraLookDirection = vec3(cameraLookDirection[0],cameraLookDirection[1],cameraLookDirection[2]);

    let angleLoc = gl.getUniformLocation(backgroundProgram, "angle");

    let dotProduct = dot(sunLookDirection, vec3CameraLookDirection);
    let angle = Math.acos(dotProduct / (length(sunLookDirection) * length(vec3CameraLookDirection)));  

    gl.uniform1f(angleLoc, angle);
    _background.draw(backgroundProgram);
}

function renderHud(){
    gl.useProgram(hudProgram);

    _hudArrow.draw(hudProgram);
}

function processInput(){
    _camera.followMouse(_mouse.getMousePos());

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
