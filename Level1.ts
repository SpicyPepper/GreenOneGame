module GravityGuy {

    var bulletList;
    var bulletTime;
    var bulletFired;
    var bulletsFired;
    var totalBullets;
    var enemyChaseBlockedAfterDeath;
    var enemies;
    var enemiesTotal;
    var enemiesDead;
    var enemiesKilled;
    var enemyBulletList;
    var enemyBulletTime;
    var enemyBulletWait;
    var enemyBulletsFired;
    var enemyAlive;
    var heroAlive;
    var enemyAliveCount;
    var scoreString;
    var score_text;
    var score;
    var lives;
    var numLives;
    var layer;
    var gravityButton;
    var cursors;
    var jumpLocation;
    var jumpLocationList = [];
    var heroJumped;
    var enemyJump;
    var first;
    var floor;
    var floorEnemy;
    var floorOtherEnemy;
    var hero_scale = 0.7;
    var enemy_scale = 0.8;
    var explode_emit;
    var dust_cloud_emit;
    var levelComplete;
    var respawn;
    var respawnButton;
    var escapeKey;
    var game_over;
    var bonusAdded;
    var swapGravity;
    var keyboard_grav;
    var firstTimeGameOver;
    var timeDelay;
    var text;
    var grd;
    var enemyLocationsX; 
    var enemyLocationsY;

    export class Level1 extends Phaser.State {

        background: Phaser.TileSprite;

        map: Phaser.Tilemap

        music: Phaser.Sound
        sound_hero_death: Phaser.Sound
        sound_hero_jump: Phaser.Sound
        sound_hero_gravity: Phaser.Sound
        sound_hero_fire: Phaser.Sound
        sound_enemy_shoot: Phaser.Sound
        victoryMusic: Phaser.Sound
        sound_hero_enemyChase_collision: Phaser.Sound
        sound_landing: Phaser.Sound

        bullets: Phaser.Group
        enemyBullets: Phaser.Group
     //   enemies: Phaser.Group

        //player: GravityGuy.Player;
        hero: GravityGuy.Hero
        enemyChase: GravityGuy.enemyChase
        enemy: GravityGuy.Enemy

        create() {

            /*Working on key binding*/
            keyboard_grav = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keyboard_grav.onDown.add(this.attemptGravitySwap, this);

            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

            /* If escape is pressed, game ends */
            escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);

            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;

            this.music = this.add.audio('House');
            this.sound_landing = this.add.audio('landing_sound');
            this.sound_hero_gravity = this.add.audio('hero_gravity');
            this.sound_hero_death = this.add.audio('hero_death');
            this.sound_hero_jump = this.add.audio('hero_jump');
            this.sound_hero_fire = this.add.audio('hero_fire');
            this.sound_enemy_shoot = this.add.audio('enemy_shoot');
            this.sound_hero_enemyChase_collision = this.add.audio('hero_enemyChase_collision');
            this.victoryMusic = this.add.audio('victory');
            this.music.play();

            explode_emit = this.game.add.emitter(0, 0, 20);
            explode_emit.makeParticles('explosion_small');
            explode_emit.gravity = 200;

            dust_cloud_emit = this.game.add.emitter(0, 0, 10000);
            dust_cloud_emit.makeParticles('dust_cloud');
            dust_cloud_emit.bounce.y = 0;
            dust_cloud_emit.setYSpeed(0, 0);
            dust_cloud_emit.setXSpeed(0, 0);
            dust_cloud_emit.allowGravity = false;
            dust_cloud_emit.bounce.x = 0;
            dust_cloud_emit.gravity = 0;

            //LEVEL :D
            this.map = this.add.tilemap('level_test');
            //  this.map = this.add.tilemap('joels_level'); //### HERE IS TEST MAP. SWAP TO PLAY SHITTY LEVEL. PLEASE SOMEONE MAKE A DIFFERENT ONE.
            this.map.addTilesetImage('tileset_1');

            this.map.setCollisionByExclusion([]);

            //    layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');

            layer.resizeWorld();

            this.hero = new Hero(this.game, 150, 300);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);

            this.enemyChase = new enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(25, this.timedUpdate, this);


            enemiesTotal = 15;
            enemiesDead = 0;

            bulletList = [];
            enemyBulletList = [];

            enemies = [];

            enemyLocationsX = [this.game.rnd.integerInRange(450, 815), this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3119, 3518), this.game.rnd.integerInRange(3519, 3729),
                this.game.rnd.integerInRange(3730, 4047), this.game.rnd.integerInRange(6447, 7000), this.game.rnd.integerInRange(7001, 7790), this.game.rnd.integerInRange(7791, 8368),
                this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100),
                this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560)];
            enemyLocationsY = [373, 373, 129, 373, 208, 192, 192, 96, 32, 192, 192, 192, 192, 208, 208];

            this.createEnemies();
            //for (var i = 0; i < enemiesTotal; i++) {
            //    console.log("created");
            //    if (i == 0) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
            //    } else if (i == 1) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
            //    } else if (i == 2) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
            //    } else if (i == 3) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
            //    } else if (i == 4) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
            //    } else if (i == 5) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
            //    } else if (i == 6) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
            //    } else if (i == 7) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
            //    } else if (i == 8) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
            //    } else if (i == 9) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
            //    } else if (i == 10) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
            //    } else if (i == 11) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
            //    } else if (i == 12) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
            //    } else if (i == 13) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
            //    } else if (i == 14) {
            //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
            //    }
            //    anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
            //    this.physics.arcade.enableBody(anotherEnemy);
            //    enemies.push(anotherEnemy);
            //    //    console.log('enemy created at ' + newEnemyX);
            //}

            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');

            first = true;
            floor = true;
            floorEnemy = true;
            floorOtherEnemy = true;

            gravityButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            cursors = this.game.input.keyboard.createCursorKeys();
            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

            //text = this.add.text(this.world.centerX, game.world.centerY, "- phaser -\nrocking with\ngoogle web fonts");

            //Bullets
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(30, 'bullet');
            this.bullets.setAll('anchor.x', 1);
            this.bullets.setAll('anchor.y', 0);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);

            //end added 

            //Enemy Bullets
            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(30, 'enemybullet');
            this.enemyBullets.setAll('anchor.x', 1);
            this.enemyBullets.setAll('anchor.y', 0);
            this.enemyBullets.setAll('outOfBoundsKill', false);
            this.enemyBullets.setAll('checkWorldBounds', true);

            levelComplete = false;
            respawn = true;
            game_over = false;
            bonusAdded = false;
            swapGravity = false;
            firstTimeGameOver = true;
            bulletTime = 0;
            bulletFired = false;
            bulletsFired = 0;
            enemies;
            enemiesTotal;
            enemiesDead;
            enemiesKilled = 0;
            enemyBulletTime = 0;
            enemyBulletWait = 0;
            enemyBulletsFired = 0;
            enemyAlive = false;
            heroAlive = true;
            scoreString = 'Score : ';
            score = 0;
            numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 50;
        }

        removeEnemies() {
            for (var i = 0; i < enemiesTotal; i++) {
                enemies[i].destroy();
            }
            enemies = [];
        }

        createEnemies() {
            enemies = [];
            for (var i = 0; i < enemiesTotal; i++) {
                var anotherEnemy = new Enemy(this.game, enemyLocationsX[i], enemyLocationsY[i]);
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
            }
        }

        update() {

            if (!this.hero.alive && heroAlive) {
                this.deathBurst(this.hero);
                this.sound_hero_death.play();
                if (numLives == 0) {
                    this.itsGameOver();
                } else {
                    numLives -= 1;
                    this.endRound();
                }
            }
            this.collideEverything();
            /* When hero is alive */
            if (heroAlive) {
                this.enemyChase.body.velocity.x = 450;
                if (this.enemyChase.x < (this.hero.x - 300) || this.enemyChase.y < (this.hero.y - 512) || this.enemyChase.y > (this.hero.y + 512)) {
                    this.enemyChase.x = this.hero.x - 200;
                    this.enemyChase.y = this.hero.y;
                    if (floorEnemy != floor) {
                        this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;
                        this.flipEnemy();
                    }
                    floorEnemy = floor;
                    jumpLocationList = [];
                }

                if (this.enemyChase.x > (this.hero.x)) {
                    this.enemyChase.x = this.hero.x - 5;
                    if (floorEnemy != floor)
                        this.flipEnemy();
                    floorEnemy = floor;
                    jumpLocationList = [];
                }

                // lose button
                if (escapeKey.isDown) {
                    game_over = true;
                    this.music.mute = true;
                    this.game.state.start('GameOver', true, false);
                }
                if (!levelComplete && this.hero.x >= 17150) {
                    this.levelComplete();
                }

                for (var i = 0; i < bulletsFired; i++) {
                    if (bulletList[i].x - this.hero.x >= 400) {
                        this.resetBullet(bulletList[i]);
                    }
                }
                //DON'T REMOVE
                //if (swapGravity) {
                //    this.flipHero();
                //    heroJumped = true;
                //    jumpLocation = this.hero.body.x;
                //    //jumpLocationList.push(jumpLocation);
                //    this.hero.body.gravity.y = -this.hero.body.gravity.y;
                //    first = false;
                //}

                //if (this.enemyChase.body.x >= jumpLocation && heroJumped && (this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
                //    if (floorEnemy != floor) {
                //        this.flipEnemy();
                //        this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;
                //    }
                //    heroJumped = false;
                //}
                //END DON'T REMOVE
                //NEW
                if (swapGravity) {
                    
                    //heroJumped = true;
                    jumpLocation = this.hero.body.x;
                    jumpLocationList.push(jumpLocation);
                    this.flipHero();
                    this.hero.body.gravity.y = -this.hero.body.gravity.y;
                    first = false;
                }
                //  console.log("OUTSIDE: " + jumpLocationList.length);
                for (var i = 0; i < jumpLocationList.length; i++) {
                    //   console.log("IN");
                    if (this.enemyChase.body.x >= jumpLocationList[i] && (this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
                        // if (floorEnemy != floor) {
                        this.flipEnemy();
                        this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;

                        jumpLocationList.splice(i, 1);            
                        // }
                        //heroJumped = false;
                    } else {
                        break;
                    }
                }
                //END NEW
                for (var j = enemiesDead; j < enemies.length; j++) {
                    if (enemies[j].alive && enemies[j].x - this.hero.x <= 400 && enemies[j].y - this.hero.y > 25) {
                        if (enemyJump && (enemies[j].body.blocked.down || enemies[j].body.blocked.up)) {
                            this.flipOtherEnemy(enemies[j]);
                            enemies[j].body.gravity.y = enemies[j].body.gravity.y * -1;
                            enemyJump = false;
                        }
                    }
                }
                if (this.enemyChase.body.x <= this.hero.body.x - 300) {
                    this.enemyChase.body.x = this.hero.body.x - 100;
                }

                if (cursors.right.isDown) {
                    this.fireBullet();
                }
                for (var j = enemiesDead; j < enemies.length; j++) {
                    if (enemies[j].alive && enemies[j].x - this.hero.x <= 575) {
                        enemyBulletWait++;
                        if (enemyBulletWait % 75 == 0) {
                            this.fireEnemyBullet(enemies[j]);
                        }
                    }
                    if (enemies[j].x < this.hero.x) {
                        enemiesDead++;
                    }
                }
                swapGravity = false;
            } else { // HERO DEAD
                if (!this.enemyChase.blocked_after_end && (this.enemyChase.body.blocked.right || this.enemyChase.body.blocked.down)) {
                    this.enemyChase.blocked_after_end = true;

                    this.enemyChase.play('idle', 4, true);
                    this.enemyChase.body.velocity.x = 0;
                }
                swapGravity = false;
                jumpLocationList = [];
                //   console.log(this.hero.body.gravity.y);            
                if (this.hero.body.gravity.y < 0)
                    this.hero.body.gravity.y = this.hero.body.gravity.y * -1;
                if (this.enemyChase.body.gravity.y < 0)
                    this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;
                if (!floor) {
                    this.flipHero();
                }
                if (!floorEnemy) {
                    this.flipEnemy();
                }
                floor = true;
                if (respawnButton.isDown && !respawn) {
                    
                    this.hero.reset(150, 300);
                    this.enemyChase.reset(0, 300);
                    respawn = true;
                    score = 0;
                    heroAlive = true;
                    this.enemyChase.blocked_after_end = false;
                    this.enemyChase.animations.play('run');
                    this.hero.alive = true;
                    enemiesKilled = 0;
                   // console.log("WTF")
                   // this.game.camera.x = 0;
                    floor = true;

                    //for (var i = 0; i < enemiesTotal; i++) {
                    //    enemies[i].kill();
                    //    console.log("hi " + i);
                    //}
                   // enemies.
                    totalBullets = 50;

                    for (var i = 0; i < enemyBulletsFired; i++) {
                        enemyBulletList[i].kill();
                    }
                    //for (var i = 0; i < enemiesTotal; i++) {
                    //    enemies[i].revive();
                    //}
                    //this.hero.body.gravity.y = 20000;
                    //this.enemyChase.body.gravity.y = 18000;
                    this.removeEnemies();
                    this.createEnemies();
                    //for (var i = 0; i < enemiesTotal; i++) {
                    //   /* THE PROBLEM COMES F*/
                    //    if (i === 0) {
                    //        enemies[i].reset((this.game.rnd.integerInRange(450, 815), 373);
                    //    if (i == 0) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
                    //    } else if (i == 1) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
                    //    } else if (i == 2) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
                    //    } else if (i == 3) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
                    //    } else if (i == 4) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
                    //    } else if (i == 5) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
                    //    } else if (i == 6) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
                    //    } else if (i == 7) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
                    //    } else if (i == 8) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
                    //    } else if (i == 9) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
                    //    } else if (i == 10) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
                    //    } else if (i == 11) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
                    //    } else if (i == 12) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
                    //    } else if (i == 13) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
                    //    } else if (i == 14) {
                    //        var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
                    //    }
                    //    anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                    //    this.physics.arcade.enableBody(anotherEnemy);
                    //    enemies.push(anotherEnemy);
                    //    //    console.log('enemy created at ' + newEnemyX);
                    //}
                    //for (var i = 0; i < this.enemyBullets.length; i++) {
                    //   if (this.enemyBullets[i] != undefined )
                    //        this.enemyBullets[i].kill();
                    //}
                    //var bulletTemp = this.enemyBullets.getFirstExists(false);
                    //while (bulletTemp) {
                    //    console.log(bulletTemp);
                    //    bulletTemp.kill();
                    //    bulletTemp = this.enemyBullets.getFirstExists(false);

                    //}

                    //if (bullet != undefined)
                    //    bullet.kill();
                    //if(enemyBullet != undefined)
                    //    enemyBullet.kill();
                } else if (game_over && numLives == 0) {
                    //this.game.camera.x = this.hero.x;
                    if (firstTimeGameOver) {
                        firstTimeGameOver = false;
                        timeDelay = (Math.floor(this.game.time.time / 1000) % 60) + 5;
                    }
                    //var time = (Math.floor(this.game.time.time / 1000) % 60) + 500;
                    //var currentTime = Math.floor(this.game.time.time / 1000) % 60;
                    if ((Math.floor(this.game.time.time / 1000) % 60) >= timeDelay) {
                        this.music.mute = true;
                        this.game.state.start('GameOver', true, false);
                    }
                }
            }
        }

        attemptGravitySwap() {

            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up)
        }

        itsGameOver() {
            game_over = true;
            heroAlive = false;
            this.hero.kill()
            this.enemyChase.kill();
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].kill();
            }

        }
        timedUpdate() {
            if (!game_over && !levelComplete && respawn) {
                score += 10;
                this.background.tilePosition.x -= 4;
            }
        }

        levelComplete() {
            this.hero.kill();
            this.hero.body.y = - 200;
            this.enemyChase.kill();
            this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
            this.input.onDown.addOnce(this.fadeOut, this);
            // Transitions to the Second Level after completing the first level
            // this.game.state.start('Level2', true, false);
        }
        fadeOut() {
            this.victoryMusic.stop();
            this.game.state.start('Level2', true, false);
        }

        bulletWallCollide(bullet, layer) {
            bullet.kill();
        }

        heroEnemyCollide(hero, enemy) {
            this.deathBurst(hero);
            this.deathBurst(enemy);
            this.sound_hero_death.play();
            enemy.kill();
            hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            }
            else {
                numLives -= 1;
                this.endRound();
            }
        }

        /* Case where Megaman Catches up with Hero, death ensues */
        heroEnemyChaseCollide(hero, enemyChase) {

            this.sound_hero_enemyChase_collision.play();
            this.deathBurst(hero);
            this.deathBurst(enemyChase);
            this.sound_hero_death.play();
            this.enemyChase.kill();
            this.hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            }
            else {
                numLives -= 1;
                this.endRound();
            }

        }

        collideEverything() {
            this.physics.arcade.collide(this.hero, layer);
            if (this.hero.body.blocked.down && this.hero.in_air) {
                this.hero.in_air = false;
                this.sound_landing.play();
            }
            this.physics.arcade.collide(this.enemyChase, layer);
          //  this.physics.arcade.collide(this.enemies, layer);

            for (var i = 0; i < bulletsFired; i++) {
                // this.physics.arcade.collide(bulletList[i], layer);
                this.physics.arcade.overlap(bulletList, layer, this.bulletWallCollide, null, this);
            }

            for (var i = 0; i < enemyBulletsFired; i++) {
                // this.physics.arcade.collide(enemyBulletList[i], layer);
                this.physics.arcade.overlap(enemyBulletList, layer, this.bulletWallCollide, null, this);
            }

            for (var i = 0; i < enemies.length; i++) {
                this.physics.arcade.collide(enemies[i], layer);
                this.physics.arcade.overlap(this.hero, enemies[i], this.heroEnemyCollide, null, this);
            }
            for (var i = 0; i < enemies.length; i++) {
                this.physics.arcade.overlap(this.bullets, enemies[i], this.heroShootsEnemy, null, this);
            }

            /* COMMENT THIS OUT TO REMOVE ENEMY BULLETS KILLING HERO. */
            this.physics.arcade.overlap(this.enemyBullets, this.hero, this.enemyShootsHero, null, this);

            /* Megaman chasing hero and kills hero */
            this.physics.arcade.overlap(this.enemyChase, this.hero, this.enemyCollidesHero, null, this);

            if (!game_over && heroAlive && (this.hero.body.y >= 512 || this.hero.body.y <= -100)) {
                this.hero.kill();
                this.sound_hero_death.play();
                this.deathBurst(this.hero);
                if (numLives == 0) {
                    this.itsGameOver();
                }
                else {
                    numLives -= 1;
                    this.endRound();
                }
            }
            for (var i = 0; i < enemies.length; i++) {
                if (!game_over && (enemies[i].y >= 512 || enemies[i].body.y <= -100)) {
                    enemies[i].kill();
                }
            }
        }

        /* This function is to kill hero when collide with megaman*/
        enemyCollidesHero(enemyChase, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            } else {
                numLives -= 1;
                this.endRound();
            }
            heroAlive = false;
           
        }

        heroShootsEnemy(bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            for (var i = 0; i < enemyBulletsFired; i++) {
                enemyBulletList[i].kill();
            }
            enemiesKilled++;
        }

        enemyShootsHero(enemyBullet, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            enemyBullet.kill();
            hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            }
            else {
                numLives -= 1;
                this.endRound();
            }
        }

        dustBurst(entity) {
            //explode_emit.x = entity.body.x;
            //explode_emit.y = entity.body.y;

            //explode_emit.start(true, 1000, null, 10);
            dust_cloud_emit.x = entity.body.x + entity.body.halfWidth;
            if (entity.scale.y < 0) { //upside down
                dust_cloud_emit.y = entity.body.y;
            } else {
                dust_cloud_emit.y = entity.body.y + entity.body.height;
            }

            dust_cloud_emit.start(true, 800, null, 1);
        }

        deathBurst(entity) {
            explode_emit.x = entity.body.x;
            explode_emit.y = entity.body.y;

            explode_emit.start(true, 1000, null, 10);
        }

        flipHero() {
            this.dustBurst(this.hero);
            score += 100;
            this.sound_hero_jump.play();
            this.sound_hero_gravity.play();
            if (floor) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -hero_scale; //flipped
                enemyJump = true;
            } else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = hero_scale; //flipped
                enemyJump = false;
            }
            floor = !floor;
        }

        flipEnemy() {
            this.sound_hero_gravity.play();
            this.dustBurst(this.enemyChase);
            if (floorEnemy) {
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -1; //flipped
                floorEnemy = false;
            } else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                this.enemyChase.scale.y = 1; //flipped
                floorEnemy = true;
            }
        }

        flipOtherEnemy(otherEnemy) {
            this.sound_hero_gravity.play();
            if (floorOtherEnemy) {
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                otherEnemy.scale.y = -enemy_scale; //flipped
            } else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                otherEnemy.scale.y = enemy_scale; //flipped
            }
            floorOtherEnemy = !floorOtherEnemy;
        }

        fireBullet() {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (totalBullets > 0 && !levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bulletList.push(this.bullets.getFirstExists(false));
                bulletsFired++;

                if (bulletsFired > 0) {
                    this.physics.arcade.collide(bulletList[bulletsFired - 1], layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)
                            bulletList[bulletsFired - 1].reset(this.hero.body.x + 140, this.hero.y + 20);//  And fire it
                        else
                            bulletList[bulletsFired - 1].reset(this.hero.x + 32, this.hero.y - 22);
                    } else {
                        bulletList[bulletsFired - 1].reset(this.hero.x + 35, this.hero.y);
                    }
                    bulletList[bulletsFired - 1].body.velocity.x = 5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
                    totalBullets--;
                }
            }
        }

        resetBullet(bullet) {

            //  Called if the bullet goes out of the screen
            bullet.kill();
        }

        fireEnemyBullet(activeEnemy) {

            //  To avoid them being allowed to fire too fast we set a time limit
            if (this.game.time.now > enemyBulletTime) {
                //  Grab the first bullet we can from the pool
                enemyBulletList.push(this.enemyBullets.getFirstExists(false));
                enemyBulletsFired++;

                if (enemyBulletsFired > 0) {
                    this.physics.arcade.collide(enemyBulletList[enemyBulletsFired - 1], layer);
                    this.sound_enemy_shoot.play();
                    enemyBulletList[enemyBulletsFired - 1].reset(activeEnemy.body.x + 10, activeEnemy.y + 18);
                    enemyBulletList[enemyBulletsFired - 1].body.velocity.x = -250;
                    enemyBulletTime = this.game.time.now + 200;
                }
            }
        }

        endRound() {
            respawn = false;
            heroAlive = false;
           
        }

        resetEnemyBullet(enemyBullet) {

            //  Called if the bullet goes out of the screen
            enemyBullet.kill();
        }

        render() {
            //  The score
            this.game.debug.text(scoreString + score, 10, 35, 'white', '34px Arial');
            // this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text('Bullets : ' + totalBullets, 345, 35, 'white', '34px Arial');
            this.game.debug.text('Lives : ' + numLives, 660, 35, 'white', '34px Arial');
            if (levelComplete) {
                this.game.debug.text('Level 1 Complete', 200, 200, 'white', '50px Arial');
                this.game.debug.text('Score: ' + score, 265, 260, 'white', '45px Arial');
                this.game.debug.text('Enemies Killed: ' + enemiesKilled, 240, 325, 'white', '35px Arial');
                this.game.debug.text('Bullets Left: ' + totalBullets, 260, 370, 'white', '35px Arial');
                this.game.debug.text('Lives Left: ' + numLives, 285, 415, 'white', '35px Arial');
                this.game.debug.text('Bonus: ' + (enemiesKilled * 1000 + totalBullets * 100 + numLives * 5000), 280, 475, 'white', '40px Arial');
                if (!bonusAdded) {
                    for (var i = 0; i < enemiesKilled * 1000; i++) {
                        score++;
                    }
                    for (var i = 0; i < totalBullets * 100; i++) {
                        score++;
                    }
                    for (var i = 0; i < numLives * 5000; i++) {
                        score++;
                    }

                    bonusAdded = true;
                }
            } else if (!respawn) {
                this.game.debug.text("You Have Died......", 180, 200, 'white', '50px Arial');
                this.game.debug.text("(you're bad, loser)", 180, 260, 'white', '50px Arial');
                var count = 0;
                //while (count < 10) {
                this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
                //score -= 1;
                //count++;
                //if (score <= 0) {
                //    score = 0;
                //}
                //}
                this.game.debug.text("Press 'R' to Respawn Baddie", 120, 420, 'white', '40px Arial');
            } else if (game_over) {
                this.game.debug.text("Game Over", 265, 200, 'white', '50px Arial');
                this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Arial');
                //while (count < 10) {
                this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
                this.game.debug.text("That all you got?", 210, 380, 'white', '45px Arial');
            }
        }
    }
}  