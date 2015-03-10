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
    var hero_scale;
    var enemyChase_scale = 4;
    
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
    var background;
    var level;

    export class Level0 extends Phaser.State {

        //

        map: Phaser.Tilemap
        layer;
        music: Phaser.Sound
        sound_grav: Phaser.Sound
        sound_enemy_death: Phaser.Sound
        sound_collision: Phaser.Sound
        sound_hero_death: Phaser.Sound
        sound_hero_jump: Phaser.Sound
        sound_hero_gravity: Phaser.Sound
        sound_hero_fire: Phaser.Sound
        sound_enemy_shoot: Phaser.Sound
        victoryMusic: Phaser.Sound
        sound_hero_enemyChase_collision: Phaser.Sound

        bullets: Phaser.Group
        enemyBullets: Phaser.Group
        //   enemies: Phaser.Group

        //player: GravityGuy.Player;
        hero: GravityGuy.Hero
        enemyChase: GravityGuy.enemyChase
        enemy: GravityGuy.Enemy
        enemyAir: GravityGuy.EnemyAir
        enemy_scale;

        init(aScore, aNumberLives) {
            score = aScore;
            numLives = aNumberLives;
        }
        create() {
            //FPS 
            this.game.time.advancedTiming = true;
          
            /*Working on key binding*/
            keyboard_grav = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keyboard_grav.onDown.add(this.attemptGravitySwap, this);

            this.enemy_scale = 0.8;
            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

            /* If escape is pressed, game ends */
            escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);

            this.init_sounds();
            this.init_emitters();

         
            this.hero = new Hero(this.game, 150, 300, 1);
            hero_scale = this.hero.hero_scale;
        
            this.physics.arcade.enableBody(this.hero);

            this.enemyChase = new enemyChase(this.game, 0, 300, 1);

            this.enemyAir = new EnemyAir(this.game, this, this.hero, true, 3700, 200, 200);

            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(25, this.timedUpdate, this);

            enemiesDead = 0;

            enemyBulletList = [];

            enemies = [];

            //this.createEnemies();
            //works above

            





            //text = this.add.text(this.world.centerX, game.world.centerY, "- phaser -\nrocking with\ngoogle web fonts");

            //Bullets

            this.init_vars();
            //end added 
            this. init_bullets();
            //Enemy Bullets



            
        }
        init_emitters() {

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
        }

        init_sounds() {
           this.music = this.add.audio('House');
            this.music.volume = .60;
            this.sound_enemy_death = this.add.audio('enemy_death');
            this.sound_enemy_death.volume = .80;
            this.sound_hero_gravity = this.add.audio('hero_gravity');
            this.sound_hero_gravity.volume = .60;
            this.sound_hero_death = this.add.audio('hero_death');
            this.sound_hero_death.volume = .80;
            this.sound_collision = this.add.audio('collision');
            this.sound_collision.volume = .99;
            this.sound_hero_jump = this.add.audio('hero_jump');
            this.sound_hero_jump.volume = .60;
            this.sound_hero_fire = this.add.audio('hero_fire');
            this.sound_hero_fire.volume = .80;
            this.sound_grav = this.add.audio('grav');
            this.sound_grav.volume = .70;
            this.sound_enemy_shoot = this.add.audio('enemy_shoot');
            this.sound_enemy_shoot.volume = .50;
      //      this.sound_hero_enemyChase_collision = this.add.audio('hero_enemyChase_collision');
            this.victoryMusic = this.add.audio('victory');
            this.music.play();
        }

        init_vars() {
            gravityButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            cursors = this.game.input.keyboard.createCursorKeys();
            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

            bonusAdded = false;
            bullet;
            bulletFired = false;
            bulletsFired = 0;
            bulletTime = 0;
            first = true;
            firstTimeGameOver = true;
            floor = true;
            floorEnemy = true;
          
            enemies;
            enemiesTotal;
            enemiesDead;
            enemiesKilled = 0;
            enemyBulletTime = 0;
            enemyBulletWait = 0;
            enemyBulletsFired = 0;
            enemyAlive = false;
            game_over = false;
            levelComplete = false;
            respawn = true;
            swapGravity = false;    
            heroAlive = true;
            scoreString = 'Score : ';
            //score = 0;
            //numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 35;
        }

        init_bullets() {

            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(30, 'bullet');
            this.bullets.setAll('anchor.x', 1);
            this.bullets.setAll('anchor.y', 0);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);


            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(30, 'enemybullet');
            this.enemyBullets.setAll('anchor.x', 1);
            this.enemyBullets.setAll('anchor.y', 0);
            this.enemyBullets.setAll('outOfBoundsKill', false);
            this.enemyBullets.setAll('checkWorldBounds', true);
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
                var anotherEnemy = new Enemy(this.game, this, this.hero, enemyLocationsX[i], enemyLocationsY[i]);
                enemies.push(anotherEnemy);
            }
        }

        update() {
            this.collideEverything();
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

            
                //if (!levelComplete && this.hero.x >= 17150) {
                //    this.levelComplete();
                //}

                if (bulletFired && bullet.x - this.hero.x >= 400) {
                    this.resetBullet(bullet);
                    bulletFired = false;
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
                            enemyBulletWait = 0;
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
                    for (var i = 0; i < enemies.length; i++) {
                        enemies[i].animations.stop();
                        enemies[i].my_velocity = 0;
                        
                    }
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
                    this.deleteReferences();
                    this.hero.reset(150, 300);
                    this.enemyChase.reset(0, 300);
                    respawn = true;
                    score = 0;
                    heroAlive = true;
                    this.enemyChase.blocked_after_end = false;
                    this.enemyChase.animations.play('run');
                    this.hero.alive = true;
                    enemiesKilled = 0;


                    floor = true;

                    //for (var i = 0; i < enemiesTotal; i++) {
                    //    enemies[i].kill();
                    //    console.log("hi " + i);
                    //}
                    // enemies.
                    totalBullets = 35;

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
                    if (firstTimeGameOver) {
                        firstTimeGameOver = false;
                        this.input.onDown.addOnce(this.restartAtFirstLevel, this);
                    }
                    //var time = (Math.floor(this.game.time.time / 1000) % 60) + 500;
                    //var currentTime = Math.floor(this.game.time.time / 1000) % 60;
                    if ((Math.floor(this.game.time.time / 1000) % 60) >= timeDelay) {

                    }
                }
            }
        }

        restartAtFirstLevel() {
            this.deleteReferences();
            this.music.stop();
            this.game.state.start('LevelNoob', true, false);
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
                background.tilePosition.x -= 4;
            }
        }

        levelComplete() {
            this.hero.kill();

            heroAlive = false;
            this.hero.body.y = - 200;
            this.enemyChase.kill();
            //this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
            
            // Transitions to the Second Level after completing the first level
            // this.game.state.start('Level2', true, false);
        }
       

        bulletWallCollide(bullet, layer) {
            bullet.kill();
        }

        heroEnemyCollide(hero, enemy) {
            this.deathBurst(hero);
            this.deathBurst(enemy);
            this.sound_collision.play();
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

        collideEverything() {
            this.physics.arcade.collide(this.hero, layer);

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
            this.sound_collision.play();
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
            this.sound_enemy_death.play();
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

        flipEntity(entity) {
           // console.log("HERYO");
            this.sound_grav.play();
            entity.body.gravity.y *= -1;
            entity.anchor.setTo(1, .5);
            entity.scale.y *= -1;
        }

        //flipOtherEnemy(otherEnemy) {
        //    this.sound_hero_gravity.play();
        //    if (floorOtherEnemy) {
        //        otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
        //        //  this.enemyChase.scale.y = 1; //facing default direction
        //        otherEnemy.scale.y = -enemy_scale; //flipped
        //    } else {
        //        //hero.anchor.setTo(1, .5); //so it flips around its middle
        //        //hero.scale.y = -1; //facing default direction
        //        //hero.scale.y = 1; //flipped
        //        otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
        //        //this.enemyChase.scale.y = -1; //facing default direction
        //        otherEnemy.scale.y = enemy_scale; //flipped
        //    }
        //    floorOtherEnemy = !floorOtherEnemy;
        //}

        fireBullet() {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (totalBullets > 0 && !levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);

                if (bullet) {
                    this.physics.arcade.collide(bullet, layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)
                            bullet.reset(this.hero.body.x + 140, this.hero.y + 20);//  And fire it
                        else
                            bullet.reset(this.hero.x + 32, this.hero.y - 22);
                    } else {
                        bullet.reset(this.hero.x + 35, this.hero.y);
                    }
                    bullet.body.velocity.x = 5000;
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
            this.game.debug.spriteInfo(this.enemyAir, 400, 400);
            //  The score
           
          //  this.game.debug.text(this.game.time.fps + '' || '--', 2, 60, "#00ff00");  
            // this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text(scoreString + score, 10, 35, 'white', '34px Lucida Sans Unicode');
            this.game.debug.text('Bullets : ' + totalBullets, 345, 35, 'white', '34px Lucida Sans Unicode');
            this.game.debug.text('Lives : ' + numLives, 660, 35, 'white', '34px Lucida Sans Unicode');
            if (levelComplete) {
                this.game.debug.text('Level ' + level + ' Complete!', 190, 125, 'white', '50px Lucida Sans Unicode');
                this.game.debug.text('Click to Continue', 200, 200, 'white', '50px Lucida Sans Unicode');
                this.game.debug.text('Score: ' + score, 265, 260, 'white', '45px Lucida Sans Unicode');
                this.game.debug.text('Enemies Killed: ' + enemiesKilled, 240, 325, 'white', '35px Lucida Sans Unicode');
                this.game.debug.text('Bullets Left: ' + totalBullets, 260, 370, 'white', '35px Lucida Sans Unicode');
                this.game.debug.text('Lives Left: ' + numLives, 285, 415, 'white', '35px Lucida Sans Unicode');
                this.game.debug.text('Bonus: ' + (enemiesKilled * 1000 + totalBullets * 100 + numLives * 5000), 280, 475, 'white', '40px Lucida Sans Unicode');
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
                //   this.game.debug.text("(you're bad, loser)", 180, 260, 'white', '50px Lucida Sans Unicode');
                var count = 0;
                //while (count < 10) {
                //     this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Lucida Sans Unicode');
                //score -= 1;
                //count++;
                //if (score <= 0) {
                //    score = 0;
                //}
                //}
                this.game.debug.text("Press 'R' to Respawn", 50, 462, 'white', '20px Lucida Sans Unicode');
            } else if (game_over) {
                this.game.debug.text("Game Over", 40, 320, 'red', '70px Lucida Sans Unicode');
             //   this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Lucida Sans Unicode');
                //while (count < 10) {
                this.game.debug.text('Final Score: ' + score, 46, 368, 'white', '45px Lucida Sans Unicode');
                this.game.debug.text("Click anywhere to try again.", 48, 415, 'white', '20px Lucida Sans Unicode');
            }
        }

        deleteReferences() {
            delete totalBullets.regex;
            delete enemies.regex;
            delete enemiesTotal.regex;
            delete enemiesDead.regex;
            delete enemiesKilled.regex;
            delete enemyBulletList.regex;
            delete jumpLocationList['regex'];
            delete enemyLocationsX.regex;
            delete enemyLocationsY.regex;
        }

        setLayer(aLayer) {
           
            layer = aLayer;
        }

        getLayer() {
            return layer;
        }

        setEnemiesTotal(anEnemyAmount) {
            enemiesTotal = anEnemyAmount;
        }

        setEnemyLocations(anEnemyLocationsX, anEnemyLocationsY) {
            enemyLocationsX = anEnemyLocationsX;
            enemyLocationsY = anEnemyLocationsY;
        }

        setBackground(aBackground) {
            background = aBackground;
        }

        setLevel(aLevel) {
            level = aLevel;
        }

        getScore() {
            return score;
        }

        getNumLives() {
            return numLives;
        }
    }
}  