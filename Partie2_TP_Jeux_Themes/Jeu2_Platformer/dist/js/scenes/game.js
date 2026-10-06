class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // la clé de chaque tuile doit être le nom du tileset dans le JSON
        this.load.image('ground_1x1', 'dist/assets/img/sol.png');
        this.load.image('coin', 'dist/assets/img/piece.png');
        this.load.image('pic', 'dist/assets/img/pic.png');
        this.load.spritesheet('joueur', 'dist/assets/img/joueur.png', { frameWidth: 32, frameHeight: 48 });

        this.load.tilemapTiledJSON('map', 'dist/assets/map/carte.json');

        this.load.audio('sonBon', 'dist/assets/sounds/bon.mp3');
        this.load.audio('sonMauvais', 'dist/assets/sounds/mauvais.mp3');
    }

    create() {
        // valeurs de départ (create est rappelé à chaque nouvelle partie)
        this.vie = 5;
        this.pieces = 0;
        this.invincible = 0;   // temps restant sans pouvoir être blessé (ms)

        // la map
        const map = this.make.tilemap({ key: 'map' });
        const groundTiles = map.addTilesetImage('ground_1x1');
        const coinTiles = map.addTilesetImage('coin');
        const picsTiles = map.addTilesetImage('pic');

        map.createLayer('Background Layer', groundTiles, 0, 0);
        this.groundLayer = map.createLayer('Ground Layer', groundTiles, 0, 0);
        this.coinLayer = map.createLayer('Coin Layer', coinTiles, 0, 0);
        this.picLayer = map.createLayer('Pics Layer', picsTiles, 0, 0);

        // collision avec les tuiles 1 à 25 : ground_1x1
        this.groundLayer.setCollisionBetween(1, 25);

        // le joueur
        this.player = this.physics.add.sprite(64, 64, 'joueur');
        this.player.setBounce(0.2);
        this.physics.add.collider(this.player, this.groundLayer);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('joueur', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'joueur', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('joueur', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        // la caméra suit le joueur
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // pièces (tuile 26) et pics (tuile 32)
        this.physics.add.overlap(this.player, this.coinLayer);
        this.physics.add.overlap(this.player, this.picLayer);
        this.coinLayer.setTileIndexCallback(26, this.hitCoin, this);
        this.picLayer.setTileIndexCallback(32, this.hitPic, this);

        // barre de vie en haut à gauche (setScrollFactor(0) : elle ne bouge pas avec la caméra)
        this.add.rectangle(16, 16, 200, 20, 0x000000)
            .setOrigin(0, 0)
            .setScrollFactor(0);
        this.barreVie = this.add.rectangle(16, 16, 200, 20, 0xff0000)
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // nombre de pièces en haut à droite
        this.textePieces = this.add.text(1008, 16, 'Pièces : 0 / 28', { fontFamily: 'Courier New', fontSize: '24px', fill: '#fff' })
            .setOrigin(1, 0)
            .setScrollFactor(0);

        // sons
        this.sonBon = this.sound.add('sonBon');
        this.sonMauvais = this.sound.add('sonMauvais');
    }

    update(time, delta) {
        // après un pic, on redevient vulnérable au bout d'une seconde
        if (this.invincible > 0) {
            this.invincible -= delta;
            if (this.invincible <= 0) {
                this.player.clearTint();
            }
        }

        // déplacement du joueur
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        // saut : seulement si le joueur est au sol
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-330);
        }
    }

    hitCoin(sprite, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y);
        this.sonBon.play();

        this.pieces++;
        this.textePieces.setText('Pièces : ' + this.pieces + ' / 28');

        if (this.pieces === 28) {
            window.resultat = 'gagne';
            this.scene.start('End');
        }
    }

    hitPic(sprite, tile) {
        // on est déjà en train d'être protégé
        if (this.invincible > 0) {
            return;
        }

        this.vie--;
        this.barreVie.setSize(this.vie * 40, 20);
        this.sonMauvais.play();

        // le joueur rougit et rebondit
        this.invincible = 1000;
        this.player.setTint(0xff0000);
        this.player.setVelocityY(-250);

        if (this.vie === 0) {
            window.resultat = 'perdu';
            this.scene.start('End');
        }
    }
}

export default Game;
