var canvas, gl;

//glsl programs
var meteoriteProgram;
var backgroundProgram;
var sunProgram;
var hudProgram;
var projectileProgram;
var spacestationProgram;

//other globals
var _camera;
var _mouse;
var _keyboard;

var _background;
var _sun;
var _hudArrow;
var _menuMeteorite;

var _level;
var _levels;
var _levelCounter;

var _gameState = "menu";

var _sunFlareAmount;

var _spacestationSTL;

window.onload = function run(){
    initSystems();
    gameLoop();
}

function initSystems(){

    //load spacestation
    var spacestationSTL = document.getElementById("spacestationSTL");
    if ( !spacestationSTL ) { 
        alert("Unable to load space station obj file");
        return -1;
    }
    _spacestationSTL = spacestationSTL.text;

    //setup canvas and webGl
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    //init glsl programs
    meteoriteProgram = initShaders(gl, "meteorite-vert", "meteorite-frag");
    backgroundProgram = initShaders(gl, "background-vert", "background-frag");
    sunProgram = initShaders(gl, "sun-vert", "sun-frag");
    hudProgram = initShaders(gl, "hud-vert", "hud-frag");
    projectileProgram = initShaders(gl, "projectile-vert", "projectile-frag");
    spacestationProgram = initShaders(gl, "spacestation-vert", "spacestation-frag");

    //init classes
    _camera = new Camera();
    _mouse = new Mouse();
    _keyboard = new Keyboard();

    _sun = new Sun();
    _hudArrow = new HudArrow();
    _hudPointer = new HudPointer();
    _background = new Quad2D(vec4(-1,-1,2,2));
    _menuMeteorite = new Meteorite(vec3(9, -14, -25), undefined, 0, 5);
    _menuMeteorite.spin = vec3(2,-1.2,3);

    //lock cursor to canvas on click
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    //what levels to include and init the counter
    _levelCounter = 0;
    _levels = [level1,level2,level3];

    text.init();
}

function gameLoop(){

    if (_gameState == "playing"){
        processInput();
        collisions();
        gameRender();
        checkForWinLose();
    }
    else if (_gameState == "menu"){
        menu();
    }
    else if (_gameState == "wait"){
        _gameState = "do nothing"; //stop 1 billion set timeout functions being called
        setTimeout(function(){
            text.hideAll();
            player.reset();
            player.frameDone();

            _level.start();

            _gameState = "playing";
        },
        1400);
    }
    else if (_gameState == "next level"){
        //increment level
        _levelCounter += 1;
        //test for if win
        if (_levelCounter >= _levels.length){
            player.win();
        }
        else{
            text.showText(text.nextLevel);
            _level = _levels[_levelCounter];
            _gameState = "wait";
        }
    }
    else if (_gameState != "do nothing"){
        if (_gameState == "space station destroyed"){
            text.showText(text.spacestationDestroyed)
        }
        else if (_gameState == "player dead"){
            text.showText(text.crashed);
        }
        _gameState = "wait";
    }

    frameDone();
    requestAnimationFrame(gameLoop);
}

//keep timing between all systems
function frameDone(){

    if (_gameState == "playing"){
        _level.frameDone();
    }

    _menuMeteorite.frameDone();
    _hudPointer.frameDone();
    player.frameDone();
    _camera.frameDone();
    _mouse.frameDone();
    _keyboard.frameDone();
    _sun.frameDone();
}

function processInput(){
    _camera.addAzEl(_mouse.getMousePos());

    let acceleration = player.getAcceleration();
    _camera.setAccLocal(acceleration);

    if (_mouse.clicked){
        _mouse.clicked = false; //reset
        if (Date.now() - player.lastTimeFired > 250){ //only fire once every 250 ms
            player.fire();
        }
    }

    if (_keyboard.keyTest("m", JUST_PRESSED)){
        _gameState = "menu";
    }
}

function collisions(){
    for (let  i = 0; i < _level.meteoriteArray.length; i++){
        //meteorite hits space station
        let meteorite = _level.meteoriteArray[i];
        if (meteorite.timeDestroyed == undefined && _level.spaceStation.checkCollidingWith(meteorite.collisionModel)){
            meteorite.timeDestroyed = Date.now();
            _level.spaceStation.timeDestroyed = Date.now();
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
        if (_level.spaceStation.checkCollidingWith(player.projectiles[j].collisionModel)){
            player.projectiles[j].erase = true;
        }
    }

    //player hits space station
    if (_level.spaceStation.checkCollidingWith(player.collisionModel)){
        player.isDead = true;
    }
}

function checkForWinLose(){
    if (_level.spaceStation.erase == true){
        _gameState = "space station destroyed";
    }
    if (player.isDead == true){
        _gameState = "player dead";
    }
    if (_level.meteoriteArray.length == 0){
        _gameState = "next level";
    }
}

function menu(){

    text.showText(text.start);
    text.showText(text.objective);

    text.showText(text.levelNum);
    text.setText(text.levelNum, "(You are on level " + (_levelCounter + 1) + ")");

    _camera.setAzEl(vec2(0,0));
    _camera.setPos(vec3(0,0,0));
    _sun.pos = vec3(250,250,-300);
    _camera.setAmbientLightDirection(_sun.pos);

    menuRender();
    if (_mouse.clicked){
        _mouse.clicked = false;
        console.log(_mouse.getMousePosVecFromTL());
        if (myMV.distance(_mouse.getMousePosVecFromTL(), vec2(160,130)) < 70){ //click near enough to start html         
            text.hideAll();

            _mouse.currentX = 0;
            _mouse.currentY = 0;

            _level = _levels[_levelCounter];
            player.reset();

            _level.start();

            _gameState = "playing";
        }
    }
}