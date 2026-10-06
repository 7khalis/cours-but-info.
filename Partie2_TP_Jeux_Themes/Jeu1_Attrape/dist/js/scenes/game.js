class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fond', 'dist/assets/img/fond.png');
        this.load.image('sol', 'dist/assets/img/sol.png');
        this.load.image('bon', 'dist/assets/img/bon.png');
        this.load.image('mauvais', 'dist/assets/img/mauvais.png');
        this.load.image('joueur', 'dist/assets/img/joueur.png');

        this.load.audio('sonBon', 'dist/assets/sounds/bon.mp3');
        this.load.audio('sonMauvais', 'dist/assets/sounds/mauvais.mp3');
    }

    create() {
        // valeurs de départ (create est rappelé à chaque nouvelle partie)
        window.score = 0;
        this.vies = 3;
        this.delai = 0;          // temps écoulé depuis le dernier objet
        this.intervalle = 800;   // temps entre deux objets (ms)

        this.add.image(400, 300, 'fond');

        // le sol
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'sol').setScale(2).refreshBody();

        // le joueur
        this.player = this.physics.add.sprite(400, 450, 'joueur');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        // les deux types d'objets qui tombent
        this.bons = this.physics.add.group();
        this.mauvais = this.physics.add.group();

        // un objet qui touche le sol disparait
        this.physics.add.collider(this.bons, this.platforms, this.toucheSol, null, this);
        this.physics.add.collider(this.mauvais, this.platforms, this.toucheSol, null, this);

        // collisions avec le joueur
        this.physics.add.overlap(this.player, this.bons, this.attraperBon, null, this);
        this.physics.add.overlap(this.player, this.mauvais, this.attraperMauvais, null, this);

        // textes
        this.texteScore = this.add.text(16, 16, 'Score : 0', { fontFamily: 'Courier New', fontSize: '28px', fill: '#000' });
        this.texteVies = this.add.text(784, 16, 'Vies : 3', { fontFamily: 'Courier New', fontSize: '28px', fill: '#000' })
            .setOrigin(1, 0);

        // sons
        this.sonBon = this.sound.add('sonBon');
        this.sonMauvais = this.sound.add('sonMauvais');
    }

    update(time, delta) {
        // déplacement du joueur
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        // on fait tomber un nouvel objet de temps en temps
        this.delai += delta;
        if (this.delai > this.intervalle) {
            this.delai = 0;
            let x = Math.random() * 760 + 20;

            // 7 fois sur 10 c'est un bon objet
            if (Math.random() < 0.7) {
                this.bons.create(x, 0, 'bon');
            } else {
                this.mauvais.create(x, 0, 'mauvais');
            }
        }
    }

    toucheSol(objet, sol) {
        objet.disableBody(true, true);
    }

    attraperBon(player, bon) {
        bon.disableBody(true, true);
        this.sonBon.play();

        window.score += 10;
        this.texteScore.setText('Score : ' + window.score);

        // le jeu s'accélère petit à petit
        if (this.intervalle > 300) {
            this.intervalle -= 15;
        }
    }

    attraperMauvais(player, mauvais) {
        mauvais.disableBody(true, true);
        this.sonMauvais.play();

        this.vies--;
        this.texteVies.setText('Vies : ' + this.vies);

        if (this.vies === 0) {
            this.scene.start('End');
        }
    }
}

export default Game;
