// var dollyApp = {};
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
    capangas;

dollyApp.parque = function() { console.log('Parque  Inicial'); };
dollyApp.parque.prototype = {
    preload: function() {
        game.load.spritesheet('dollyboy', '../assets/personagens/spritesheet/dollybotSheet.png', tam_dolly_x, tam_dolly_y);
        game.load.image('parque', '../assets/parque.png');
        game.load.image('capanga', '../assets/capanga.png');
        game.load.image('ground', '../assets/ground.png');
        game.load.image('message', '../assets/message.png');
    },
    create: function() {
        console.log('create Parque');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 11000, 1100);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.backgroundColor = '#435c04';
        addChangeStateEventListeners();
        var fundoParque = game.add.sprite(0, 0, 'parque');
        fundoParque.scale.setTo(1, 1);
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        plataformas = game.add.group();
        plataformas.enableBody = true;
        console.log(`piso: ${game.world.height}`);
        ground = plataformas.create(0, game.world.height - 200, 'ground');
        ground.scale.setTo(4, 2);
        ground.body.immovable = true;


        console.log(tam_x, tam_y, pq_tam_x, pq_tam_y)
        cursors = game.input.keyboard.createCursorKeys();



        // Ajustes dos pontos de inicio do dollybot:
        // dollybot = game.add.sprite(tam_dolly_x, tam_dolly_y, 'dollybot');
        dollybot = game.add.sprite(32, game.world.height - 450, 'dollyboy');
        game.physics.arcade.enable(dollybot);


        //Limites para o desplazamento do robo
        limit_inf_y = pq_tam_y;
        limit_sup_y = game.world.height - ground.body.height;
        limit_inf_x = pq_tam_x;
        console.log(`Limites: inf_y ${limit_inf_y}, sup_y ${limit_sup_y}, inf_x ${limit_inf_x}, sup_x ${tam_x}`)
            //Centrar a imagen no centro dela mesma
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = limit_sup_y - tam_dolly_y;

        dollybot.scale.setTo(1, 1);
        dollybot.body.gravity.y = 300;

        dollybot.body.bounce.y = 0.2;
        dollybot.body.gravity.y = 300;
        dollybot.body.collideWorldBounds = true;
        // Animando a imagem com spritesheet
        dollybot.animations.add('rodar', [0, 1, 2, 3, 4]);


        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // game.camera.deadzone = new Phaser.Rectangle(200, 350, 800, 600);

        //Textos.

        var style = { font: "bold 48px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "center" };
        textNivel = game.add.text(0, 100, "ENCONTRO NO PARQUE", style);


        textNivel.anchor.set(0.5);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;
        textNivel.cameraOffset.setTo(pq_tam_x, tam_dolly_y);

        // var bar = game.add.graphics();
        // bar.beginFill(0x000000, 0.2);
        // bar.drawRect(tam_dolly_x, textNivel.y, textNivel.width, 200, style);

        //Capangas

        capangas = game.add.group();
        capangas.enableBody = true;
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var capanga = capangas.create(i * 70, 0, 'capanga');

            //  Let gravity do its thing
            capanga.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            capanga.body.bounce.y = 0.1 + Math.random() * 0.2;
        }

        //Message
        messages = game.add.group();
        messages.enableBody = true;
        var messageFinal = messages.create(1300, 600, 'message');
        messageFinal.scale.setTo(0.5, 0.5);
        messageFinal.body.immovable = true;

    },
    update: function() {

        var noPiso = game.physics.arcade.collide(dollybot, plataformas);
        game.physics.arcade.collide(capangas, plataformas);
        game.physics.arcade.collide(dollybot, messages);
        game.physics.arcade.overlap(dollybot, capangas, hitCapanga, null, this);
        game.physics.arcade.overlap(dollybot, messages, hitMessageFinal, null, this);
        //Sem cursors:
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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
        // if (cursors.up.isDown) {
        //     dollybot.animations.play('rodar', 12, true);
        //     dollybot.y -= speed;
        //     if (dollybot.y <= game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2)) {
        //         dollybot.y = game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2);
        //         console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
        //     }
        // }
        if (cursors.up.isDown) {
            dollybot.animations.play('rodar', 12, true);
            if (dollybot.body.touching.down && noPiso) {
                console.log('no piso');
                dollybot.body.velocity.y = -450;
            } else {
                dollybot.y = -speed;
            }
            if (dollybot.y <= game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2)) {
                dollybot.y = game.world.height - (ground.body.height + dollybot.body.height + ground.body.height / 2);
                console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
            }
        } else if (cursors.down.isDown) {
            dollybot.animations.play('rodar', 12, true);
            dollybot.y += speed;
            if (dollybot.y >= game.world.height - ground.body.height) {
                console.log(`Al borde do limite superior em Y:${dollybot.x}, ${dollybot.y}`)
                dollybot.y = game.world.height - ground.body.height;
            }
        }


        if (spaceKey.isDown) {
            console.log('jump');
            dollybot.body.velocity.y = -450;
        }
    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, 50, 50);

    }
};


function hitCapanga(dollybot, capanga) {
    // Removes the star from the screen
    console.log('capanga atingido');
    capanga.kill();

}

function hitMessageFinal(dollybot, message) {
    console.log('Message Final');
    message.kill();
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