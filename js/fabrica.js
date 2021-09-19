var plataformas, dollybot, stars, score = 0,
    scoreText,
    cursors,
    vel = 300;

dollyApp.fabrica = function() { console.log('Fabrica stage'); };
dollyApp.fabrica.prototype = {

    preload: function() {
        console.log('preload');
        game.load.image('sky', '../assets/sky.png');
        game.load.image('ground', '../assets/fundo.png');
        game.load.image('star', '../assets/star.png');
        game.load.spritesheet('dollyboy', '../assets/dollyboy.png', 150, 154);
    },

    create: function() {
        console.log('create');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 2400, 900);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        addChangeStateEventListeners();
        game.add.sprite(0, 0, 'sky');
        plataformas = game.add.group();
        plataformas.enableBody = true;
        console.log(`çriando o ground: ${game.world.height}`);
        var ground = plataformas.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(4, 2);
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = plataformas.create(950, 1350, 'ground');

        ledge.body.immovable = true;

        ledge = plataformas.create(-50, 900, 'ground');

        ledge.body.immovable = true;

        ledge = plataformas.create(650, 400, 'ground');

        ledge.body.immovable = true;

        // The dollybot and its settings
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.arcade.enable(dollybot);

        //  dollybot physics properties. Give the little guy a slight bounce.
        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 300;
        dollybot.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        dollybot.animations.add('left', [0, 1, 2, 3], 10, true);
        dollybot.animations.add('right', [5, 6, 7, 8], 10, true);

        //Camera
        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //  Finally some stars to collect
        stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;


        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '64px', fill: '#000' });

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();



        //Textos.
        var style = { font: "bold 64px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        textNivel = game.add.text(game.world.width / 2, 0, "NIVEL1", style);
        textNivel.anchor.set(0.1);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(tam_dolly_x, textNivel.y, 400, 200);
        bar.anchor.set(0.9);



    },

    update: function() {
        // console.log('update');
        var hitPlatform = game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(stars, plataformas)
        game.physics.arcade.overlap(dollybot, stars, collectStar, null, this);

        //  Reset the dollybots velocity (movement)
        dollybot.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            dollybot.body.velocity.x = -vel;

            dollybot.animations.play('left');
        } else if (cursors.right.isDown) {
            //  Move to the right
            dollybot.body.velocity.x = vel;

            dollybot.animations.play('right');
        } else {
            //  Stand still
            dollybot.animations.stop();

            dollybot.frame = 4;
        }

        //  Allow the dollybot to jump if they are touching the ground.
        if (cursors.up.isDown && dollybot.body.touching.down && hitPlatform) {
            dollybot.body.velocity.y = -450;
        }



    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, tam_dolly_x, textNivel.y * 2);

    }

}

function collectStar(dollybot, star) {

    // Removes the star from the screen
    star.kill();

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

}