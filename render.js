
function gameRender(){
    //render functions use correct program and then draw object
    renderBackground();
    renderSun();
    renderHud();
    renderProjectiles();
    renderMeteorites();
    renderSpacestation();
}

function menuRender(){
    renderBackground();
    renderSun();
    renderPointer();

    //1 meteorite for aesthetics
    gl.useProgram(meteoriteProgram);
    _menuMeteorite.draw();
}

function renderMeteorites(){

    gl.useProgram(meteoriteProgram);

    for (let  i = 0; i < _level.meteoriteArray.length; i++){
        _level.meteoriteArray[i].draw();
    }
}

function renderSun(){
    gl.useProgram(sunProgram);

    _sun.draw();
}

function renderBackground(){ //not handled by its own class so much bigger render function

    gl.useProgram(backgroundProgram);

    //sun flare amount calculation
    let sunLookDirection = _sun.pos;
    let cameraLookDirection = _camera.getLookDirectionVector();
    //flip z for some reason, have to do it everywhere idk why
    let vec3CameraLookDirection = vec3(cameraLookDirection[0],cameraLookDirection[1],-cameraLookDirection[2]);

    let dotProduct = dot(sunLookDirection, vec3CameraLookDirection);
    let angle = Math.acos(dotProduct / (length(sunLookDirection) * length(vec3CameraLookDirection)));

    let normalisedAngle1Minus = 1.0 - (Math.abs(angle) / 3.1415);
    _sunFlareAmount = normalisedAngle1Minus * normalisedAngle1Minus * normalisedAngle1Minus;

    let sunFlareAmountLoc = gl.getUniformLocation(backgroundProgram, "sunFlareAmount");
    gl.uniform1f(sunFlareAmountLoc, _sunFlareAmount);

    //sun colour (to flare to faded version of)
    let sunColorLoc = gl.getUniformLocation(backgroundProgram, "sunColor");
    gl.uniform4fv(sunColorLoc, _sun.colour);

    _background.draw(backgroundProgram);
}

function renderHud(){
    gl.useProgram(hudProgram);

    _hudArrow.draw();
    _hudCrosshair.draw();
}

function renderPointer(){
    gl.useProgram(hudProgram);

    _hudPointer.draw();
}

function renderProjectiles(){
    gl.useProgram(projectileProgram);

    for (let i =0; i < player.projectiles.length; i++){
        player.projectiles[i].draw();
    }
}

function renderSpacestation(){
    gl.useProgram(spacestationProgram);
    
    _level.spaceStation.draw();
}