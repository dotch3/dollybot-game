var tam_x = 3900,
    tam_y = 900;
var game = new Phaser.Game(tam_x, tam_y, Phaser.AUTO);
// game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

// game.state.add('inicio', demo.inicio);
game.state.add('parque', dollyApp.parque);
game.state.add('parqueComObstaculos', dollyApp.parqueComObstaculos);
game.state.add('cidade', dollyApp.cidade);
// game.state.add('fabrica', dollyApp.fabrica);
game.state.start('parqueComObstaculos');