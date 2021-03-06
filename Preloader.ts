﻿

module GravityGuy {

    export class Preloader extends Phaser.State {
        text: Phaser.Text
        pepper: Phaser.Sprite
        create() {

            this.game.stage.backgroundColor = '#FFFF00';

            this.game.load.onLoadStart.add(this.loadStart, this);
            this.game.load.onFileComplete.add(this.fileComplete, this);
            this.game.load.onLoadComplete.add(this.loadComplete, this);

            this.pepper = this.game.add.sprite(360, 196, 'pepper');
            this.pepper.animations.add('burn', [0, 1, 2, 3, 4], 9, true);
            this.pepper.play('burn');
            this.text = this.game.add.text(365, 490, "Preparing Resources...", { color: '#CC0000', font: 'Lucida Sans Unicode', size: '45px' });
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.loadAll, this);
        }


        preload() {

            this.game.load.spritesheet('pepper', 'visuals/spicy_pepper_sprite.png', 80, 120);

        }

        loadAll() {
            /*AUDIO*/
            this.load.audio('space_slam', 'audio/space_slam.mp3');
            this.load.audio('hero_death', ['audio/hero_death.mp3', 'audio/hero_death.mp3']);
            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.ogg']);
            this.load.audio('hero_jump', ['audio/hero_jump.mp3', 'audio/hero_jump.ogg']);
            this.load.audio('enemy_shoot', ['audio/enemy_shoot.mp3', 'audio/enemy_shoot.ogg']);
            this.load.audio('victory', ['audio/victory.mp3', 'audio/victory.ogg']);
            this.load.audio('invincibilityMusic', ['audio/invincibilityMusic.mp3', 'audio/invincibilityMusic.mp3']);
            this.load.audio('killEnemiesSound', ['audio/killEnemiesSound.mp3', 'audio/killEnemiesSound.mp3']);
            //   this.load.audio('hero_enemyChase_collision', ['audio/hero_enemyChase_collision.mp3', 'audio/hero_enemyChase_collision.mp3']);
            this.load.audio('footstep', ['audio/landing_sound.mp3', 'audio/landing_sound.ogg']);
            this.load.audio('game_won_song', ['audio/game_won_song.mp3', 'audio/game_won_song.ogg']);
            this.load.audio('enemy_death', ['audio/enemy_death.mp3', 'audio/enemy_death.ogg']);
            this.load.audio('grav', ['audio/sound_enemies_grav.mp3', 'audio/sound_enemies_grav.ogg']);
            this.load.audio('collision', ['audio/collision.mp3', 'audio/collision.ogg']);
            this.load.audio('bossmusic', ['audio/bossmusic.mp3', 'audio/bossmusic.ogg']);
            this.load.audio('shootingStar', ['audio/shootingStar.mp3', 'audio/shootingStar.mp3']);
            this.load.audio('lifeSound', ['audio/lifeSound.mp3', 'audio/lifeSound.mp3']);
            this.load.audio('sparkle', ['audio/sparkle.wav', 'audio/sparkle.wav']);
            this.load.audio('ammunition', ['audio/ammunition.mp3', 'audio/ammunition.mp3']);
            this.load.audio('invincibility', ['audio/invincibility.mp3', 'audio/invincibility.mp3']);

            /*IMAGES*/
            this.load.image('explosion_small', 'visuals/explosion_small.png');
            this.load.image('dust_cloud', 'visuals/dust_cloud.png');
            this.load.image('titlepage', 'visuals/title_background_scaled.png');
            this.load.image('title_planet', 'visuals/title_planet.png');
            this.load.image('tileset_1', 'resources/tileset_1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');
            this.load.image('background2', 'visuals/surface_macbeth.png');
            this.load.image('spaceship', 'visuals/spaceship.png');
            this.load.image('game_won_background', 'visuals/game_won.png');
            this.load.image('danger', 'visuals/danger.png');
            this.load.image('spacebar', 'visuals/spacebar.png');
            this.load.image('rightarrow', 'visuals/rightarrow.png');
            this.load.image('akey', 'visuals/akey.png');
            this.load.image('dkey', 'visuals/dkey.png');

            /* Invincibility */
            //  this.load.image('invincibility', 'visuals/invincibility.png'); // ########  in sprite

            /*MAPS*/
            this.load.tilemap('noob_level', 'resources/noob_level.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('joels_level', 'resources/joels_level.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_test', 'resources/level_test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('Level_3', 'resources/Level_3.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('boss_level', 'resources/boss_level.json', null, Phaser.Tilemap.TILED_JSON);

            /*SPRITESHEETS*/
            this.load.spritesheet('danger', 'visuals/danger.png', 200, 177);
            this.load.spritesheet('ammo', 'visuals/ammo.png', 44, 30);
            this.load.spritesheet('life', 'visuals/life.png', 42, 42); // example
            this.load.spritesheet('key', 'visuals/key.png', 24, 42);
            this.load.spritesheet('clock', 'visuals/clock.png', 90, 90);
            this.load.spritesheet('magic', 'visuals/magic.png', 90, 90);
            this.load.spritesheet('star', 'visuals/star.png', 24, 22);
            this.load.spritesheet('diamond', 'visuals/diamond.png', 32, 28);
            this.load.spritesheet('enemyAir', 'visuals/enemy_air.png', 65, 72);
            this.load.spritesheet('title_text', 'visuals/title_text.png', 474, 117);
            this.load.spritesheet('hero', 'visuals/hero_sprite_full.png', 41, 49);
            this.load.spritesheet('enemyChase', 'visuals/mega_enemy_sprite.png', 50, 40);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 93);
            this.load.spritesheet('alien', 'visuals/alien.jpg', 100, 200);
            this.load.spritesheet('enemyCrawl', 'visuals/enemycrawl.png', 65, 62);

            this.game.load.start();
            console.log("Hi! Thanks for playing our game and your interest in seeing if we have any bugs that show up in the console!! Good luck!");
        }

        loadStart() {
            this.text.setText("Loading ...");
        }
        fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
            this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

        }
        loadComplete() {
            this.text.setText("LOAD COMPLETE");
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startMainMenu, this);
        }

        startMainMenu() {
            this.pepper.destroy();
            this.text.destroy();
            this.game.state.start('MainMenu', true, false);
        }
    }
} 









