var player = {};

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

player.collisionModel = new Point(vec3(0,0,0));
player.projectiles = [];
player.isDead = false;

player.fire = function(){
    let projectile = new Projectile();

    let lookVector = vec3(_camera.getLookDirectionVector());
    let posOffset = scale(3,lookVector);
    posOffset[2] = -posOffset[2];

    projectile.vel = scale(100,lookVector);
    projectile.pos = add(new vec3(-_camera.pos[0],-_camera.pos[1],-_camera.pos[2]), posOffset);
    projectile.vel[2] = -projectile.vel[2]; //z flips ???

    projectile.rotation = new vec3(-_camera.el, -_camera.az, 0);

    player.projectiles.push(projectile);
}

player.frameDone = function(){
    for (let i = 0; i < player.projectiles.length; i++){
        player.projectiles[i].frameDone();
    }

    removeErasedObjectsFromArray(player.projectiles);
    player.collisionModel.update(negate(_camera.pos));
}

player.reset = function(){
    player.isDead = false;
    _camera.pos = vec3(0,0,0);
    _camera.vel = vec3(0,0,0);
}

player.win = function(){
    text.showText(text.win);
    //wait for 2 second then go to menu
    if (_gameState != "win"){
        _gameState = "win";
        setTimeout(function(){
            text.hideAll();
            _levelCounter = 0; //reset levels

            _gameState = "menu";
        },
        2500);
    }
}