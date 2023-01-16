

var canvas, gl, program;
var _camera;
var _mouse;
var _keyboard;
var _icos;



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

    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();
    _icos = new Icosahedron();
    _icos.initPoints();
    console.log(_icos.triangle(1,4,9));
    console.log(_icos.points);
    console.log(flatten(_icos.points));
    console.log(flatten(_icos.colours));

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(_icos.points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(_icos.colours), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    render();
}


function render() {

 
    projectionMatrix = _camera.getPerspectiveMatrix();


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, _icos.numVertices);

    processInput();

    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    requestAnimFrame(render);
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
