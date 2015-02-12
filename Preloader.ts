module GravityGuy {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            this.preloadBar = this.add.sprite(420, 475, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
           
            this.loadMaps();

            this.loadAudio();

            this.loadSpritesheets();

            this.loadImages();
            

        }

        create() {

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);

        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

        loadAudio() {

            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.mp3']);

        }

        loadImages() {

            this.load.image('titlepage', 'visuals/title_background_scaled.png');
            this.load.image('title_planet', 'visuals/title_planet.png');
            this.load.image('tiles-1', 'resources/tiles-1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');

        }

        loadMaps() {

            this.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);

        }

        loadSpritesheets() {

            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 99);
        }




    }


} 