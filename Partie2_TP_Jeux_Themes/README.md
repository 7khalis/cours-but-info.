# TP jeux à thème

Deux petits jeux Phaser. On change les images selon le mot du thème, le code ne bouge pas.
Tout vient du cours (CM, TD1 pour le jeu 2, TD3 pour la structure du jeu 1). Phaser 3.55 (le `phaser.min.js` du TD3).

```
Partie2_TP_Jeux_Themes/
├── Guides/
│   ├── Guide_Jeu1_Attrape.md / .pdf       guide pas à pas du jeu 1
│   └── Guide_Jeu2_Platformer.md / .pdf    guide pas à pas du jeu 2
├── Jeu1_Attrape/            objets qui tombent, un bon et un mauvais (structure du TD3)
│   ├── index.html
│   └── dist/
│       ├── assets/img/      fond, sol, joueur, bon, mauvais
│       ├── assets/sounds/   bon.mp3, mauvais.mp3
│       ├── css/main.css
│       └── js/
│           ├── lib/phaser.min.js
│           ├── main.js      config + liste des scènes
│           └── scenes/      menu.js, game.js, end.js
└── Jeu2_Platformer/         le jeu du CM et du TD1 : plateformes, objets à ramasser, bombes
    ├── index.html
    └── dist/
        ├── assets/img/      fond, plateforme, joueur, bon, mauvais
        ├── assets/sounds/   bon.mp3, mauvais.mp3
        └── js/
            ├── lib/phaser.min.js
            └── game.js      preload, create, update dans un seul fichier
```

Les guides expliquent tout, de la préparation des images du thème jusqu'au test final, avec le code à écrire à chaque étape.
Le PDF est la même chose que le `.md`, pour l'imprimer ou l'ouvrir pendant le TP.

## Lancer un jeu

Il faut un serveur web (le cours l'explique ; pour le jeu 1, `main.js` est en plus un module).
Au TP : le serveur web de l'IUT, qui pointe sur le W. Chez soi :

```
cd Jeu1_Attrape        # ou Jeu2_Platformer
python3 -m http.server
```

Puis ouvrir http://localhost:8000. Ouvrir `index.html` en double-clic ne marche pas : la page reste vide.

## Changer de thème : les images à remplacer

On garde le même nom de fichier et la même taille.

### Jeu 1 : attrape

| Fichier | Taille | Rôle |
|---|---|---|
| `fond.png` | au moins 800 x 600 | fond (menu, jeu, fin) |
| `sol.png` | 400 x 32 | sol, affiché en x2 |
| `joueur.png` | 288 x 48 | 9 images de 32 x 48 : 0-3 gauche, 4 face, 5-8 droite |
| `bon.png` | libre (48 x 44 ici) | rapporte 10 points |
| `mauvais.png` | libre (28 x 28 ici) | enlève une vie |

### Jeu 2 : platformer

| Fichier | Taille | Rôle |
|---|---|---|
| `fond.png` | au moins 800 x 600 | décor |
| `plateforme.png` | 400 x 32 | sol (en x2) et plateformes |
| `joueur.png` | 288 x 48 | comme dans le jeu 1 |
| `bon.png` | libre (48 x 44 ici) | objet à ramasser, 10 points |
| `mauvais.png` | libre (28 x 28 ici) | bombe |

Si le joueur du thème est une seule image, quelques lignes changent : c'est expliqué dans chaque guide.

## Règles

**Jeu 1.** Flèches gauche et droite. Un bon objet = 10 points, un mauvais = une vie en moins (3 vies).
Plus on en attrape, plus il en tombe. À 0 vie on passe à l'écran de fin avec le score.

**Jeu 2.** Flèches pour bouger, flèche haut pour sauter. 12 objets à ramasser, 10 points chacun.
Une fois tous ramassés, ils reviennent et une bombe de plus rebondit partout. Toucher une bombe termine la partie.

## D'où vient chaque morceau

| Dans le code | Dans le cours |
|---|---|
| `index.html`, `main.js`, une classe par scène, `export default` (jeu 1) | TD3, parties 2 à 4 |
| `this.scene.start('Game')` sur un bouton, `window.score` | TD3, parties 3 et 4 |
| `config`, `preload`, `create`, `update` dans un fichier (jeu 2) | CM, étape 1 |
| `staticGroup`, `physics.add.sprite`, `collider`, `overlap` | CM, étapes 3, 4 et 6 |
| `anims.create`, `generateFrameNumbers`, `createCursorKeys`, `touching.down` | CM, étapes 4 et 5 |
| `physics.add.group`, `children.iterate`, `FloatBetween`, `disableBody` | CM, étape 6 |
| `countActive`, `enableBody`, bombes, `hitBomb`, `physics.pause`, `setTint` | TD1, partie 3 |
| `add.text`, `setText` | TD1, partie 3 |
| objets générés dans `update(time, delta)` avec un compteur (jeu 1) | TD3 (nuages et `delta`) |
| `this.sound.add(...)` puis `.play()` | TD3 (effets sonores) |

Écarts avec le cours, volontaires :

- Jeu 2 : le CM met `player.body.setGravityY(300)` en plus de la gravité de la config, et un saut de `-330`. Avec les deux, le joueur ne saute que de 90 pixels et n'atteint aucune plateforme. Il n'y a donc pas de `setGravityY` sur le joueur et le saut est de `-350`.
- Jeu 2 : le TD1 écrit `bomb.allowGravity = false;`. Cette ligne ne change rien telle quelle, on écrit `bomb.body.allowGravity = false;`.
- Jeu 2 : `scene: { key: 'jeu', ... }` dans la config, pour pouvoir relancer la partie avec `this.scene.start('jeu')` (même fonction que dans le TD3).

## Textes

Les textes sont dans les scènes (`menu.js`, `end.js`, `game.js`) pour le jeu 1 et dans `game.js` pour le jeu 2.
Ils sont courts et neutres, à adapter au thème : titre, phrases d'explication, message de fin.
Polices : `Georgia` pour les titres, `Courier New` pour le reste (Courier est aussi la police par défaut de Phaser).
