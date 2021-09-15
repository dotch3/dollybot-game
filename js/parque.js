var dollyApp = {},
    pq_tam_x = 800,
    pq_tam_y = 1200,
    tam_dolly_x = 240,
    tam_dolly_y = 249,
    limit_inf_x,
    limit_sup_x,
    limit_inf_y,
    limit_sup_y,
    speed = 10,
    textNivel,
    dollybot;
dollyApp.parque = function() {};
dollyApp.parque.prototype = {
    preload: function() {
        game.load.spritesheet('dollybot', '../assets/personagens/spritesheet/dollybotSheet.png', tam_dolly_x, tam_dolly_y);
        game.load.image('parque', '../assets/fundos/parque.png');
    },
    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#999393';
        addChangeStateEventListeners();
        game.world.setBounds(0, 0, 9500, 1200);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        cursors = game.input.keyboard.createCursorKeys();


        var fundoParque = game.add.sprite(0, 0, 'parque');
        fundoParque.scale.setTo(1.2, 2);

        console.log(tam_x, tam_y, pq_tam_x, pq_tam_y)
            // Ajustes dos pontos de inicio do dollybot:
        dollybot = game.add.sprite(tam_dolly_x, tam_dolly_y, 'dollybot');

        limit_inf_y = pq_tam_y;
        limit_sup_y = pq_tam_y + 350;
        limit_inf_x = pq_tam_x;

        console.log(`Limites: inf_y ${limit_inf_y}, sup_y ${limit_sup_y}, inf_x ${limit_inf_x}, sup_x ${tam_x}`)
            //Centrar a imagen no centro dela mesma
        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = limit_sup_y - tam_dolly_y;
        //tamanio escalado
        dollybot.scale.setTo(1, 1);

        // Habilitando fisica para colidir com os bordes
        game.physics.enable(dollybot);
        dollybot.body.collideWorldBounds = true;
        dollybot.body.fixedRotation = true;
        // Animando a imagem com spritesheet
        dollybot.animations.add('rodar', [0, 1, 2, 3, 4]);


        game.camera.follow(dollybot);
        game.camera.follow(dollybot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // game.camera.deadzone = new Phaser.Rectangle(200, 350, 800, 600);

        //Textos.
        var style = { font: "bold 64px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
        textNivel = game.add.text(0, tam_dolly_y, "NIVEL1 - ENCONTRO NO PARQUE!!!", style);


        textNivel.anchor.set(0.5);
        textNivel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        textNivel.fixedToCamera = true;
        textNivel.cameraOffset.setTo(pq_tam_x, tam_dolly_y);

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(tam_dolly_x, textNivel.y, textNivel.width, 200);





    },
    update: function() {
        //Sem cursors:
        //game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
        // game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
        // game.input.keyboard.isDown(Phaser.Keyboard.UP)
        // game.input.keyboard.isDown(Phaser.Keyboard.DOWN)


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
        if (cursors.up.isDown) {
            dollybot.y -= speed;
            if (dollybot.y <= limit_inf_y) {
                dollybot.y = limit_inf_y;
                console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
            }
        } else if (cursors.down.isDown) {
            dollybot.y += speed;
            if (dollybot.y >= limit_sup_y) {
                console.log(`Al borde do limite superior em Y:${dollybot.x}, ${dollybot.y}`)
                dollybot.y = limit_sup_y;
            }
        }
    }
};

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

}