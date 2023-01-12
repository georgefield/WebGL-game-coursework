

var canvas, gl, program;
var _camera;
var _mouse;
var _keyboard;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

// RGBA colors
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(1.0, 1.0, 1.0, 1.0), // white
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 2.0;
var BASE_WIDTH = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH = 0.5;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var near = 3.5;
var far = 100.0;


var fovy = 120.0; // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0; // Viewport aspect ratio

var theta = [0, 0, 0];


var modelViewMatrixLoc;
var projectionMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(a, b, c, d) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}


//--------------------------------------------------


window.onload = function init() {

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

    colorCube();

    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("slider2").onchange = function(event) {
        theta[1] = event.target.value;
    };
    document.getElementById("slider3").onchange = function(event) {
        theta[2] = event.target.value;
    };



    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    //projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);

    /// *** Changed Code HERE
    //projectionMatrix = _camera.getPerspectiveMatrix();

    render();
}

//----------------------------------------------------------------------------


function base() {
    var s = scalem(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.2 * BASE_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scalem(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function lowerArm() {
    var s = scalem(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function render() {

 
    projectionMatrix = _camera.getPerspectiveMatrix();


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrix = rotate(theta[Base], 0, 1, 0);
    ///

    base();


    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, 0, 1));
    lowerArm();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT * 1.8, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 0, 1));
    upperArm();

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));


    processInput();

    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    requestAnimFrame(render);
}

function processInput(){
    _camera.followMouse(_mouse.getMouseChange());

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
