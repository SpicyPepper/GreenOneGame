module GravityGuy {

    var bullet;
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
    var enemyChase_scale = 4.0;
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
    var moveRightButton;
    var moveLeftButton;
    var facingRight;
    var counterToKill;
    var shootingRight;
    var offScreen;
    var oringialScore;
    var akey;
    var dkey;
    var keyTimer = 200;

    export class BossLevel extends Phaser.State {

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


        init(aScore, aNumberLives) {
            score = aScore;
            oringialScore = aScore;
            numLives = aNumberLives;

        }
        create() {

            /*Working on key binding*/
            keyboard_grav = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keyboard_grav.onDown.add(this.attemptGravitySwap, this);

            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            moveRightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            moveLeftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

            /* If escape is pressed, game ends */
            escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);
            
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;


            akey = this.game.add.sprite(650, 50, 'akey');
            dkey = this.game.add.sprite(725, 50, 'dkey');


            this.music = this.add.audio('bossmusic');
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
            this.map = this.add.tilemap('boss_level');
            //  this.map = this.add.tilemap('joels_level'); //### HERE IS TEST MAP. SWAP TO PLAY SHITTY LEVEL. PLEASE SOMEONE MAKE A DIFFERENT ONE.
            this.map.addTilesetImage('tileset_1');

            this.map.setCollisionByExclusion([]);

            //    layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');

            layer.resizeWorld();

            this.hero = new Hero(this.game, 750, 300, 3);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.hero.animations.play('idle_right');
            this.flipLeft();

            this.enemyChase = new enemyChase(this.game, 200, 100, 3);
            this.enemyChase.scale.setTo(enemyChase_scale, enemyChase_scale);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(25, this.timedUpdate, this);
            this.enemyChase.setBossLevel(this);

            enemiesTotal = 15;
            enemiesDead = 0;

            enemyBulletList = [];

            enemies = [];



            first = true;
            floor = true;
            floorEnemy = true;
            floorOtherEnemy = true;
            offScreen = false;

            gravityButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            cursors = this.game.input.keyboard.createCursorKeys();
            //respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

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
            //this.bullets.scale.setTo(0.99);
           

            //end added 

          
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
            //score = 0;
            //numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 500;
            facingRight = true;
            shootingRight = true;
            counterToKill = 0;
        }



        update() {

            keyTimer--;

            if (keyTimer <= 0) {
                akey.destroy();
                dkey.destroy();
            }

            this.game.camera.x = 0;
            this.hero.body.velocity.x = 0;
            //console.log(this.hero.x);
            //if (!this.hero.alive && heroAlive) {
            //    this.deathBurst(this.hero);
            //    this.sound_hero_death.play();
            //    if (numLives == 0) {
            //        this.itsGameOver();
            //    } else {
            //        numLives -= 1;
            //        this.endRound();
            //    }
            //}
            this.collideEverything();
            /* When hero is alive */
            if (heroAlive) {

                if (moveRightButton.isDown) {
                    // var offset = 0;
                    this.hero.animations.play('walk');
                    this.hero.body.velocity.x = 250;
                    this.flipRight();
                    //if (this.hero.scale.x < 0) {
                    //    this.hero.anchor.setTo(1, .5); //so it flips around its middle
                    //    this.hero.scale.x = hero_scale; //flipped
                    //    offset = this.hero.body.halfWidth + 15;
                    //}
                    facingRight = true;
                    //this.hero.x += offset;
                } else if (moveLeftButton.isDown) {
                    this.hero.animations.play('walk');
                    this.hero.body.velocity.x = -250;
                    //var offset = 0;
                
                    this.flipLeft();
                    //if (this.hero.scale.x > 0) {
                    //    this.hero.anchor.setTo(1, .5); //so it flips around its middle
                    //    this.hero.scale.x = -hero_scale;
                    //    offset = this.hero.body.halfWidth + 15;
                    //}
                    //first = true;
                    facingRight = false;
                    //this.hero.x -= offset;
                } else {
                    //this.hero.animations.frame = 0;
                    if (facingRight) {
                        this.hero.animations.play('idle_right');
                    } else {
                        this.hero.animations.play('idle_right');
                    }
                }

                if (cursors.right.isDown) {
                    shootingRight = true;
                    this.hero.animations.play('walk');
                    this.flipRight();
                    this.fireBullet();
                }

                if (cursors.left.isDown) {
                    shootingRight = false;
                    this.hero.animations.play('walk');
                    this.flipLeft();
                    this.fireBullet();
                }




                if (this.hero.x > 750) {
                    this.hero.x = 8;

                }
                if (this.enemyChase.x > 800) {
                    offScreen = !offScreen;
                    var temp = this.enemyChase.body.y;
                    this.enemyChase.x = 100;
                   
                    //if (offScreen) {

                    //    console.log(3);
                    //    // if (this.y < 500 && this.y > 10) {
                    //    //    console.log(3.3);

                    //    this.enemyChase.body.gravity.y = -this.enemyChase.body.gravity.y;
                    //    this.enemyChase.body.y = temp;
                    //    // }
                    //    if ((this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
                    //        //this.scale.y = -this.scale.y;
                    //        //this.body.gravity.y = -this.body.gravity.y;
                    //        console.log(4);
                    //        this.flipEnemy();
                    //    }


                    //}
                    //this.enemyChase.y = 400;
                    //if (this.enemyChase.body.gravity.y < 0 && floor) {
                    //    console.log("Whoa");
                    //    this.flipEnemy();
                    //} else if (this.enemyChase.body.gravity.y > 0 && !floor) {
                    //    console.log("Whoa2");
                    //    this.flipEnemy();
                    //}
                    //console.log("HELLO 1");
                    this.enemyChase.setOffScreen(offScreen);


                }
                if (this.enemyChase.x < 100) {
                    this.enemyChase.x = 800;
                    console.log("HELLO 4");
                    //this.enemyChase.setOffScreen(); 
                }

                //if (this.enemyChase.y < 0) {
                //    //console.log("HELLO 2");
                //    //this.enemyChase.y = 400;
                //}
                //if (this.enemyChase.y > 512) {
                //    console.log("HELLO 3");
                //    //this.enemyChase.y = 200;
                //}
                if (this.hero.x < 8) {

                    this.hero.x = 750;

                }
                // if (heroAlive) {



                if (!levelComplete && this.hero.x >= 17150) {
                    this.levelComplete();
                }


                if (bulletFired && bullet.x - this.hero.x >= 400) {
                    this.resetBullet(bullet);
                    bulletFired = false;
                }
                //NEW
                if (swapGravity) {
                    
                    //heroJumped = true;
                    jumpLocation = this.hero.body.x;
                    jumpLocationList.push(jumpLocation);
                    this.flipHero();
                    this.hero.body.gravity.y = -this.hero.body.gravity.y;
                    first = false;
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
                //if (!this.enemyChase.blocked_after_end && (this.enemyChase.body.blocked.right || this.enemyChase.body.blocked.down)) {
                //    this.enemyChase.blocked_after_end = true;

                //    this.enemyChase.play('idle', 4, true);
                //    this.enemyChase.body.velocity.x = 0;
                //}
                //this.enemyChase.play('idle', 4, true);
                if ((this.enemyChase.body.blocked.right || this.enemyChase.body.blocked.down)) {
                    this.enemyChase.play('idle', 4, true);
                    this.enemyChase.setStop(true);
                    this.enemyChase.body.velocity.x = 0;

                }
                swapGravity = false;
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
                //this.enemyChase.set
                if (respawnButton.isDown && !respawn) {
                    this.enemyChase.setStop(false);
                    this.hero.reset(750, 300);
                    this.enemyChase.reset(200, 100);
                    respawn = true;
                    score = oringialScore;
                    heroAlive = true;
                    this.enemyChase.blocked_after_end = false;
                    this.enemyChase.animations.play('idle');
                    this.hero.alive = true;
                    enemiesKilled = 0;
                    counterToKill = 0;

                    floor = true;


                    totalBullets = 500;

                    for (var i = 0; i < enemyBulletsFired; i++) {
                        enemyBulletList[i].kill();
                    }

                } else if (game_over && numLives == 0) {
                    if (firstTimeGameOver) {
                        firstTimeGameOver = false;
                        timeDelay = (Math.floor(this.game.time.time / 1000) % 60) + 5;
                    }

                    if ((Math.floor(this.game.time.time / 1000) % 60) >= timeDelay) {
                        this.music.mute = true;
                        this.game.state.start('GameOver', true, false);
                    }
                }
            }
        }

        flipRight() {
            var offset = 0;
            if (this.hero.scale.x < 0) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.x = hero_scale; //flipped
                offset = this.hero.body.halfWidth + 15;
            }
            this.hero.x += offset;

        }

        flipLeft() {
            var offset = 0;
            if (first) {
                first = false;
            }
            if (this.hero.scale.x > 0) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.x = -hero_scale;
                offset = this.hero.body.halfWidth + 15;
            }
            this.hero.x -= offset;
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
                //this.background.tilePosition.x -= 4;
            }
        }

        levelComplete() {
            this.hero.kill();
            heroAlive = false;
            this.hero.body.y = - 200;
            this.enemyChase.kill();
            levelComplete = true;
            this.victoryMusic.play();
            this.music.mute = true;
            this.input.onDown.addOnce(this.fadeOut, this);
        }
        fadeOut() {
            this.victoryMusic.mute = true;
            this.game.state.start('GameWon', true, false);
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
            enemyChase.kill();
            hero.kill();
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

            /*Shooting MegaMan*/
            this.physics.arcade.overlap(this.bullets, this.enemyChase, this.heroShootsEnemyChase, null, this);

            if (!game_over && heroAlive && (this.hero.body.y >= 512 || this.hero.body.y <= -100)) {
                console.log("DEATH");
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

        heroShootsEnemyChase(enemyChase, bullet) {
            //console.log(counterToKill);
            //if(bullet.body === undefined)
            this.deathBurst(bullet);
            bullet.kill();

            //console.log("SHOT");
            counterToKill++;
            if (counterToKill == 10) {
                this.deathBurst(enemyChase);
                enemyChase.kill();
                counterToKill++;
                var style = { font: "45px Lucida Sans Console", fill: "#FFFFFF", align: "center" };
                var text = this.game.add.text(300, 200, "You Win!\nFinal Score:\n" + score, style);
                this.music.fadeOut(7000);
                this.game.time.events.add(Phaser.Timer.SECOND * 7, this.gameWon, this);
               // this.game.state.start('GameWon', true, false);
            }

        }
        gameWon() {
            this.music.mute = true;
            this.game.state.start('GameWon', true, false);
        }

        dustBurst(entity) {
            if (entity.scale.x < 0) {
                dust_cloud_emit.x = entity.body.x + 3 * entity.body.halfWidth;
            } else {
                dust_cloud_emit.x = entity.body.x + entity.body.halfWidth
            }

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
            var temp = this.enemyChase.y;
            if (floorEnemy) {
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -4.0; //flipped
                floorEnemy = false;
            } else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                this.enemyChase.scale.y = 4.0; //flipped
                floorEnemy = true;
            }
            if (temp < 200) {
                this.enemyChase.y = 150;
            } else {
                this.enemyChase.y = 400;
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
                bullet = this.bullets.getFirstExists(false);

                if (bullet && shootingRight) {

                    this.physics.arcade.collide(bullet, layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first) {
                            //console.log("HERE1");
                            bullet.reset(this.hero.body.x + 140, this.hero.y);//  And fire it
                        }
                        else {
                            //console.log("HERE2");
                            bullet.reset(this.hero.x + 32, this.hero.y - 22);
                        }
                    } else {
                        // console.log("HERE3");
                        bullet.reset(this.hero.x + 35, this.hero.y);
                    }
                    bullet.body.velocity.x = 5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
                    totalBullets--;
                } else if (bullet) {
                    this.physics.arcade.collide(bullet, layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)
                            bullet.reset(this.hero.body.x - 140, this.hero.y + 20);//  And fire it
                        else
                            bullet.reset(this.hero.x - 32, this.hero.y - 22);
                    } else {
                        bullet.reset(this.hero.x - 35, this.hero.y);
                    }
                    bullet.body.velocity.x = -5000;
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
                this.game.debug.text("You have died", 43, 435, 'red', '40px Lucida Sans Unicode');
                var count = 0;
         
                this.game.debug.text("Press 'R' to Respawn", 50, 462, 'white', '20px Lucida Sans Unicode');
            } else if (game_over) {
                this.game.debug.text("Game Over", 40, 320, 'red', '70px Lucida Sans Unicode');
                this.game.debug.text('Final Score: ' + score, 46, 368, 'white', '45px Lucida Sans Unicode');
                this.game.debug.text("Click anywhere to try again.", 48, 415, 'white', '20px Lucida Sans Unicode');
            }
        }
        getFloorEnemy() {
            return floorEnemy;
        }
    }
}  
