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
    scoreText,
    capangas, message,
    arma, armaCapanga,
    fireButton,
    max, min = 400,
    flagCollision = true;

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


        cursors = game.input.keyboard.createCursorKeys();

        // Ajustes dos pontos de inicio do dollybot:
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.enable(dollybot, Phaser.Physics.ARCADE);



        //Centrar a imagen no centro dela mesma
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = game.world.height - tam_dolly_y;

        dollybot.scale.setTo(0.5, 0.5);
        dollybot.body.gravity.y = 450;

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

        var styleTexts = { font: "bold 32px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        // var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };

        textNivel = game.add.text(game.scale.width / 2, 100, "ENCONTRO NO PARQUE", styleTexts);
        textNivel.anchor.set(0.5);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;
        textNivel.cameraOffset.setTo(game.scale.width / 2 + 250, 50);


        // screen size: game.scale.width - game.scale.height.



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

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);



        //Message
        messageFinal = game.add.sprite(10250, 800, 'message');
        game.physics.arcade.enable([dollybot, escada, messageFinal]);
        messageFinal.anchor.setTo(0.5, 0.5);
        messageFinal.scale.setTo(1.2, 1.2);
        messageFinal.body.immovable = true;
        messageFinal.animations.add('brilhar', [0, 1, 2, 3]);

        //  The score
        scoreText = game.add.text(16, 16, 'PONTOS: 0', styleTexts);
        scoreText.fixedToCamera = true;

        //bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;


    },
    update: function() {

        var hittingPlataforma = game.physics.arcade.collide(dollybot, plataformas);
        var hittingEscada = game.physics.arcade.collide(dollybot, escada);
        game.physics.arcade.collide(dollybot, boxes, collisionBoxes, null, this);
        // game.physics.arcade.collide(dollybot, boxes, hitBoxes, null, this);

        game.physics.arcade.overlap(arma.bullets, capangas, killOjects, null, this);
        game.physics.arcade.overlap(dollybot, capangas, hitCapanga, null, this);
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
        // capanga.x = -speed;
        if (cursors.right.isDown) {
            dollybot.scale.setTo(0.5, 0.5);
            dollybot.x += speed;
            arma.fireAngle = Phaser.ANGLE_RIGHT;

            //Rodando
            dollybot.animations.play('rodar', 12, true);
        } else if (cursors.left.isDown) {
            // utilizando valor negativo para rotar imagem em sentido inverso
            dollybot.scale.setTo(-0.5, 0.5);
            dollybot.x -= speed;
            dollybot.animations.play('rodar', 12, true);
            arma.fireAngle = Phaser.ANGLE_LEFT;
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
        }
    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, 50, 50);
        arma.debug;

    }
};

function onPlataforma(player, plataforma) {
    let oldSpeed = speed;
    plataforma.animations.play('brilhar');
    if (!player.hasOverlapped && !plataforma.hasOverlapped) {
        player.hasOverlapped = plataforma.hasOverlapped = true;
        console.log('overlapped')
        speed = speed + 5;
        player.y -= 80;
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
    //  Create a star inside of the 'stars' group
    // var box = boxes.create(Math.floor(Math.random() * (max - min)) + min, 0, 'box');
    var box = boxes.create(Math.floor(Math.random() * 500) + 200, 0, 'box');
    game.physics.enable(box, Phaser.Physics.ARCADE);
    box.enableBody = true;

    //  Let gravity do its thing
    box.body.gravity.y = 300;
    box.body.collideWorldBounds = true;
    //  This just gives each star a slightly random bounce value
    box.body.bounce.y = 0.1 + Math.random() * 0.4;
}

function createNewCapanga() {

    // capanga.x = (Math.floor(Math.random() * (max - min)) + min);
    let rand = (Math.floor(Math.random() * (400 - 150)) + 150);
    let posX = dollybot.x + rand;
    capanga = capangas.create(posX, 0, 'capanga');

    capanga.body.collideWorldBounds = true;
    capanga.body.blocked, down = true;
    capanga.scale.setTo(0.6, 0.6);

    capanga.body.gravity.y = 300;
    capanga.body.bounce.y = 0.1 + Math.random() * 0.5;
    capanga.x = -speed;
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

    // timing
    // queueCapanga(game.rnd.integerInRange(2500, 5000));
}

function queueCapanga(tempo) {
    console.log(`tempo pra prox capanaguita ${tempo}`);
    // game.time.addOnce(time, createNewCapanga); // add a timer that gets called once, then auto disposes to create a new enemy after the time given
    // game.time.events.add(Phaser.Timer.SECOND * time, createNewCapanga, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, createNewCapanga, this);
}

function collisionBoxes(player, box) {
    console.log('box e player collision');
    if (!player.hasOverlapped && !box.hasOverlapped) {
        player.hasOverlapped = box.hasOverlapped = true;
        console.log('overlapped')
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            score = score - 10;
            scoreText.text = 'Score: ' + score;
        }, this);

    } else {
        player.tint = 0xf000df;
        box.tint = 0xff00ff;
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            box.tint = 0xffffff;
            player.tint = 0xffffff;
            box.kill();
        }, this);

        scoreText.text = 'Score: ' + score;
    }
}

function hitBoxes(bullet, box) {
    console.log('hitBoxes');
    box.tint = 0xff00ff;
    bullet.tint = 0xff00ff;
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
    objeto.kill();
    objeto.destroy();
    //Bullets
    bullet.kill();
    score += 10;
    console.log(`Score : ${score}`)
    scoreText.text = 'Score: ' + score;
}

function hitEscada(dollybot, escada) {
    console.log('escada');
    dollybot.tint = 0x80ffbf;
}

function hitCapanga(dollybot, capanga) {
    // dollybot e capanga mudam de cor
    console.log('capanga atingido');
    capanga.tint = 0xff00ff;
    dollybot.tint = 0xff00ff;
    timer = game.time.now;
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        capanga.tint = 0xffffff;
    }, this);

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

function changeState(i, stateName) {
    console.log('Fase: ' + stateName);
    game.state.start(stateName);
}

function addKeyCallback(key, fn, args) {
    game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);
}

//Cambia de Fase segundo o numero ingressado. #testes
function addChangeStateEventListeners() {
    addKeyCallback(Phaser.Keyboard.ZERO, changeState, 'parque');
    addKeyCallback(Phaser.Keyboard.ONE, changeState, 'cidade');
    addKeyCallback(Phaser.Keyboard.TWO, changeState, 'parqueComObstaculos');
    addKeyCallback(Phaser.Keyboard.THREE, changeState, 'fabrica');
    addKeyCallback(Phaser.Keyboard.THREE, changeState, 'jogo');

}

//Extension do phaser