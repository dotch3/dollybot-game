var tam_x = 800,
    tam_y = 600;
// var game = new Phaser.Game(tam_x, tam_y, Phaser.AUTO);
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

game.state.add('parqueComObstaculos', dollyApp.parqueComObstaculos);
game.state.add('parque', dollyApp.parque);
game.state.add('cidade', dollyApp.cidade);
game.state.add('fabrica', dollyApp.fabrica);
game.state.add('jogo', dollyApp.jogo);
game.state.start('fabrica');