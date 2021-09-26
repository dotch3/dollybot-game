var tam_x = 2600,
    tam_y = 1400;
// var game = new Phaser.Game(tam_x, tam_y, Phaser.AUTO);
var game = new Phaser.Game(800, 600, Phaser.AUTO);
// var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);



game.state.add('parque', dollyApp.parque);
game.state.add('desafio', dollyApp.desafio);
game.state.add('fabrica', dollyApp.fabrica);
// game.state.add('jogo', dollyApp.jogo);
game.state.start('parque');