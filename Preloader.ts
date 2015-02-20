module GravityGuy {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            this.preloadBar = this.add.sprite(250, 470, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.loadAudio();
            this.loadMaps();
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
            this.load.audio('hero_death', ['audio/hero_death.mp3', 'audio/hero_death.mp3']);
            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.mp3']);
            this.load.audio('hero_jump', ['audio/hero_jump.mp3', 'audio/hero_jump.mp3']);
            this.load.audio('enemy_shoot', ['audio/enemy_shoot.mp3', 'audio/enemy_shoot.mp3']);

        }

        loadImages() {
            this.load.image('explosion_small', 'visuals/explosion_small.png');
            this.load.image('titlepage', 'visuals/title_background_scaled.png');
            this.load.image('title_planet', 'visuals/title_planet.png');
            this.load.image('tileset_1', 'resources/tileset_1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');

        }

        loadMaps() {

            
           // this.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_test', 'resources/level_test.json', null, Phaser.Tilemap.TILED_JSON);

        }

        loadSpritesheets() {

            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 99);
        }

    }

} 