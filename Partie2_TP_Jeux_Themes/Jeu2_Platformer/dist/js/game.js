var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        key: 'jeu',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var platforms;
var player;
var cursors;
var stars;
var bombs;
var score;
var scoreText;
var gameOver;
var sonBon;
var sonMauvais;

function preload() {
    this.load.image('fond', 'dist/assets/img/fond.png');
    this.load.image('plateforme', 'dist/assets/img/plateforme.png');
    this.load.image('bon', 'dist/assets/img/bon.png');
    this.load.image('mauvais', 'dist/assets/img/mauvais.png');
    this.load.image('joueur', 'dist/assets/img/joueur.png');

    this.load.audio('sonBon', 'dist/assets/sounds/bon.mp3');
    this.load.audio('sonMauvais', 'dist/assets/sounds/mauvais.mp3');
}

function create() {
    // valeurs de départ (create est rappelé à chaque nouvelle partie)
    score = 0;
    gameOver = false;

    this.add.image(400, 300, 'fond');

    // le sol et les plateformes
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'plateforme').setScale(2).refreshBody();
    platforms.create(650, 450, 'plateforme');
    platforms.create(150, 340, 'plateforme');
    platforms.create(600, 230, 'plateforme');
    platforms.create(100, 120, 'plateforme');

    // le joueur
    player = this.physics.add.sprite(400, 450, 'joueur');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // les objets à récupérer : 10 objets espacés de 80 pixels
    stars = this.physics.add.group({
        key: 'bon',
        repeat: 9,
        setXY: { x: 40, y: 0, stepX: 80 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // les objets à éviter
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    scoreText = this.add.text(16, 16, 'Score : 0', { fontFamily: 'Courier New', fontSize: '32px', fill: '#000' });

    // sons
    sonBon = this.sound.add('sonBon');
    sonMauvais = this.sound.add('sonMauvais');
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
    }

    // saut : seulement si le joueur touche le sol
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    sonBon.play();

    score += 10;
    scoreText.setText('Score : ' + score);

    // tout est ramassé : nouveau tour et une bombe de plus
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // la bombe apparait du côté opposé au joueur
        var x = (player.x < 400) ? Phaser.Math.FloatBetween(400, 800) : Phaser.Math.FloatBetween(0, 400);

        var bomb = bombs.create(x, 16, 'mauvais');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.FloatBetween(-200, 200), 20);
        bomb.body.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();          // physique en pause
    player.setTint(0xff0000);      // le joueur devient rouge
    gameOver = true;               // on arrête le jeu à l'aide d'un boolean
    sonMauvais.play();

    this.add.text(400, 230, 'Perdu', { fontFamily: 'Georgia', fontSize: '80px', fill: '#000' })
        .setOrigin(0.5);

    this.add.text(400, 330, 'Rejouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#fff', backgroundColor: '#000' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('jeu');
        });
}
