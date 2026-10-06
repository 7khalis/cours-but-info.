import Menu from "./scenes/menu.js";
import Game from "./scenes/game.js";
import End from "./scenes/end.js";

// variable globale : on la retrouve dans toutes les scènes
window.score = 0;

window.config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#2d2d2d',
    scene: [Menu, Game, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(window.config);
