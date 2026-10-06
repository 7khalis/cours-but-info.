class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('fond', 'dist/assets/img/fond.png');
    }

    create() {
        this.add.image(400, 300, 'fond');

        this.add.text(400, 160, 'Attrape', { fontFamily: 'Georgia', fontSize: '80px', fill: '#000' })
            .setOrigin(0.5);

        this.add.text(400, 300,
            'Flèches gauche et droite pour bouger.\n' +
            'Le bon objet rapporte 10 points.\n' +
            'Le mauvais te coûte une vie. Tu en as 3.',
            { fontFamily: 'Courier New', fontSize: '22px', fill: '#000', align: 'center' })
            .setOrigin(0.5);

        this.add.text(400, 450, 'Jouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#fff', backgroundColor: '#000' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Game');
            });
    }

    update(time, delta) {
    }
}

export default Menu;
