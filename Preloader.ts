module GravityGuy {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //  Load our actual games assets
            this.load.image('titlepage', 'assets/titlepage.jpg');
            this.load.image('logo', 'assets/logo.png');
            //this.load.audio('music', 'assets/title.mp3', true);
            //this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
            //this.load.image('level1', 'assets/level1.png');
            //added
            this.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-1', 'resources/tiles-1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');
            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 99); 
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            //end added
            

        }

        create() {

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);

        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

    }

} 