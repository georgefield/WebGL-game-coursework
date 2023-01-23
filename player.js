var player = {};

player.collisionModel = new Point(vec3(0,0,0));
player.projectiles = [];
player.projectilePositions = []; //sent to shaders for lighting info
player.isDead = false;
player.lastTimeFired = 0;


player.maximumMovementSpeed = 25;
player.accelerationSpeed = 35; //how fast the ship will accelerate in units/second
player.getAcceleration = function(){
    let acc = new vec3(0);
    if (_keyboard.keyTest("w",DOWN)){
        acc[2] += 1;
    }
    if (_keyboard.keyTest("s",DOWN)){
        acc[2] -= 1;
    }
    if (_keyboard.keyTest("a",DOWN)){
        acc[0] += 1;
    }
    if (_keyboard.keyTest("d", DOWN)){
        acc[0] -= 1;
    }


    //normalise so strafing has no benefit. then scale to movement speed
    if (length(acc) != 0){
        normalize(acc);
        acc = scale(player.accelerationSpeed, acc);
    }

    return acc;
}

//fire projectile direction you are looking
player.fire = function(){
    player.lastTimeFired = Date.now();

    let projectile = new Projectile();

    let lookVector = vec3(_camera.getLookDirectionVector());
    let posOffset = scale(3,lookVector);
    posOffset[2] = -posOffset[2];//z flips ???

    projectile.vel = scale(150,lookVector);
    projectile.pos = add(new vec3(-_camera.pos[0],-_camera.pos[1],-_camera.pos[2]), posOffset);
    projectile.vel[2] = -projectile.vel[2]; //z flips ???

    projectile.rotation = new vec3(-_camera.el, -_camera.az, 0);
    //not sure why the signs are so messed up for the maths

    player.projectiles.push(projectile);
}

player.frameDone = function(){
    for (let i = 0; i < player.projectiles.length; i++){
        player.projectiles[i].frameDone();
    }

    removeErasedObjectsFromArray(player.projectiles);
    player.collisionModel.update(negate(_camera.pos));

    //update projectile positions array
    player.projectilePositions = player.getProjectilePositionsArray();
}

player.reset = function(){
    player.isDead = false;
    _camera.pos = vec3(0,0,0);
    _camera.vel = vec3(0,0,0);
}

player.win = function(){
    text.showText(text.win);
    //wait for 2.5 second then go to menu
    if (_gameState != "do nothing"){
        _gameState = "do nothing";
        setTimeout(function(){
            text.hideAll();
            _levelCounter = 0; //reset levels

            _gameState = "menu";
        },
        2500);
    }
}

player.getProjectilePositionsArray = function(){
    let ret = [];
    for (let i = 0; i < this.projectiles.length; i++){
        ret.push(this.projectiles[i].pos);
    }
    return ret;
}