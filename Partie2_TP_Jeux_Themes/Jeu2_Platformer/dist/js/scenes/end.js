class End extends Phaser.Scene {
    constructor() {
        super('End');
    }

    preload() {
    }

    create() {
        // window.resultat vient de la scène Game
        if (window.resultat === 'gagne') {
            this.add.text(512, 190, 'Gagné', { fontFamily: 'Georgia', fontSize: '80px', fill: '#fff' })
                .setOrigin(0.5);
            this.add.text(512, 290, 'Les 28 pièces sont ramassées.', { fontFamily: 'Courier New', fontSize: '28px', fill: '#fff' })
                .setOrigin(0.5);
        } else {
            this.add.text(512, 190, 'Perdu', { fontFamily: 'Georgia', fontSize: '80px', fill: '#fff' })
                .setOrigin(0.5);
            this.add.text(512, 290, 'Plus de vie, il reste des pièces.', { fontFamily: 'Courier New', fontSize: '28px', fill: '#fff' })
                .setOrigin(0.5);
        }

        this.add.text(512, 400, 'Rejouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#000', backgroundColor: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Game');
            });

        this.add.text(512, 480, 'Retour au menu', { fontFamily: 'Georgia', fontSize: '28px', fill: '#000', backgroundColor: '#fff' })
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
