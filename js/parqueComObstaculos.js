var dollyApp = {};
var cursors,
    tam_dolly_x = 150,
    tam_dolly_y = 154,
    speed = 200,
    dollybot,
    textNivel,
    score = 0,
    scoreText,
    apples;


dollyApp.parqueComObstaculos = function() { console.log('Parque com obstaculos'); };
dollyApp.parqueComObstaculos.prototype = {
    preload: function() {
        console.log('preload');
        // imagens 
        game.load.image('apple', '../assets/apple.png');
        game.load.image('parqueFundo', '../assets/fundos/parque.png');
        game.load.image('pisoBase', '../assets/pisoBase.png');
        game.load.spritesheet('dollybot', '../assets/dollybot.png', tam_dolly_x, tam_dolly_y);

    },
    create: function() {
        console.log('create');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        addChangeStateEventListeners();
        game.world.setBounds(0, 0, 800, 1200);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.add.sprite(0, 0, 'parqueFundo')

        console.log(`criando os grupos: ${game.world.height}`);

        //Grupos
        apples = game.add.group();
        plataformas = game.add.group();

        apples.enableBody = true;
        plataformas.enableBody = true;

        var pisoBase = plataformas.create(0, game.world.height - 250, 'pisoBase');
        pisoBase.scale.setTo(2.2);
        pisoBase.body.immovable = true;

        //mapa
        // dollybot = game.add.sprite(tam_dolly_x, tam_dolly_y, 'robot');
        game.physics.arcade.enable(dollybot);

        // dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x * 2;
        dollybot.y = tam_y + tam_dolly_y;
        dollybot.scale.setTo(1, 1);

        limit_inf_y = pq_tam_y - tam_dolly_y;
        limit_sup_y = pq_tam_y + tam_dolly_y;
        limit_inf_x = pq_tam_x;

        //Aniadendo fisica aos objetos


        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 50;

        dollybot.body.collideWorldBounds = true;
        dollybot.animations.add('left', [0, 1, 2, 3], 10, true);
        dollybot.animations.add('right', [5, 6, 7, 8], 10, true);

        apples.enableBody = true;

        for (var i = 0; i < 12; i++) {
            var apple = apples.create(i * 70, 0, 'apple');
            apple.body.gravity.y = 300;
            apple.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //Camera
        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //Textos.
        var style = { font: "bold 64px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        textNivel = game.add.text(tam_dolly_x, 0, "NIVEL1 - PARQUE COM OBSTACULOS!!", style);
        textNivel.anchor.set(0.1);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(tam_dolly_x, textNivel.y, textNivel.width, 200);
        bar.anchor.set(0.9);

        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function() {

        var hitPlatform = game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(apples, plataformas)
        game.physics.arcade.overlap(dollybot, apples, comerApples, null, this);

        //  Reset the players velocity (movement)
        dollybot.body.velocity.x = 0;

        if (cursors.left.isDown) {
            console.log('left');
            dollybot.body.velocity.x = -speed;
            dollybot.animations.play('left');
        } else if (cursors.right.isDown) {
            console.log('right');
            dollybot.body.velocity.x = speed;
            dollybot.animations.play('right');
        } else {
            //  Quetinho
            console.log('Quetinho');
            dollybot.animations.stop();
            dollybot.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && dollybot.body.touching.down && hitPlatform) {
            console.log('up');
            dollybot.body.velocity.y = -250;
        }

    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, 32, 32);

    }
};

function comerApples(dollybot, apple) {
    console.log('maça --');
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
    addKeyCallback(Phaser.Keyboard.ZERO, changeState, 'parque');
    addKeyCallback(Phaser.Keyboard.ONE, changeState, 'cidade');
    addKeyCallback(Phaser.Keyboard.TWO, changeState, 'parqueComObstaculos');
    addKeyCallback(Phaser.Keyboard.THREE, changeState, 'fabrica');

}