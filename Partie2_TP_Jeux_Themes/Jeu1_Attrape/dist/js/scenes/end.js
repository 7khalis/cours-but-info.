class End extends Phaser.Scene {
    constructor() {
        super('End');
    }

    preload() {
        this.load.image('fond', 'dist/assets/img/fond.png');
    }

    create() {
        this.add.image(400, 300, 'fond');

        this.add.text(400, 170, 'Perdu', { fontFamily: 'Georgia', fontSize: '80px', fill: '#000' })
            .setOrigin(0.5);

        // window.score vient de la scène Game
        this.add.text(400, 290, 'Score : ' + window.score, { fontFamily: 'Courier New', fontSize: '36px', fill: '#000' })
            .setOrigin(0.5);

        this.add.text(400, 400, 'Rejouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#fff', backgroundColor: '#000' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Game');
            });

        this.add.text(400, 480, 'Retour au menu', { fontFamily: 'Georgia', fontSize: '28px', fill: '#fff', backgroundColor: '#000' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Menu');
            });
    }

    update(time, delta) {
    }
}

export default End;
