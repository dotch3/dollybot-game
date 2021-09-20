var dollyApp = {};
var pq_tam_x = 1200,
    pq_tam_y = 1200,
    tam_dolly_x = 240,
    tam_dolly_y = 249,
    limit_inf_x,
    limit_sup_x,
    limit_inf_y,
    limit_sup_y,
    speed = 10,
    textNivel,
    ground,
    dollybot,
    fundoParque,
    score = 0,
    scoreText,
    capangas;

dollyApp.parque = function() {};
dollyApp.parque.prototype = {
    preload: function() {
        console.log('Parque  Inicial');
        game.load.spritesheet('dollyboy', '../assets/personagens/spritesheet/dollybotSheet.png', tam_dolly_x, tam_dolly_y);
        game.load.image('parque', '../assets/parque.png');
        game.load.image('capanga', '../assets/capanga.png');
        game.load.image('ground', '../assets/ground.png');
        game.load.image('message', '../assets/message.png');
        game.load.image('escada', '../assets/escada.png');
    },
    create: function() {
        console.log('create Parque');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 11000, 1100);
        // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.backgroundColor = '#435c04';
        addChangeStateEventListeners();
        fundoParque = game.add.sprite(0, 0, 'parque');
        fundoParque.scale.setTo(1, 1);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        plataformas = game.add.group();
        plataformas.enableBody = true;
        console.log(`piso: ${game.world.height}`);
        ground = plataformas.create(0, game.world.height - 200, 'ground');
        ground.scale.setTo(10, 2);
        ground.body.immovable = true;

        // escada = game.add.sprite(9500, 800, 'escada'); //final
        escada = game.add.sprite(500, 900, 'escada');
        game.physics.enable(escada, Phaser.Physics.ARCADE);
        escada.scale.setTo(0.7, 0.7);

        escada.enableBody = true;
        escada.body.immovable = true;

        console.log(tam_x, tam_y, pq_tam_x, pq_tam_y)
        cursors = game.input.keyboard.createCursorKeys();

        // Ajustes dos pontos de inicio do dollybot:
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.arcade.enable([dollybot, escada]);

        //Limites para o desplazamento do robo
        limit_inf_y = pq_tam_y;
        limit_sup_y = game.world.height - ground.body.height;

        //Centrar a imagen no centro dela mesma
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = limit_sup_y - tam_dolly_y;

        dollybot.scale.setTo(1, 1);
        dollybot.body.gravity.y = 450;

        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 300;
        dollybot.body.collideWorldBounds = true;
        // Animando a imagem com spritesheet
        dollybot.animations.add('rodar', [0, 1, 2, 3, 4]);


        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // game.camera.deadzone = new Phaser.Rectangle(200, 350, 800, 600);

        //Textos.

        var style = { font: "bold 48px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        // var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };

        textNivel = game.add.text(0, 100, "ENCONTRO NO PARQUE", style);
        textNivel.anchor.set(0.5);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;
        textNivel.cameraOffset.setTo(game.scale.width / 2, 110);
        // screen size: game.scale.width - game.scale.height.

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(tam_dolly_x, textNivel.y, textNivel.width, 200, style);

        //Capangas

        capangas = game.add.group();
        capangas.enableBody = true;
        var max = game.world.width,
            min = 50;
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var capanga = capangas.create(Math.floor(Math.random() * (max - min)) + min, 0, 'capanga');

            //  Let gravity do its thing
            capanga.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            capanga.body.bounce.y = 0.1 + Math.random() * 0.2;
        }

        console.log('Criados capangas!.');
        //Message
        messages = game.add.group();
        messages.enableBody = true;
        var messageFinal = messages.create(1300, 600, 'message');
        messageFinal.scale.setTo(0.5, 0.5);
        messageFinal.body.immovable = true;

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        scoreText.fixedToCamera = true;

    },
    update: function() {
        var hittingPiso = game.physics.arcade.collide(dollybot, plataformas);
        var hittingEscada = game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(capangas, plataformas);
        game.physics.arcade.collide(capangas, escada);

        game.physics.arcade.collide(dollybot, messages);
        game.physics.arcade.overlap(dollybot, capangas, hitCapanga, null, this);
        game.physics.arcade.overlap(dollybot, messages, hitMessageFinal, null, this);
        game.physics.arcade.collide(dollybot, escada, hitEscada, null, this);


        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // dollybot.tint = 0xffffff;

        if (cursors.right.isDown) {
            dollybot.scale.setTo(1, 1);
            dollybot.x += speed;

            //Rodando
            dollybot.animations.play('rodar', 12, true);
        } else if (cursors.left.isDown) {
            // utilizando valor negativo para rotar imagem em sentido inverso
            dollybot.scale.setTo(-1, 1);
            dollybot.x -= speed;
            dollybot.animations.play('rodar', 12, true);
        } else {
            dollybot.animations.stop('rodar');
            dollybot.frame = 0;
        }
        if (cursors.up.isDown && dollybot.body.touching.down && hittingPiso) {
            dollybot.animations.play('rodar', 12, true);
            dollybot.body.velocity.y = -350;
            if (dollybot.y <= game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2)) {
                dollybot.y = game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2);
                console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
            }
        }



        if (spaceKey.isDown && dollybot.body.touching.down) {
            console.log('jump');
            //Change the color and throw bullet
        }
    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, 50, 50);

    }
};

function hitEscada(dollybot, escada) {
    console.log('escada');
    dollybot.tint = 0x80ffbf;
}

function hitCapanga(dollybot, capanga) {
    // Removes the star from the screen
    console.log('capanga atingido');
    capanga.tint = 0xff00ff;
    dollybot.tint = 0xff00ff;
    timer = game.time.now;
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        console.log('testing');
        capanga.destroy();
        score += 10;
    }, this);
    console.log(`Score : ${score}`)

    scoreText.text = 'Score: ' + score;
}



function hitMessageFinal(dollybot, message) {
    console.log('Message Final');
    fundoParque.tint = 0x80ffbf;
    dollybot.tint = 0xffffff;
    move(dollybot);

    // message.kill();

}

function move(dollybot) {
    console.log('move');
    dollybot.body.move = true;
    dollybot.body.velocity.x = 800;
    dollybot.animations.play('rodar', 12, true);
    // dollybot.body.moveTo(2000, 300, Phaser.ANGLE_RIGHT);
    startTime = game.time.time;
    duration = 0;
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