class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
    }

    create() {
        this.add.text(512, 150, 'Platformer', { fontFamily: 'Georgia', fontSize: '80px', fill: '#fff' })
            .setOrigin(0.5);

        this.add.text(512, 290,
            'Flèches gauche et droite pour avancer, flèche haut pour sauter.\n' +
            'Ramasse les 28 pièces sans te faire piquer.\n' +
            'Chaque pic enlève une vie. Tu en as 5.',
            { fontFamily: 'Courier New', fontSize: '22px', fill: '#fff', align: 'center' })
            .setOrigin(0.5);

        this.add.text(512, 430, 'Jouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#000', backgroundColor: '#fff' })
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
