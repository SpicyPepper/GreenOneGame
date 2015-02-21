module GravityGuy {

    var bullet;
    var bulletTime = 0;
    var bulletFired = false;
    var enemies;
    var enemiesTotal;
    var enemiesDead;
    var enemiesKilled = 0;
    var enemyBullet;
    var enemyBulletTime = 0;
    var enemyBulletWait = 0;
    var enemyAlive = false;
    var heroAlive = true;
    var enemyAliveCount;
    var scoreString = 'Score : ';
    var score_text;
    var score = 0;
    var lives;
    var numLives = 3;
    var layer; 
    var gravityButton;
    var cursors;
    var jumpLocation;
    var heroJumped = false;
    var first;
    var floor;
    var floorEnemy;
    var hero_scale = 0.7;
    var enemy_scale = 0.8;
    var emitter;
    var levelComplete = false;  
    var game_over = false;
    var bonusAdded = false;
    var swapGravity = false;
    var keyboard_grav;

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

        bullets: Phaser.Group
        enemyBullets: Phaser.Group
        enemies: Phaser.Group

        //player: GravityGuy.Player;
        hero: GravityGuy.Hero
        enemyChase: GravityGuy.enemyChase
        enemy: GravityGuy.Enemy

       
        create() {

            /*Working on key binding*/
            keyboard_grav = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keyboard_grav.onDown.add(this.attemptGravitySwap, this);

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 800, 512);

            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;

            this.music = this.add.audio('House');
            this.sound_hero_gravity = this.add.audio('hero_gravity');
            this.sound_hero_death = this.add.audio('hero_death');
            this.sound_hero_jump = this.add.audio('hero_jump');
            this.sound_hero_fire = this.add.audio('hero_fire');
            this.sound_enemy_shoot = this.add.audio('enemy_shoot');
            this.victoryMusic = this.add.audio('victory');
            this.music.play();
            
            emitter = this.game.add.emitter(0, 0, 20);
            emitter.makeParticles('explosion_small');
            emitter.gravity = 200;

            //LEVEL :D
           // this.map = this.add.tilemap('level2');
            this.map = this.add.tilemap('level_test');
            this.map.addTilesetImage('tileset_1');

            this.map.setCollisionByExclusion([]);

      //      layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');
        
            layer.resizeWorld();

            this.hero = new Hero(this.game, 150, 300);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);

            this.enemyChase = new enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(50, this.timedUpdate, this);
            
            enemies = [];

            enemiesTotal = 24;
            enemiesDead = 0;
            var newEnemyX = 0;
            for (var i = 0; i < enemiesTotal; i++) {
                newEnemyX = this.game.rnd.integerInRange(newEnemyX + 1000, newEnemyX + 1800);
                var anotherEnemy = new Enemy(this.game, newEnemyX, 100);
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
                console.log('enemy created at ' + newEnemyX);
            }

            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');

            first = true;
            floor = true;
            floorEnemy = true;
            gravityButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            cursors = this.game.input.keyboard.createCursorKeys();

            /* ## HERE IS A CURRENT ATTEMPT AT IMPLEMENTING AN ENEMY GROUP. ##
             * ## MUST GET RID OF ENEMY[] ETC ## */
            //this.game.add.sprite(0, 0, 'enemy1');

            //this.enemies = this.game.add.group();
            //for (var i = 0; i < 12; i++) {
            //    this.enemies.create(this.game.rnd.integerInRange(i * 1200,(i + 1) * 1200), 300, 'enemy1');
            //}
            //this.enemies.enableBody = true;
            //this.enemies.createMultiple(24, 'enemy1');
            //this.enemies.setAll('anchor.x', 0.5);
            //this.enemies.setAll('anchor.y', 0);
            //this.enemies.setAll('outOfBoundsKill', true);
            //this.enemies.setAll('checkWorldBounds', true);
            //this.enemies.setAll('gravity.y', 18000);
            //this.enemies.callAll('animations.add', 'animations', 'walk');
            //this.enemies.callAll('play', 8, true);

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

        }

        update() {

            /* When hero is alive */
            if (heroAlive) {

                if (!levelComplete && this.hero.x >= 17150) {
                    this.levelComplete();
                }

                /* this method will handle all collision events */
                this.collideEverything();

                if (bulletFired && bullet.x - this.hero.x >= 400) {
                    this.resetBullet(bullet);
                    bulletFired = false;
                }

                if (swapGravity) {
                    this.flipHero();
                    heroJumped = true;
                    jumpLocation = this.hero.body.x;
                    this.hero.body.gravity.y = -this.hero.body.gravity.y;
                    first = false;
                }
                if (this.enemyChase.body.x >= jumpLocation && heroJumped && (this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
                    if (floorEnemy != floor) {
                        this.flipEnemy();
                        this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;
                    }
                    heroJumped = false;
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
            }
        }

        attemptGravitySwap() {

            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up)
 
        }

        itsGameOver() {
            game_over = true;
           // this.enemies.   

        }
        timedUpdate() {
            if (!game_over && !levelComplete) {
                score += 10;
                this.background.tilePosition.x--;
            }
        }

        levelComplete() {
            this.hero.kill();
            this.enemyChase.kill();
            this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
        }

        heroEnemyCollide(hero, enemy) {
            this.deathBurst(hero);
            this.deathBurst(enemy);
            this.sound_hero_death.play();
            enemy.kill();
            hero.kill();
            this.itsGameOver();
        }
        

        collideEverything() {
            this.physics.arcade.collide(this.hero, layer);
            this.physics.arcade.collide(this.enemyChase, layer);
            this.physics.arcade.collide(this.enemies, layer);

            for (var i = 0; i < enemies.length; i++) {
                this.physics.arcade.collide(enemies[i], layer);
                this.physics.arcade.overlap(this.hero, enemies[i], this.heroEnemyCollide, null, this);
            }
            for (var i = 0; i < enemies.length; i++) {
                this.physics.arcade.overlap(this.bullets, enemies[i], this.heroShootsEnemy, null, this);
            }

            /* COMMENT THIS OUT TO REMOVE ENEMY BULLETS KILLING HERO. */
            this.physics.arcade.overlap(this.enemyBullets, this.hero, this.enemyShootsHero, null, this);


            if (!game_over && (this.hero.body.y >= 512 || this.hero.body.y <= -100)) {
                this.hero.kill();
                this.sound_hero_death.play();
                this.itsGameOver();
            }

            for (var i = 0; i < enemies.length; i++) {
                if (!game_over && (enemies[i].y >= 512 || enemies[i].body.y <= -100)) {
                    enemies[i].kill();
                }
            }
        }
        
        heroShootsEnemy(bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            if (enemyBullet) {
                enemyBullet.kill();
            }
            enemiesKilled++;
        }

        enemyShootsHero(enemyBullet, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            enemyBullet.kill();
            hero.kill();
            this.itsGameOver();
        }

        deathBurst(entity) {
            emitter.x = entity.body.x;
            emitter.y = entity.body.y;

            emitter.start(true, 1000, null, 10);
        }

        flipHero() {

            this.sound_hero_jump.play();
            this.sound_hero_gravity.play();
            if (floor) {                                           
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -hero_scale; //flipped           
            } else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = hero_scale; //flipped           
            }
            floor = !floor;
        }

        flipEnemy() {
            this.sound_hero_gravity.play();
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

        fireBullet() {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (!levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);

                if (bullet) {
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
                enemyBullet = this.enemyBullets.getFirstExists(false);

                if (enemyBullet) {
                    this.sound_enemy_shoot.play();
                    enemyBullet.reset(activeEnemy.body.x + 10, activeEnemy.y + 18);
                    enemyBullet.body.velocity.x = -250;
                    enemyBulletTime = this.game.time.now + 200;
                }

            }

        }


        resetEnemyBullet(enemyBullet) {

            //  Called if the bullet goes out of the screen
            enemyBullet.kill();

        }

        render() {
            //  The score
            this.game.debug.text(scoreString + score, 10, 35, 'white', '34px Arial');
            // this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text('Lives : ' + numLives, 648, 35, 'white', '34px Arial');
            if (levelComplete) {
                this.game.debug.text('Level 1 Complete', 200, 200, 'white', '50px Arial');
                this.game.debug.text('Score: ' + score, 265, 260, 'white', '45px Arial');
                this.game.debug.text('Enemies Killed: ' + enemiesKilled, 240, 350, 'white', '40px Arial');
                this.game.debug.text('Bonus: ' + enemiesKilled * 5000, 285, 400, 'white', '40px Arial');
                if (!bonusAdded) {
                    for (var i = 0; i < 50000000; i++) { }
                    for (var i = 0; i < enemiesKilled * 5000; i++) {
                        score++;
                    }
                    bonusAdded = true;
                }
            }
        }

    }

}  