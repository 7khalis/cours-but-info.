# Jeu 2 : Platformer

Un personnage saute de plateforme en plateforme pour ramasser douze objets. Quand tout est ramassé, les objets reviennent et une bombe apparait. Une bombe touchée met fin à la partie. Le score augmente de 10 à chaque objet.

C'est le jeu du CM (étapes 1 à 6) et du TD1 : tout tient dans un seul fichier JavaScript, avec les fonctions `preload`, `create` et `update`.

Ce guide se suit dans l'ordre. Après chaque étape il y a un test : si tu ne vois pas ce qui est annoncé, ne passe pas à la suite.

## Étape 0 : préparer le thème et les fichiers

### Les images du thème

Pour un nouveau thème (dauphin, noël, rocher, voiture, lunettes...), seules ces images changent. Garde le même nom de fichier.

| Fichier | Taille | À quoi ça sert | Idée |
|---|---|---|---|
| `fond.png` | au moins 800 x 600 | décor | paysage lié au mot |
| `plateforme.png` | exactement 400 x 32 | le sol (affiché en double largeur) et les trois plateformes | herbe, glace, nuage, pierre |
| `joueur.png` | 288 x 48, 9 cases de 32 x 48 | le personnage | voir plus bas |
| `bon.png` | environ 40 x 40 | objet à ramasser, 10 points | un élément du thème |
| `mauvais.png` | environ 30 x 30 | la bombe | un intrus du thème |

Pour les trouver :

1. Cherche sur internet « mot du thème png transparent » (le fond transparent est important pour `bon`, `mauvais` et `joueur`).
2. Enregistre l'image au format PNG.
3. Redimensionne-la à la taille du tableau avec un site de redimensionnement d'image ou avec Paint (Redimensionner, en pixels, sans conserver les proportions si besoin).
4. Renomme-la avec le nom du tableau.

### Le joueur : deux possibilités

- **Garder le personnage du cours** (`dude.png` du TD1, renommé `joueur.png`). Rien à changer dans le code. C'est le plus rapide.
- **Mettre une seule image du thème** (par exemple un dauphin de 32 x 48). Il faut alors changer quelques lignes, elles sont indiquées dans l'encadré « Joueur avec une seule image » à la fin de l'étape 6.

### Les fichiers à récupérer sur le réseau

- `phaser.min.js` : dans le dossier `js` du TD3 (version 3.55). Le CM utilise un lien vers internet, mais une copie locale évite les soucis.
- Les sons du TD1 : `ding.mp3` devient `bon.mp3`, `criMort.mp3` devient `mauvais.mp3`.

### Les dossiers

Dans ton W, crée cette arborescence :

```
jeu2/
├── index.html
└── dist/
    ├── assets/
    │   ├── img/        fond.png, plateforme.png, joueur.png, bon.png, mauvais.png
    │   └── sounds/     bon.mp3, mauvais.mp3
    └── js/
        ├── lib/        phaser.min.js
        └── game.js
```

### Lancer le jeu

Ouvre toujours le jeu avec l'adresse du serveur web de l'IUT, pas en double-cliquant sur `index.html`. Sinon les images ne se chargent pas (CM : « utiliser un serveur web »). Après chaque modification, enregistre et recharge la page (F5 ou Ctrl + F5).

Pour voir les erreurs : touche F12, onglet Console.

## Étape 1 : `index.html`

C'est le fichier passe-partout du CM, avec Phaser puis ton script.

```html
<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Platformer</title>
    <script src="dist/js/lib/phaser.min.js"></script>
    <style type="text/css">
        body {
            margin: 0;
        }
    </style>
</head>
<body>
    <script src="dist/js/game.js"></script>
</body>
</html>
```

## Étape 2 : la config et le jeu (début de `game.js`)

La config donne la taille de la fenêtre et la physique Arcade avec une gravité de 300 (CM, étapes 1 et 3). `scene` indique les trois fonctions du jeu. La clé `key: 'jeu'` sert plus tard à relancer la partie.

```js
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        key: 'jeu',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
```

Ensuite, déclare toutes les variables du jeu. Elles servent dans plusieurs fonctions, on les utilisera au fil des étapes.

```js
var platforms;
var player;
var cursors;
var stars;
var bombs;
var score;
var scoreText;
var gameOver;
var sonBon;
var sonMauvais;
```

Ajoute aussi trois fonctions vides, sinon Phaser ne trouve rien à appeler :

```js
function preload() {
}

function create() {
}

function update() {
}
```

**Test.** Un rectangle noir de 800 x 600 apparait. La console ne montre aucune erreur rouge.

## Étape 3 : charger les ressources (`preload`)

CM, étape 2. Le premier nom est la clé qu'on utilisera ensuite, le second le chemin du fichier.

```js
function preload() {
    this.load.image('fond', 'dist/assets/img/fond.png');
    this.load.image('plateforme', 'dist/assets/img/plateforme.png');
    this.load.image('bon', 'dist/assets/img/bon.png');
    this.load.image('mauvais', 'dist/assets/img/mauvais.png');
    this.load.spritesheet('joueur', 'dist/assets/img/joueur.png', { frameWidth: 32, frameHeight: 48 });
}
```

Remplace la fonction `preload` vide par celle-ci.

## Étape 4 : le monde (`create`)

CM, étape 3. Les plateformes sont dans un groupe statique : elles ne bougent pas et la gravité ne les touche pas.

```js
function create() {
    // valeurs de départ (create est rappelé à chaque nouvelle partie)
    score = 0;
    gameOver = false;

    this.add.image(400, 300, 'fond');

    // le sol et les plateformes
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'plateforme').setScale(2).refreshBody();
    platforms.create(600, 400, 'plateforme');
    platforms.create(50, 250, 'plateforme');
    platforms.create(750, 220, 'plateforme');
}
```

Le sol utilise la même image, agrandie deux fois pour couvrir toute la largeur.

**Test.** Le fond, le sol et trois plateformes sont visibles.

## Étape 5 : le joueur

CM, étape 4. Dans `create`, à la suite de ce qui existe :

```js
// le joueur
player = this.physics.add.sprite(100, 450, 'joueur');
player.setBounce(0.2);
player.setCollideWorldBounds(true);
this.physics.add.collider(player, platforms);

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
```

Les cases 0 à 3 de l'image sont la marche vers la gauche, la 4 est le personnage de face, les 5 à 8 la marche vers la droite. `repeat: -1` répète l'animation sans fin.

Le CM ajoute aussi `player.body.setGravityY(300)`. On ne le met pas ici : avec cette gravité en plus de celle de la config, le saut n'est pas assez haut pour atteindre les plateformes.

**Test.** Le joueur tombe de son point de départ et se pose sur le sol. Il rebondit un tout petit peu.

## Étape 6 : le clavier

CM, étape 5. Dans `create`, à la suite :

```js
cursors = this.input.keyboard.createCursorKeys();
```

Remplace la fonction `update` vide. Elle est appelée environ 60 fois par seconde. Le saut n'est possible que si le joueur touche le sol (`touching.down`), sinon il pourrait sauter en l'air.

```js
function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // saut : seulement si le joueur touche le sol
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}
```

Le `if (gameOver)` du début arrête le contrôle du joueur quand la partie est finie. `gameOver` est une variable déclarée à l'étape 2 et mise à `false` dans `create`.

**Test.** Flèches gauche et droite pour avancer, flèche haut pour sauter. Le joueur peut monter sur la première plateforme, puis sur les autres.

### Joueur avec une seule image

Si ton `joueur.png` est une seule image (pas 9 cases), change ceci :

1. Dans `preload`, remplace la ligne `this.load.spritesheet(...)` par :
   ```js
   this.load.image('joueur', 'dist/assets/img/joueur.png');
   ```
2. Dans `create`, supprime les trois blocs `this.anims.create({ ... });`.
3. Dans `update`, supprime les trois lignes `player.anims.play(...)`.
4. Plus bas (étape 10), supprime aussi la ligne `player.anims.play('turn');` de `hitBomb`.

Le reste ne change pas.

## Étape 7 : les objets à ramasser

CM, étape 6. Dans `create`, à la suite. Le groupe contient 12 objets espacés de 70 pixels. Chacun a un rebond différent, entre 0,4 et 0,8.

```js
// les objets à récupérer : 12 objets espacés de 70 pixels
stars = this.physics.add.group({
    key: 'bon',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});

this.physics.add.collider(stars, platforms);
this.physics.add.overlap(player, stars, collectStar, null, this);
```

Le `overlap` appelle la fonction `collectStar` quand le joueur touche un objet. Écris cette fonction à la suite du fichier, en dehors des autres :

```js
function collectStar(player, star) {
    star.disableBody(true, true);
}
```

**Test.** Douze objets tombent et rebondissent sur les plateformes. Le joueur les fait disparaitre en les touchant.

## Étape 8 : le score

TD1, partie 3. Dans `create`, à la suite :

```js
scoreText = this.add.text(16, 16, 'Score : 0', { fontFamily: 'Courier New', fontSize: '32px', fill: '#000' });
```

Complète `collectStar` pour compter les points :

```js
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score : ' + score);
}
```

**Test.** Le score monte de 10 à chaque objet.

## Étape 9 : un nouveau tour et des bombes

TD1, partie 3. Dans `create`, à la suite, on crée le groupe de bombes. Elles rebondissent sur les plateformes, et le joueur y est sensible avec `hitBomb`.

```js
// les objets à éviter
bombs = this.physics.add.group();
this.physics.add.collider(bombs, platforms);
this.physics.add.collider(player, bombs, hitBomb, null, this);
```

Dans `collectStar`, à la fin, ajoute le nouveau tour : quand il n'y a plus d'objet actif, on les remet tous en haut et une bombe apparait.

```js
// tout est ramassé : nouveau tour et une bombe de plus
if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
    });

    // la bombe apparait du côté opposé au joueur
    var x = (player.x < 400) ? Phaser.Math.FloatBetween(400, 800) : Phaser.Math.FloatBetween(0, 400);

    var bomb = bombs.create(x, 16, 'mauvais');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.FloatBetween(-200, 200), 20);
    bomb.body.allowGravity = false;
}
```

`bomb.setBounce(1)` fait rebondir la bombe sans jamais perdre de vitesse. Le TD écrit `bomb.allowGravity = false;`, mais c'est `bomb.body.allowGravity` qui supprime vraiment la gravité.

Il manque encore la fonction `hitBomb`, qu'on écrit à l'étape suivante. Pour tester maintenant, ajoute-la vide à la fin du fichier :

```js
function hitBomb(player, bomb) {
}
```

**Test.** Après le 12e objet, les objets reviennent en haut et une bombe se met à rebondir partout. Une bombe de plus à chaque tour.

## Étape 10 : la fin de partie

TD1, partie 3. Remplace la fonction `hitBomb` vide. Le texte « Rejouer » est un bouton : au clic, `this.scene.start('jeu')` relance la scène, avec la clé donnée dans la config (TD3, partie 4).

```js
function hitBomb(player, bomb) {
    this.physics.pause();          // physique en pause
    player.setTint(0xff0000);      // le joueur devient rouge
    player.anims.play('turn');
    gameOver = true;               // on arrête le jeu à l'aide d'un boolean

    this.add.text(400, 230, 'Perdu', { fontFamily: 'Georgia', fontSize: '80px', fill: '#000' })
        .setOrigin(0.5);

    this.add.text(400, 330, 'Rejouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#fff', backgroundColor: '#000' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('jeu');
        });
}
```

**Test.** Toucher une bombe arrête tout, le joueur devient rouge et « Perdu » apparait. Un clic sur « Rejouer » relance une partie à zéro, score compris.

## Étape 11 : les sons

TD1, partie 3. Dans `preload`, ajoute :

```js
this.load.audio('sonBon', 'dist/assets/sounds/bon.mp3');
this.load.audio('sonMauvais', 'dist/assets/sounds/mauvais.mp3');
```

À la fin de `create` :

```js
// sons
sonBon = this.sound.add('sonBon');
sonMauvais = this.sound.add('sonMauvais');
```

Dans `collectStar`, juste après `star.disableBody(true, true);` :

```js
sonBon.play();
```

Dans `hitBomb`, juste après `gameOver = true;` :

```js
sonMauvais.play();
```

**Test final.** Un son à chaque objet, un autre à la bombe. Si tu n'entends rien, clique d'abord dans la page : certains navigateurs bloquent le son avant le premier clic.

## Problèmes fréquents

| Ce qu'on voit | Cause probable |
|---|---|
| Page vide | jeu ouvert par le fichier et pas par le serveur ; erreur dans la console (F12) |
| `Phaser is not defined` | `phaser.min.js` absent ou chargé après `game.js` |
| Une image est remplacée par un carré avec une croix | mauvais nom ou mauvais chemin dans `preload` ; majuscules différentes |
| Le joueur traverse le sol | collider du joueur oublié |
| Le joueur ne saute pas | la condition `touching.down` ou `cursors.up` mal écrite |
| Impossible d'atteindre une plateforme | `plateforme.png` n'a pas la bonne taille, ou saut changé |
| Les objets ne rebondissent pas sur les plateformes | collider des objets oublié |
| `collectStar is not defined` | la fonction n'est pas écrite, ou elle est dans une autre fonction |
| Rejouer ne remet pas le score à zéro | `score = 0;` absent au début de `create` |

## Pour aller plus loin

- Le bouton plein écran (TD1).
- Une musique en boucle (TD3).
- Plusieurs vies avant la fin de partie.

## Annexe : code complet

Le code final de chaque fichier, pour comparer avec le tien.

### `index.html`

```html
<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Platformer</title>
    <script src="dist/js/lib/phaser.min.js"></script>
    <style type="text/css">
        body {
            margin: 0;
        }
    </style>
</head>
<body>
    <script src="dist/js/game.js"></script>
</body>
</html>
```

### `dist/js/game.js`

```js
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        key: 'jeu',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var platforms;
var player;
var cursors;
var stars;
var bombs;
var score;
var scoreText;
var gameOver;
var sonBon;
var sonMauvais;

function preload() {
    this.load.image('fond', 'dist/assets/img/fond.png');
    this.load.image('plateforme', 'dist/assets/img/plateforme.png');
    this.load.image('bon', 'dist/assets/img/bon.png');
    this.load.image('mauvais', 'dist/assets/img/mauvais.png');
    this.load.spritesheet('joueur', 'dist/assets/img/joueur.png', { frameWidth: 32, frameHeight: 48 });

    this.load.audio('sonBon', 'dist/assets/sounds/bon.mp3');
    this.load.audio('sonMauvais', 'dist/assets/sounds/mauvais.mp3');
}

function create() {
    // valeurs de départ (create est rappelé à chaque nouvelle partie)
    score = 0;
    gameOver = false;

    this.add.image(400, 300, 'fond');

    // le sol et les plateformes
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'plateforme').setScale(2).refreshBody();
    platforms.create(600, 400, 'plateforme');
    platforms.create(50, 250, 'plateforme');
    platforms.create(750, 220, 'plateforme');

    // le joueur
    player = this.physics.add.sprite(100, 450, 'joueur');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

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

    cursors = this.input.keyboard.createCursorKeys();

    // les objets à récupérer : 12 objets espacés de 70 pixels
    stars = this.physics.add.group({
        key: 'bon',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // les objets à éviter
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    scoreText = this.add.text(16, 16, 'Score : 0', { fontFamily: 'Courier New', fontSize: '32px', fill: '#000' });

    // sons
    sonBon = this.sound.add('sonBon');
    sonMauvais = this.sound.add('sonMauvais');
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // saut : seulement si le joueur touche le sol
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    sonBon.play();

    score += 10;
    scoreText.setText('Score : ' + score);

    // tout est ramassé : nouveau tour et une bombe de plus
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // la bombe apparait du côté opposé au joueur
        var x = (player.x < 400) ? Phaser.Math.FloatBetween(400, 800) : Phaser.Math.FloatBetween(0, 400);

        var bomb = bombs.create(x, 16, 'mauvais');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.FloatBetween(-200, 200), 20);
        bomb.body.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();          // physique en pause
    player.setTint(0xff0000);      // le joueur devient rouge
    player.anims.play('turn');
    gameOver = true;               // on arrête le jeu à l'aide d'un boolean
    sonMauvais.play();

    this.add.text(400, 230, 'Perdu', { fontFamily: 'Georgia', fontSize: '80px', fill: '#000' })
        .setOrigin(0.5);

    this.add.text(400, 330, 'Rejouer', { fontFamily: 'Georgia', fontSize: '48px', fill: '#fff', backgroundColor: '#000' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('jeu');
        });
}
```
