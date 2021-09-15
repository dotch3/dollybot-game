var dollyApp = {},
    cursors,
    tam_dolly_x = 240,
    tam_dolly_y = 249,
    speed = 10,
    arbustoLayer,
    appleLayer, areiaLayer, madeiraLayer, parqueLayer, messageLayer, dollybot;

//first stage
var pq_tam_x = 800,
    pq_tam_y = 1200,
    tam_dolly_x = 240,
    tam_dolly_y = 249,
    limit_inf_x,
    limit_sup_x,
    limit_inf_y,
    limit_sup_y;

dollyApp.parqueComObstaculos = function() { console.log('Parque com obstaculos'); };
dollyApp.parqueComObstaculos.prototype = {
    preload: function() {
        console.log('preload');
        //Personagens
        game.load.spritesheet('dollybot', '../assets/personagens/spritesheet/dollybotSheet.png', tam_dolly_x, tam_dolly_y);

        //Mapa:
        game.load.tilemap('mapa', '../assets/tilemaps/mapaParque.json', null, Phaser.Tilemap.TILED_JSON);

        //Images do mapa
        game.load.image('parqueTileset', '../assets/tilemaps/parque.png');
        game.load.image('appleTileset', '../assets/tilemaps/apple.png');
        game.load.image('arbustoTileset', '../assets/tilemaps/arbusto.png');
        game.load.image('madeiraTileset', '../assets/tilemaps/areia.jpg');
        game.load.image('messageTileset', '../assets/tilemaps/message.png');
    },
    create: function() {
        console.log('create');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#999393';
        addChangeStateEventListeners();
        game.world.setBounds(0, 0, 11000, 1600);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        cursors = game.input.keyboard.createCursorKeys();


        //mapa
        var mapaParque = game.add.tilemap('mapa');
        mapaParque.addTilesetImage('parqueTileset');
        mapaParque.addTilesetImage('arbustoTileset');
        mapaParque.addTilesetImage('madeiraTileset');
        mapaParque.addTilesetImage('appleTileset');
        mapaParque.addTilesetImage('messageTileset');

        arbustoLayer = mapaParque.createLayer('ArbustoLayer');
        madeiraLayer = mapaParque.createLayer('MadeiraLayer');
        parqueLayer = mapaParque.createLayer('ParqueLayer');
        appleLayer = mapaParque.createLayer('AppleLayer');
        messageLayer = mapaParque.createLayer('MessageLayer');
        dollybot = game.add.sprite(tam_dolly_x, tam_dolly_y, 'dollybot');

        dollybot.anchor.setTo(0.5, 0.5);
        dollybot.x = tam_dolly_x;
        dollybot.y = tam_y + tam_dolly_y;
        dollybot.scale.setTo(1, 1);

        limit_inf_y = pq_tam_y - tam_dolly_y;
        limit_sup_y = pq_tam_y + tam_dolly_y;
        limit_inf_x = pq_tam_x;

        //Aniadendo fisica aos objetos
        game.physics.enable([dollybot, arbustoLayer, madeiraLayer, appleLayer, messageLayer], Phaser.Physics.ARCADE);


        //Collisions
        // mapaParque.setCollisionBetween(328, 329, true, 'messageLayer');
        // mapaParque.setCollision(1, true, 'appleLayer');
        // mapaParque.setCollision(262, true, 'madeiraLayer');
        // mapaParque.setCollisionBetween(8036, 9576, true, 'arbustoLayer');

        // dollybot.body.onCollide = new Phaser.Signal();
        // dollybot.body.onCollide.add(hitSprite, this);

        // Gravity:
        //world (global) gravity
        // game.physics.arcade.gravity.y = 100;
        // dollybot.body.bounce.y = 0.2;
        // dollybot.body.gravity.y = 50;



        dollybot.body.collideWorldBounds = true;
        dollybot.body.fixedRotation = true;
        // dollybot.body.bounce.set(1);
        dollybot.animations.add('rodar', [0, 1, 2, 3, 4]);

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



    },
    update: function() {
        // game.physics.arcade.collide(dollybot, arbustoLayer, collisionHandler, null, this);
        // game.physics.arcade.collide(dollybot, appleLayer, function() { console.log('comendo apple!'); });
        // game.physics.arcade.collide(dollybot, madeiraLayer, function() { console.log('na madeira!'); });
        // game.physics.arcade.collide(dollybot, messageLayer, function() { console.log('Message Encontrado!'); });

        game.physics.arcade.collide(dollybot, appleLayer);
        game.physics.arcade.collide(dollybot, arbustoLayer);
        //Sem cursors:
        // game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
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
            dollybot.animations.play('rodar', 12, true);
            if (dollybot.y <= limit_inf_y) {
                dollybot.y = limit_inf_y;
                console.log(`Al borde do limite inferior em Y: ${dollybot.x} , ${dollybot.y}`)
            }
        } else if (cursors.down.isDown) {
            dollybot.y += speed;
            dollybot.animations.play('rodar', 12, true);
            if (dollybot.y >= limit_sup_y) {
                console.log(`Al borde do limite superior em Y:${dollybot.x}, ${dollybot.y}`)
                dollybot.y = limit_sup_y;
            }
        }



    },
    render: function() {
        //debug 
        game.debug.spriteInfo(dollybot, 32, 32);

    }
};

function collisionHandler(obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';
    console.log('batendo arbusto!');
}

function hitSprite(sprite1, sprite2) {
    console.log(`hit collision: sprite1:${sprite1.body.position}, sprite2: ${sprite1.body.position}`);
    game.stage.backgroundColor = '#992d2d';

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

}