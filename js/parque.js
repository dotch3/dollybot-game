var dollyApp = {};
var pq_tam_x = 1200,
    pq_tam_y = 1200,
    tam_dolly_x = 240,
    tam_dolly_y = 249,
    speed = oldspeed = 10,
    textNivel,
    ground,
    dollybot,
    fundoParque,
    messageFinal,
    score = 0,
    scoreText, finishText, styleTexts,
    capangas, message,
    arma, armaCapanga,
    fireButton,
    max, min = 400,
    flagCollision = true,
    lives = 1,
    livesText, countHits = 0,
    limitHits = 1,
    limitCapangas = 20,
    limitBoxes = 20;

var explode, disparo, killBox, killCapanga, fundoMusical;

dollyApp.parque = function() {};
dollyApp.parque.prototype = {
    preload: function() {
        console.log('Parque  Inicial');
        game.load.spritesheet('dollyboy', 'assets/dollybotSheet.png', tam_dolly_x, tam_dolly_y);
        game.load.image('parque', 'assets/parque.png');
        game.load.image('capanga', 'assets/capanga.png');
        game.load.image('box', 'assets/block.png');
        game.load.spritesheet('ground', 'assets/ground.png', 250, 100);
        game.load.spritesheet('message', 'assets/message.png', 250, 153);
        game.load.image('escada', 'assets/escada.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('bulletCapanga', 'assets/bulletCapanga.png', 150, 150);
        //Musicas
        game.load.audio('explode', 'assets/audio/SoundEffects/explode.wav');
        game.load.audio('boxKilled', 'assets/audio/SoundEffects/boxKilled.wav');
        game.load.audio('capangaKilled', 'assets/audio/SoundEffects/capangaKilled.wav');
        game.load.audio('disparo', 'assets/audio/SoundEffects/disparo.wav');
        game.load.audio('explosion', 'assets/audio/SoundEffects/explosion.mp3');
        game.load.audio('fundoMusical', 'assets/audio/SoundEffects/dollybot.mp3');
        game.load.audio('battle', 'assets/audio/SoundEffects/battle.mp3');
        game.load.audio('pusher', 'assets/audio/SoundEffects/pusher.wav');


    },
    create: function() {
        console.log('create Parque');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 11000, 1100);
        game.stage.backgroundColor = '#435c04';
        addChangeStateEventListeners();
        fundoParque = game.add.sprite(0, 0, 'parque');
        fundoParque.scale.setTo(1, 1);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Musica:
        explode = game.add.audio('explode');
        disparo = game.add.audio('disparo');
        boxKilled = game.add.audio('boxKilled');
        capangaKilled = game.add.audio('capangaKilled');
        fundoMusical = game.add.audio('fundoMusical');
        battle = game.add.audio('battle');
        pusher = game.add.audio('pusher');
        sounds = [explode, disparo, boxKilled, capangaKilled, fundoMusical, battle, pusher];
        game.sound.setDecodedCallback(sounds, start, this);



        plataformas = game.add.group();
        plataformas.enableBody = true;

        for (var i = 0; i < 3; i++) {
            game.physics.arcade.enable(plataformas);
            console.log(`piso: ${game.world.height}`);
            // ground = plataformas.create(900, 600, 'ground '); //test

            if (i == 1) {
                ground = plataformas.create(800, game.world.height - 50, 'ground');

            } else { ground = plataformas.create(Math.floor(Math.random() * (game.world.width - 400)) + 400, game.world.height - 50, 'ground'); }
            // ground = plataformas.create(0, game.world.height - 200, 'ground');
            ground.scale.setTo(2, 1);
            ground.body.immovable = true;
            game.physics.arcade.enable(ground);
            ground.animations.add('brilhar', [0, 1, 2, 3]);
            ground.body.collideWorldBounds = true

        }

        escada = game.add.sprite(10000, 950, 'escada'); //final
        game.physics.enable(escada, Phaser.Physics.ARCADE);
        escada.scale.setTo(0.5, 0.5);
        escada.enableBody = true;
        escada.body.immovable = true;

        // Ajustes dos pontos de inicio do dollybot:
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.enable(dollybot, Phaser.Physics.ARCADE);

        //Centrar a imagen no centro dela mesma
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = game.world.height - tam_dolly_y;
        dollybot.scale.setTo(0.5, 0.5);
        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 300;
        dollybot.body.collideWorldBounds = true;
        // Animando a imagem com spritesheet
        dollybot.animations.add('rodar', [0, 1, 2, 3, 4]);
        //Animacoes adicionais
        // dollybot.animations.add('left', [0, 1, 2, 3, ]);
        // dollybot.animations.add('right', [4, 5, 6, 7, ]);

        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
        // game.camera.deadzone = new Phaser.Rectangle(200, 350, 800, 600);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //Textos.

        styleTexts = { font: "bold 32px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        // var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };

        textNivel = game.add.text(game.scale.width / 2, 100, "ENCONTRO NO PARQUE", styleTexts);
        textNivel.anchor.set(0.5);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;
        textNivel.cameraOffset.setTo(game.scale.width / 2 + 250, 50);
        // screen size: game.scale.width - game.scale.height.

        let stylesLives = { font: "bold 32px Arial", fill: "#1f4ecf", boundsAlignH: "center", boundsAlignV: "middle" }
        livesText = game.add.text(80, 100, 'Vidas: ' + lives, stylesLives);
        livesText.fixedToCamera = true;
        livesText.anchor.set(0.5);
        livesText.setShadow(3, 3, '#fafafa', 2);

        finishText = game.add.text(game.scale.width / 2, 100, "JOGO\nFinal Score: " + score + "\nClick para reiniciar", { font: "bold 64px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" });

        finishText.anchor.set(0.5);
        finishText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        finishText.fixedToCamera = true;
        finishText.cameraOffset.setTo(game.scale.width / 2, game.scale.height / 2);
        finishText.visible = false;

        createItems();

        //Message
        messageFinal = game.add.sprite(10250, 800, 'message');
        game.physics.arcade.enable([dollybot, escada, messageFinal]);
        messageFinal.anchor.setTo(0.5, 0.5);
        messageFinal.scale.setTo(1.2, 1.2);
        messageFinal.body.immovable = true;
        messageFinal.animations.add('brilhar', [0, 1, 2, 3]);

        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function() {

        var hittingPlataforma = game.physics.arcade.collide(dollybot, plataformas);
        var hittingEscada = game.physics.arcade.collide(dollybot, escada);
        game.physics.arcade.collide(dollybot, boxes, collisionBox, null, this);
        // game.physics.arcade.collide(dollybot, boxes, hitBoxes, null, this);

        game.physics.arcade.overlap(arma.bullets, capangas, killOjects, null, this);
        game.physics.arcade.overlap(dollybot, capangas, collisionCapanga, null, this);
        game.physics.arcade.overlap(dollybot, messageFinal, hitMessageFinal, null, this);
        game.physics.arcade.overlap(boxes, arma.bullets, killOjects, null, this);
        game.physics.arcade.overlap(arma.bullets, boxes, killOjects, null, this);

        game.physics.arcade.collide(dollybot, escada, hitEscada, null, this);
        game.physics.arcade.collide(dollybot, plataformas, onPlataforma, null, this);
        game.physics.arcade.collide(capangas, plataformas);
        game.physics.arcade.collide(capangas, escada);
        game.physics.arcade.collide(dollybot, messageFinal);
        game.physics.arcade.collide(boxes, dollybot);

        messageFinal.animations.play('brilhar');
        livesText.text = 'VIDAS: ' + lives;
        // capanga.x = -speed;
        if (cursors.right.isDown) {
            dollybot.scale.setTo(0.5, 0.5);
            dollybot.x += speed;
            arma.fireAngle = Phaser.ANGLE_RIGHT;
            arma.trackSprite(dollybot, 50, 0, false);

            //Rodando
            dollybot.animations.play('rodar', 12, true);
        } else if (cursors.left.isDown) {
            // utilizando valor negativo para rotar imagem em sentido inverso
            dollybot.scale.setTo(-0.5, 0.5);
            dollybot.x -= speed;
            dollybot.animations.play('rodar', 12, true);
            arma.fireAngle = Phaser.ANGLE_LEFT;
            arma.trackSprite(dollybot, -50, 0, false);
        } else {
            dollybot.animations.stop('rodar');
            dollybot.frame = 0;
        }
        if (cursors.up.isDown && dollybot.body.touching.down && hittingPlataforma || cursors.up.isDown && dollybot.body.blocked.down) {
            dollybot.animations.play('rodar', 12, true);
            dollybot.body.velocity.y = -250;
            if (dollybot.y <= game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2)) {
                dollybot.y = game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2);
                console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
            }
        }

        if (spaceKey.isDown && dollybot.body.blocked.down || spaceKey.isDown && hittingPlataforma || spaceKey.isDown && hittingEscada) {
            console.log('jump');
            //Change the color and throw bullet
            dollybot.animations.play('rodar', 12, true);
            dollybot.body.velocity.y = -350;
        }
        if (fireButton.isDown) {
            console.log('arma disparada');
            arma.fire();
            disparo.play();
        }
    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, game.scale.width - 400, 20);
        arma.debug;

    }
};

function start() {
    console.log("Musica");
    fundoMusical.play();
}

function createItems() {
    console.log('criando items para parque');
    //Capangas
    capangas = game.add.group();
    capangas.enableBody = true;
    createNewCapanga();

    //Boxes
    boxes = game.add.physicsGroup();
    boxes.enableBody = true;
    createBox();

    //Arma
    arma = game.add.weapon(100, 'bullet');
    arma.bulletAngleOffSet = -180;
    arma.bulletSpeed = 800;
    arma.fireRate = 150;
    arma.bulletAngleVariance = 5;
    arma.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    arma.bulletKillDistance = 500;
    arma.trackSprite(dollybot, 50, 0, false);
    arma.fireAngle = Phaser.ANGLE_RIGHT
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);


    //  The score
    scoreText = game.add.text(16, 16, 'PONTOS: 0', styleTexts);
    scoreText.fixedToCamera = true;
    scoreText.setShadow(3, 3, '#fafafa', 2)

    //bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
}

function onPlataforma(player, plataforma) {
    let oldSpeed = speed;
    plataforma.animations.play('brilhar');
    if (!player.hasOverlapped && !plataforma.hasOverlapped) {
        player.hasOverlapped = plataforma.hasOverlapped = true;
        console.log('overlapped')
        speed = speed + 5;
        player.y -= 80;
        fundoMusical.play();
        game.time.events.add(Phaser.Timer.SECOND * 1, function() {
            speed = oldSpeed;
        }, this);
        player.hasOverlapped = false;

    } else {
        player.hasOverlapped = false;
        speed = oldSpeed;
    }

}

function createBox() {
    let randX = (Math.floor(Math.random() * (game.scale.width - 400) + 400));
    let randY = (Math.floor(Math.random() * (game.scale.height) / 2) - dollybot.body.height) + 100;
    let posX = dollybot.x + randX;
    let posY = randY;
    console.log(`Novo box criado ${posX}: ${posY}, limite:${limitBoxes}`)
    var box = boxes.create(posX, posY, 'box');
    game.physics.enable(box, Phaser.Physics.ARCADE);
    box.enableBody = true;

    //  Let gravity do its thing
    box.body.gravity.y = 500;
    box.body.collideWorldBounds = true;
    //  This just gives each star a slightly random bounce value
    box.body.bounce.y = 0.1 + Math.random() * 0.4;
    if (limitBoxes > 0) {
        limitBoxes--;
        queueItems(game.rnd.integerInRange(2, 5), 'createBox', limitBoxes);
    }
}

function createNewCapanga() {

    // capanga.x = (Math.floor(Math.random() * (max - min)) + min);
    // capanga.x = (Math.floor(Math.random() * (game.scale.width - 400)) + 100);
    let randX = (Math.floor(Math.random() * (game.scale.width - 400) + 400));
    let randY = (Math.floor(Math.random() * (game.scale.height) / 2) - 400) + 100;
    let posX = dollybot.x + randX;
    let posY = dollybot.y + randY;
    console.log(`posicao do capanga x:${randX} y:${randY}, posX: ${posX}, posY ${posY} - game(width): ${game.scale.width} dolly.width: ${dollybot.x} game(height): ${game.scale.height}`);
    capanga = capangas.create(posX, posY, 'capanga');

    capanga.body.collideWorldBounds = true;
    capanga.body.blocked, down = true;
    capanga.scale.setTo(0.6, 0.6);

    capanga.body.gravity.y = 700;
    capanga.body.bounce.y = 0.1 + Math.random() * 0.5;
    // capanga.x = -speed;
    //Arma capanga
    armaCapanga = game.add.weapon(100, 'bulletCapanga');
    // armaCapanga.bulletAngleOffSet = -180;
    armaCapanga.bulletSpeed = 200;
    armaCapanga.fireRate = 450;
    armaCapanga.bulletAngleVariance = 5;
    armaCapanga.bulletKillDistance = 200;
    armaCapanga.bulletKillType = Phaser.Weapon.KILL_DISTANCE;

    armaCapanga.trackSprite(capanga, -5, 10, false);
    armaCapanga.trackOffset.y = 50

    if (limitCapangas > 0) {
        queueItems(game.rnd.integerInRange(2, 10), 'createNewCapanga', limitCapangas);
        limitCapangas--;
    }
}

function queueItems(tempo, itemFunction, limitItem) {
    console.log(`tempo pra prox item ${tempo}  - parque`);
    switch (String(itemFunction)) {
        case "createBox":
            game.time.events.add(Phaser.Timer.SECOND * tempo, function() {
                createBox();
            }, this);
            console.log(`Limit Boxes - ${limitItem}`);
            break;
        case "createNewCapanga":
            game.time.events.add(Phaser.Timer.SECOND * tempo, function() {
                createNewCapanga();
            }, this);
            console.log(`Limit Capangas - ${limitItem}`);
            break;
    }
}

function hitBoxes(bullet, box) {
    console.log('hitBoxes');
    box.tint = 0xff00ff;
    bullet.tint = 0xff00ff;
    //Musica
    boxkilled.play();
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        console.log('testing');
        box.destroy();
        box.kill();
    }, this);
    box.tint = 0xffffff;
    bullet.tint = 0xffffff;

}

function killOjects(bullet, objeto) {
    console.log('Killing objetos');
    objeto.tint = 0xff00ff;
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        console.log('testing');
        objeto.destroy();
    }, this);
    boxKilled.play();
    objeto.kill();
    objeto.destroy();
    //Bullets
    bullet.kill();
    // bullet.destroy();
    score += 10;
    console.log(`Score : ${score}`)
    scoreText.text = 'PONTOS: ' + score;
}

function hitEscada(dollybot, escada) {
    console.log('escada');
    dollybot.tint = 0x80ffbf;
}

function collisionBox(player, box) {
    console.log('box e player collision');

    if (!player.hasOverlapped && !box.hasOverlapped) {
        player.hasOverlapped = box.hasOverlapped = true;
        console.log('overlapped')
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            score = score - 10;
            scoreText.text = 'Score: ' + score;
            countHits++;
            explode.play();
            if (countHits >= limitHits) {
                lives--;
            }
        }, this);

    } else {
        player.tint = 0xf000df;
        box.tint = 0xff00ff;
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            box.tint = 0xffffff;
            player.tint = 0xffffff;
            box.kill();
            countHits++;
        }, this);

        scoreText.text = 'Score: ' + score;
    }
}

function collisionCapanga(dollybot, capanga) {
    // dollybot e capanga mudam de cor
    console.log(`vidas restantes:  ${lives}`);
    if (!dollybot.hasOverlapped && !capanga.hasOverlapped) {
        dollybot.hasOverlapped = capanga.hasOverlapped = true;
        console.log('atropelhando ao capanga');
        capanga.tint = 0xff00ff;
        dollybot.tint = 0xff00ff;
        timer = game.time.now;
        game.time.events.add(Phaser.Timer.SECOND * 2, function() {
            capanga.tint = 0xffffff;

            if (lives <= 0) {
                console.log("R.I.P dollybot");

                dollybot.kill();
                capangas.callAll('kill');
                boxes.callAll('kill');
                battle.play();

                finishText.text = " GAME OVER \n Click to restart";
                finishText.visible = true;

                // "click to restart" handler
                game.input.onTap.addOnce(restart, this);

            } else {
                countHits++;
                if (countHits >= limitHits) {
                    lives--;
                }
            }

        }, this);
    } else {
        dollybot.tint = 0xf000df;
        capanga.tint = 0xff00ff;
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            dollybot.tint = 0xffffff;
            capanga.tint = 0xffffff;

            capanga.kill();
        }, this);
    }

    livesText.text = 'VIDAS: ' + lives;

}


function hitMessageFinal(dollybot, message) {
    console.log('Message Final');
    fundoParque.tint = 0x80ffbf;
    dollybot.tint = 0xffffff;
    move(dollybot);
    game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture(message), this);
    //animacion de final
    message.destroy();

}

function move(dollybot) {
    console.log('move');
    dollybot.tint = 0xffffff;
    dollybot.body.move = true;
    // dollybot.enableUpdate = true
    // dollybot.animations.play('run', 15, true);
    // dollybot.animations.play('rodar', 12, true);
    textNivel.setText("Missão cumprida!")
    dollybot.body.velocity.x = 800;
    //Sleep a bit and call the next state
    game.time.events.add(Phaser.Timer.SECOND * 5, nextPhase('fabrica'), this);
    game.state.start('fabrica');

}

function nextPhase(stateName) {
    console.log('nova fase: ' + stateName);
    game.state.start(stateName);
};

function fadePicture(message) {

    game.add.tween(message).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    // message.destroy()

}

function restart() {

    lives = 3;
    boxes.removeAll();
    capangas.removeAll();
    createItems();

    //revives the player
    dollybot.revive();
    //hides the text
    finishText.visible = false;

}

function changeState(i, stateName) {
    console.log('Fase: ' + stateName);
    game.state.start(stateName);
}

function addKeyCallback(key, fn, args) {
    game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);
}

//Cambia de Fase segundo o numero ingressado. #testes
function addChangeStateEventListeners() {
    addKeyCallback(Phaser.Keyboard.ONE, changeState, 'parque');
    addKeyCallback(Phaser.Keyboard.TWO, changeState, 'fabrica');
    addKeyCallback(Phaser.Keyboard.THREE, changeState, 'arcade');

}