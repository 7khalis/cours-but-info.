import Menu from "./scenes/menu.js";
import Game from "./scenes/game.js";
import End from "./scenes/end.js";

// variable globale : on la retrouve dans toutes les scènes
// elle vaut 'gagne' ou 'perdu' à la fin de la partie
window.resultat = '';

window.config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
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
