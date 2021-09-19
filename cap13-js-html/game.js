var canvas = document.getElementById('minha-tela');
var MAX_X = canvas.width
var MAX_Y = canvas.height
var ctx = canvas.getContext('2d');
var intervaloVelocidade = 2000
var intervaloPontos = 1000
var velocidadeNave = 2.5

var intervaloAsteroide = 300
var quantidadeAsteroides = 1
var pontos = 0

var playing = true

var ultimoMovimento = new Date().valueOf()

ctx.font = "20px Arial"

function Asteroide(y, vx) {
    this.x = MAX_X
    this.y = y
    this.vx = vx
    this.tamanho = 20
    var image = new Image()
    image.src = "imagens/bullet.png"
    this.image = image
}

function Nave() {
    this.x = 0
    this.y = MAX_Y / 2
    this.vx = 0
    this.vy = 0
    this.tamanho = 60
    var image = new Image(200, 200)
    image.src = "imagens/dollybot.png"
    this.image = image
}

nave = new Nave()
asteroides = [];

requestAnimationFrame(gameloop);

// Prepara a geração dos asteroides
setTimeout(gerarAsteroide, intervaloAsteroide)

// Aumenta a velocidade a cada intervaloVelocidade ms 
setTimeout(aumentaVelocidade, intervaloVelocidade)

// Aumenta o placar a cada intervaloPontos ms
setTimeout(aumentaPlacar, intervaloPontos)

// Função de movimentação
window.onkeydown = function(tecla) {
    ultimoMovimento = new Date().valueOf()
    if (isRight(tecla)) {
        nave.vx = -velocidadeNave;
        nave.image.src = "imagens/right.png"
    }
    if (isLeft(tecla)) {
        nave.vx = velocidadeNave;
        nave.image.src = "imagens/left.png"
    }
    if (isUp(tecla)) {
        nave.vy = -velocidadeNave;
        nave.image.src = "imagens/up.png"
    }
    if (isDown(tecla)) {
        nave.vy = velocidadeNave;
        nave.image.src = "imagens/down.png"
    }
};

// Função de parada
window.onkeyup = function(tecla) {
    if (isRight(tecla) || isLeft(tecla)) {
        nave.vx = 0;
    }
    if (isUp(tecla) || isDown(tecla)) {
        nave.vy = 0;
    }
    ultimoMovimento = new Date().valueOf()
};

function gameloop() {
    // Limpa toda a tela, e desenha o fundo preto
    clearAll()

    // Desenha a nave
    desenhaObjeto(nave);

    // Move a nave
    move(nave)

    // Para cada asteroide
    for (i = 0; i < asteroides.length; i++) {
        // Desenha o asteroide
        desenhaObjeto(asteroides[i]);

        // Checa colisão entre objeto e nave
        detectarColisao(nave, asteroides[i])

        // E o move
        if (move(asteroides[i])) {
            // Se ele sumiu pra esquerda, remove ele da lista
            asteroides.splice(i, 1)
        }
    }

    // Se a nave esta parada (v = (0, 0)) e fazem 2s desde o último movimento
    if (
        nave.vx == 0 &&
        nave.vy == 0 &&
        (new Date().valueOf() - ultimoMovimento) > 2000) {
        pontos -= 10
        ultimoMovimento = new Date().valueOf()
    }

    // Desenha o placar
    ctx.fillStyle = 'white'
    ctx.fillText(
        'PONTOS: ' + pontos.toFixed(0),
        MAX_X - 150,
        MAX_Y - 20
    );

    // Se playing for false, então dê game over
    if (!playing) {
        clearAll()
        ctx.fillStyle = 'white'
        ctx.fillText('Game over!', MAX_X / 2, MAX_Y / 2);

        // Em dois segundos, restarte
        setTimeout(restart, 2000)
        return
    }

    // Chama novamente o ciclo da animação
    requestAnimationFrame(gameloop);
}

function desenhaObjeto(objeto) {
    ctx.drawImage(objeto.image, objeto.x, objeto.y, objeto.tamanho, objeto.tamanho)
}

function move(objeto) {
    objeto.x -= objeto.vx
    objeto.x = Math.min(Math.max(0, objeto.x), MAX_X - objeto.tamanho)
    if (objeto.vy) {
        objeto.y += objeto.vy
        objeto.y = Math.min(Math.max(0, objeto.y), MAX_Y - objeto.tamanho)
    }

    return objeto.x == 0
}

function gerarAsteroide() {
    if (!playing) {
        return
    }
    if (asteroides.length < quantidadeAsteroides) {
        asteroides.push(new Asteroide(Math.floor(Math.random() * (MAX_Y - 50)) + 25, 5.5))
    }
    setTimeout(gerarAsteroide, intervaloAsteroide)
}

function aumentaVelocidade() {
    if (!playing) {
        return
    }
    intervaloAsteroide *= 0.95
    quantidadeAsteroides++
    setTimeout(aumentaVelocidade, intervaloVelocidade)
}

function aumentaPlacar() {
    if (!playing) {
        return
    }
    pontos += 1 + pontos * 0.2
    setTimeout(aumentaPlacar, intervaloPontos)
}

function isUp(tecla) {
    return tecla.keyCode == 38 || tecla.keyCode == 87;
}

function isDown(tecla) {
    return tecla.keyCode == 40 || tecla.keyCode == 83;
}

function isLeft(tecla) {
    return tecla.keyCode == 37 || tecla.keyCode == 65;
}

function isRight(tecla) {
    return tecla.keyCode == 39 || tecla.keyCode == 68;
}

function reduzirPontos() {
    pontos -= 10
    if (pontos < 0) pontos = 0;
}

function detectarColisao(nave, asteroide) {
    if (
        (
            (asteroide.x + asteroide.tamanho) > nave.x &&
            asteroide.x < (nave.x + nave.tamanho)
        ) &&
        (
            (asteroide.y + asteroide.tamanho) > nave.y &&
            asteroide.y < (nave.y + nave.tamanho)
        )
    ) {
        playing = false;
    }
}

function restart() {
    nave = new Nave()
    asteroides.splice(0, asteroides.length);

    ultimoMovimento = new Date().valueOf()
    intervaloAsteroide = 300
    quantidadeAsteroides = 1
    pontos = 0

    setTimeout(gerarAsteroide, intervaloAsteroide)
    setTimeout(aumentaVelocidade, intervaloVelocidade)
    setTimeout(aumentaPlacar, intervaloPontos)
    playing = true;

    requestAnimationFrame(gameloop);
}

function clearAll() {
    ctx.clearRect(0, 0, MAX_X, MAX_Y);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, MAX_X, MAX_Y);
}