# TP jeux à thème

Deux petits jeux Phaser. On change les images selon le mot du thème, le code ne bouge pas.
Tout vient du cours (CM, TD1, TD2, TD3). Phaser 3.55 (le `phaser.min.js` du TD3).

```
Partie2_TP_Jeux_Themes/
├── Jeu1_Attrape/            objets qui tombent, un bon et un mauvais
│   ├── index.html
│   └── dist/
│       ├── assets/img/      fond, sol, joueur, bon, mauvais
│       ├── assets/sounds/   bon.mp3, mauvais.mp3
│       ├── css/main.css
│       └── js/
│           ├── lib/phaser.min.js
│           ├── main.js      config + liste des scènes
│           └── scenes/      menu.js, game.js, end.js
└── Jeu2_Platformer/         carte à défilement, pièces et pics
    ├── index.html
    └── dist/
        ├── assets/img/      sol, piece, pic, joueur
        ├── assets/map/      carte.json (la map Tiled du TD2)
        ├── assets/sounds/   bon.mp3, mauvais.mp3
        ├── css/main.css
        └── js/
            ├── lib/phaser.min.js
            ├── main.js
            └── scenes/      menu.js, game.js, end.js
```

## Lancer un jeu

Il faut un serveur web (le cours l'explique, et `main.js` est un module).

```
cd Jeu1_Attrape        # ou Jeu2_Platformer
python3 -m http.server
```

Puis ouvrir http://localhost:8000. Sur le serveur de l'IUT, copier le dossier du jeu dans son W.

## Changer de thème : les images à remplacer

On garde le même nom de fichier et la même taille.

### Jeu 1 : attrape

| Fichier | Taille | Rôle |
|---|---|---|
| `fond.png` | 1200 x 679 | fond (menu, jeu, fin) |
| `sol.png` | 400 x 32 | sol, affiché en x2 |
| `joueur.png` | 288 x 48 | 9 images de 32 x 48 : 0-3 gauche, 4 face, 5-8 droite |
| `bon.png` | libre (48 x 44 ici) | rapporte 10 points |
| `mauvais.png` | libre (28 x 28 ici) | enlève une vie |

### Jeu 2 : platformer

| Fichier | Taille | Rôle |
|---|---|---|
| `sol.png` | 800 x 32 | 25 tuiles de 32 x 32 : décor et murs de la map |
| `piece.png` | 192 x 32 | seule la première case de 32 x 32 est utilisée |
| `pic.png` | 32 x 32 | tuile qui fait perdre une vie |
| `joueur.png` | 288 x 48 | comme dans le jeu 1 |

La map `carte.json` ne se modifie pas : elle réclame des tilesets nommés `ground_1x1`, `coin` et `pic`.
Dans `game.js` ces noms sont les clés des `load.image`, le fichier derrière peut s'appeler comme on veut.

## Règles

**Jeu 1.** Flèches gauche et droite. Un bon objet = 10 points, un mauvais = une vie en moins (3 vies).
Plus on en attrape, plus il en tombe. À 0 vie on passe à l'écran de fin avec le score.

**Jeu 2.** Flèches pour bouger, flèche haut pour sauter. 28 pièces à ramasser, 5 vies, un pic enlève une vie.
Après un pic on est protégé une seconde. Toutes les pièces : gagné. Plus de vie : perdu.

## D'où vient chaque morceau

| Dans le code | Dans le cours |
|---|---|
| `index.html`, `main.js`, une classe par scène, `export default` | TD3, parties 2 à 4 |
| `this.scene.start('Game')` sur un bouton | TD3, partie 4 |
| `window.score`, `window.resultat` | TD3 (variables globales) |
| `staticGroup`, `physics.add.sprite`, `collider`, `overlap` | CM, étapes 3, 4 et 6 |
| `anims.create`, `generateFrameNumbers`, `createCursorKeys` | CM, étapes 4 et 5 |
| `physics.add.group`, `disableBody(true, true)` | CM étape 6, TD1 |
| objets générés dans `update(time, delta)` avec un compteur | TD3 (nuages, `delta`) |
| tilemap, calques, `setCollisionBetween`, caméra | TD2, partie 2 |
| `setTileIndexCallback`, `removeTileAt` | TD2, partie 3 |
| barre de vie : `add.rectangle`, `setScrollFactor(0)`, `setSize` | TD2, partie 4 |
| `onFloor()`, `setTint`, `clearTint` | TD2 remarque, TD1 `hitBomb` |
| `this.sound.add(...)` puis `.play()` | TD3 (effets sonores) |

## Textes

Les textes sont dans `menu.js` et `end.js` (et les compteurs dans `game.js`). Ils sont courts et neutres,
à adapter au thème : le titre du menu, les phrases d'explication, le message de fin.
Polices : `Georgia` pour les titres, `Courier New` pour le reste (Courier est aussi la police par défaut de Phaser).
