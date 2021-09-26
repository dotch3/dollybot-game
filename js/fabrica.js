var plataformas,
    dollybot,
    stars,
    score = 0,
    cursors,
    vel = 300,
    style, jump,
    arma,
    currentNivel = 2,
    lives = 1,
    finishText,
    fundoFactory,
    amigosCapturados;

dollyApp.fabrica = function() {};
dollyApp.fabrica.prototype = {

    preload: function() {
        console.log('Fabrica stage');
        game.load.image('fundoFactory', 'assets/factory.png');
        game.load.image('ground', 'assets/fundo.png');
        game.load.image('apple', 'assets/apple.png');
        game.load.image('box', 'assets/block.png');
        game.load.spritesheet('dollyboy', 'assets/dollybotSheet.png', 240, 249);
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('personagens', 'assets/dollyAmigos.png')
    },

    create: function() {
        console.log('create');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1200, 1200);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        addChangeStateEventListeners();
        fundoFactory = game.add.sprite(0, 0, 'fundoFactory');
        fundoFactory.scale.setTo(1, 1);
        plataformas = game.add.group();
        plataformas.enableBody = true;
        console.log(`çriando o ground: ${game.world.height}`);
        var ground = plataformas.create(0, game.world.height - 50, 'ground');
        ground.scale.setTo(1, 1);
        ground.body.immovable = true;
        var plataforma = plataformas.create(450, 950, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(1, 0.5);

        plataforma = plataformas.create(750, 750, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(1, 0.5);

        plataforma = plataformas.create(950, 600, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(1, 0.5);


        plataforma = plataformas.create(-250, 450, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(1, 0.5);

        plataforma = plataformas.create(950, 250, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(1, 0.5);

        plataforma = plataformas.create(-20, 210, 'ground');
        plataforma.body.immovable = true;
        plataforma.scale.setTo(0.7, 0.2);

        // Ajustes dos pontos de inicio do dollybot:
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.enable(dollybot, Phaser.Physics.ARCADE);
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.scale.setTo(0.5, 0.5);
        //  dollybot physics properties. Give the little guy a slight bounce.
        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 300;
        dollybot.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        dollybot.animations.add('left', [0, 1, 2, 3, 4], 10, true);
        dollybot.animations.add('right', [4, 5, 6, 7], 10, true);

        //Camera
        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


        apples = game.add.group();
        apples.enableBody = true;


        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var apple = apples.create(i * 70, 0, 'apple');

            //  Let gravity do its thing
            apple.body.gravity.y = 300;

            //  This just gives each apple a slightly random bounce value
            apple.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        finishText = game.add.text(game.scale.width / 2, 100, "JOGO\nFinal Score: " + score + "\nClick para reiniciar", { font: "bold 64px Arial", fill: "#fafafa", boundsAlignH: "center", boundsAlignV: "middle" });

        finishText.anchor.set(0.5);
        finishText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        finishText.fixedToCamera = true;
        finishText.cameraOffset.setTo(game.scale.width / 2, game.scale.height / 2);
        finishText.visible = false;
        createItems();
        //Textos.
        style = { font: "bold 28px Arial", fill: "#1f4ecf", boundsAlignH: "center", boundsAlignV: "middle" };
        textNivel = game.add.text(game.world.width / 2, 10, "RESGATA AOS AMIGUINHOS ", style);
        textNivel.anchor.set(0.1);
        textNivel.setShadow(3, 3, '#fafafa', 2);
        textNivel.fixedToCamera = true;

        let stylesLives = { font: "bold 32px Arial", fill: "#1f4ecf", boundsAlignH: "center", boundsAlignV: "middle" }
        livesText = game.add.text(80, 100, 'Vidas: ' + lives, stylesLives);
        livesText.fixedToCamera = true;
        livesText.anchor.set(0.5);
        livesText.setShadow(3, 3, '#fafafa', 2);

        cursors = game.input.keyboard.createCursorKeys();
        jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        if (limitCapangas < 10 && limitBoxes < 10) {

            textNivel.text = "NIVEL " + currentNivel;

        }

        personagens = game.add.sprite(100, 150, 'personagens');
        game.physics.arcade.enable(personagens);
        personagens.anchor.setTo(0.5, 0.5);
        personagens.scale.setTo(0.7, 0.7);
        personagens.body.immovable = true;

    },

    update: function() {
        // console.log('update');
        var hittingPlataforma = game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(apples, plataformas)
        game.physics.arcade.collide(capangas, plataformas);
        game.physics.arcade.collide(boxes, plataformas);
        game.physics.arcade.collide(dollybot, boxes, collisionBox, null, this);
        game.physics.arcade.collide(dollybot, capangas, collisionCapanga, null, this);
        game.physics.arcade.collide(dollybot, hitPersonagens, collisionCapanga, null, this);

        game.physics.arcade.overlap(dollybot, apples, collectApples, null, this);
        game.physics.arcade.overlap(arma.bullets, boxes, killOjects, null, this);
        game.physics.arcade.overlap(arma.bullets, capangas, killOjects, null, this);
        game.physics.arcade.collide(boxes, dollybot);
        game.physics.arcade.overlap(dollybot, personagens, hitPersonagens, null, this);

        //  Reset the dollybots velocity (movement)
        dollybot.body.velocity.x = 0;
        livesText.text = 'VIDAS: ' + lives;
        if (cursors.left.isDown) {
            //  Move to the left
            dollybot.scale.setTo(-0.5, 0.5);
            dollybot.body.velocity.x = -vel;
            dollybot.animations.play('left', 12, true);
            arma.fireAngle = Phaser.ANGLE_LEFT;
            arma.trackSprite(dollybot, -50, 0, false);


            dollybot.animations.play('left');
        } else if (cursors.right.isDown) {
            //  Move to the right
            dollybot.body.velocity.x = vel;
            dollybot.scale.setTo(0.5, 0.5);
            dollybot.animations.play('right');
            arma.fireAngle = Phaser.ANGLE_RIGHT;
            arma.trackSprite(dollybot, -50, 0, false);
        } else {
            //  Stand still
            dollybot.animations.stop();

            dollybot.frame = 4;
        }

        //  Allow the dollybot to jump if they are touching the ground.
        if (cursors.up.isDown && dollybot.body.touching.down && hittingPlataforma) {
            dollybot.body.velocity.y = -450;
        }
        if (jump.isDown && dollybot.body.blocked.down || jump.isDown && hittingPlataforma) {
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
        //game.debug.spriteInfo(dollybot, tam_dolly_x, textNivel.y * 2);

    }

};

function hitPersonagens(dollybot, personagens) {
    console.log('Personagens Final');
    fundoFactory.tint = 0x80ffbf;
    dollybot.tint = 0xffffff;
    // move(dollybot);
    finishText.text = " YOU WON!!";
    finishText.visible = true;
    // game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture(personagens), this);
    //animacion de final

}

function collectApples(dollybot, apple) {
    // Removes the apple from the screen
    score = score + 10;
    scoreText.text = 'PONTOS: ' + score;
    apple.kill();

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