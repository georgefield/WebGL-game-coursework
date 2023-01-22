var canvas, gl;

//glsl programs
var meteoriteProgram;
var backgroundProgram;
var sunProgram;
var hudProgram;
var projectileProgram;

var _camera;
var _mouse;
var _keyboard;

var _background;
var _sun;
var _hudArrow;

var _level;
var _levels;
var _levelCounter;

var _projectileArray = [];

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

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    //
    //  Load shaders and initialize attribute buffers
    //
    meteoriteProgram = initShaders(gl, "meteorite-vert", "meteorite-frag");
    backgroundProgram = initShaders(gl, "background-vert", "background-frag");
    sunProgram = initShaders(gl, "sun-vert", "sun-frag");
    hudProgram = initShaders(gl, "hud-vert", "hud-frag");
    projectileProgram = initShaders(gl, "projectile-vert", "projectile-frag");


    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();

    _sun = new Sun();
    _camera.setAmbientLightDirection(_sun.pos);
    _hudArrow = new HudArrow();
    _background = new Quad2D(vec4(-1,-1,2,2));

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    _levelCounter = 0;
    _level = level1;
    _levels = [level1, level2];
    _levels[0].start();
}

function gameLoop(){
    let gameState = getGameState();
    if (gameState == "playing"){
        processInput();
        collisions();
        render();

        frameDone();
    }
    else{
        player.reset();
        if (gameState == "next level"){
            _levelCounter += 1;
            if (_levelCounter >= 2){ //only 2 levels
                win();
            }
            _level = _levels[_levelCounter];
            _level.start();
        }
        else if(gameState == "space station destroyed"){
            _level.start();
        }
        else if (gameState == "player dead"){
            //pause for 2 seconds
            _level.start();
        }
        
    }
    
    requestAnimationFrame(gameLoop);
}

function frameDone(){
    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    _sun.frameDone();
    _level.frameDone();
    player.frameDone();
}

function render(){
    renderBackground();
    renderSun();
    renderHud();
    renderProjectiles();
    renderMeteorites();
}

function renderMeteorites() {

    gl.useProgram(meteoriteProgram);

    for (let  i = 0; i < _level.meteoriteArray.length; i++){
        _level.meteoriteArray[i].draw();
    }

    _level.spaceStation.draw();
}

function renderSun(){
    gl.useProgram(sunProgram);

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

function renderProjectiles(){
    gl.useProgram(projectileProgram);

    for (let i =0; i < player.projectiles.length; i++){
        player.projectiles[i].draw();
    }
}

function processInput(){
    _camera.addAzEl(_mouse.getMousePos());

    let acceleration = player.getAcceleration();
    _camera.setAccLocal(acceleration);

    if (_mouse.clicked){
        _mouse.clicked = false; //reset
        player.fire();
    }
}

function collisions(){
    for (let  i = 0; i < _level.meteoriteArray.length; i++){
        //meteorite hits space station
        let meteorite = _level.meteoriteArray[i];
        if (meteorite.timeDestroyed == undefined && isColliding(meteorite.collisionModel, _level.spaceStation.object.collisionModel)){
            meteorite.timeDestroyed = Date.now();
            _level.spaceStation.object.timeDestroyed = Date.now();
        }

        //player hits meteorite
        if (isColliding(meteorite.collisionModel, player.collisionModel)){
            player.isDead = true;
        }

        //projectile hits meteorite
        for (let j = 0; j < player.projectiles.length; j++){
            if (meteorite.timeDestroyed == undefined && isColliding(meteorite.collisionModel, player.projectiles[j].collisionModel)){
                meteorite.timeDestroyed = Date.now();
                player.projectiles[j].erase = true;
            }
        }
    }

    //projectile hits space station
    for (let j = 0; j < player.projectiles.length; j++){
        if (isColliding(_level.spaceStation.object.collisionModel, player.projectiles[j].collisionModel)){
            player.projectiles[j].erase = true;
        }
    }

    //player hits space station
    if (isColliding(_level.spaceStation.object.collisionModel, player.collisionModel)){
        console.log("dead");
        player.isDead = true;
    }
}

function getGameState(){
    if (_level.spaceStation.object.erase == true){
        return "space station destroyed";
    }
    if (player.isDead == true){
        return "player dead";
    }
    if (_level.meteoriteArray.length == 0){
        return "next level";
    }

    return "playing";
}