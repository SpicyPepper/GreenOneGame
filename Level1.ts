module GravityGuy {

    var bullet;
    var bulletTime = 0;
    var enemies;
    var enemiesTotal;
    var enemiesDead;
    var enemyBullet;
    var enemyBulletTime = 0;
    var enemyBulletWait = 0;
    var enemyAlive = false;
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
    var emitter;  
    var game_over = false;

    export class Level1 extends Phaser.State {

        background: Phaser.TileSprite;

        map: Phaser.Tilemap
 
        music: Phaser.Sound
        sound_hero_death: Phaser.Sound
        sound_hero_gravity: Phaser.Sound
        sound_hero_fire: Phaser.Sound

        bullets: Phaser.Group
        enemyBullets: Phaser.Group
        enemies: Phaser.Group

        //player: GravityGuy.Player;
        hero: GravityGuy.Hero
        enemyChase: GravityGuy.enemyChase
        enemy: GravityGuy.Enemy

        


        create() {

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 800, 512);

            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;

            this.music = this.add.audio('House');
            this.sound_hero_gravity = this.add.audio('hero_gravity');
            this.sound_hero_death = this.add.audio('hero_death');
            this.sound_hero_fire = this.add.audio('hero_fire');
            this.music.play();

            emitter = this.game.add.emitter(0, 0, 20);
            emitter.makeParticles('explosion_small');
            emitter.gravity = 200;

            //LEVEL :D
           // this.map = this.add.tilemap('level2');
            this.map = this.add.tilemap('level2');
            this.map.addTilesetImage('tiles-1');

            this.map.setCollisionByExclusion([]);

      //      layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('Tile Layer 1');
        
            layer.resizeWorld();

            this.hero = new Hero(this.game, 150, 300);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);

            this.enemyChase = new enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);

            score_text = this.add.text(10, 10, scoreString, { font: "64px Arial", fill: "#ffffff", align: "left" });
            this.time.events.loop(50, this.timedUpdate, this);
            
            enemies = [];

            enemiesTotal = 24;
            enemiesDead = 0;
            var newEnemyX = 0;
            for (var i = 0; i < enemiesTotal; i++) {
              
                newEnemyX = this.game.rnd.integerInRange(newEnemyX + 1200, newEnemyX + 2200);
                var anotherEnemy = new Enemy(this.game, newEnemyX, 300);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
            }

         
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
            this.enemyBullets.setAll('outOfBoundsKill', true);
            this.enemyBullets.setAll('checkWorldBounds', true);

        }

        update() {

            /* this method will handle all collision events */
            this.collideEverything();

            if (gravityButton.isDown && this.hero.body.blocked.down || gravityButton.isDown && this.hero.body.blocked.up) {

                this.flipHero();
                heroJumped = true;
                jumpLocation = this.hero.body.x;
                this.hero.body.gravity.y = this.hero.body.gravity.y * -1;
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

            for (var i = 0; i < enemies.length; i++) {
                this.physics.arcade.collide(enemies[i], layer);
            }

            for (var j = enemiesDead; j < enemies.length; j++) {
                if (enemies[j].x - this.hero.x <= 575) {
                    enemyBulletWait++;
                    if (enemyBulletWait % 60 == 0) {
                        this.fireEnemyBullet(enemies[j]);
                    }
                }
                if (enemies[j].x < this.hero.x) {
                    enemiesDead++;
                }
            }


        }

        itsGameOver() {
            game_over = true;
            //other stuff can happen here.
        }
        timedUpdate() {
            score += 10;
 
            score_text.setText(scoreString + score);
            this.background.tilePosition.x -= 0.4;
        }
        

        collideEverything() {
            this.physics.arcade.collide(this.hero, layer);
            this.physics.arcade.collide(this.enemyChase, layer);
            this.physics.arcade.collide(this.enemy, layer);
            this.physics.arcade.overlap(this.bullets, this.enemy, this.heroShootsEnemy, null, this);
            this.physics.arcade.overlap(this.enemyBullets, this.hero, this.enemyShootsHero, null, this);

            if (!game_over && (this.hero.body.y >= 512 || this.hero.body.y <= -100)) {
                this.hero.kill();
                this.sound_hero_death.play();
                this.itsGameOver();
            }
        }
        
        heroShootsEnemy(bullet, enemy) {
            bullet.kill();
            enemy.kill();

            score += 10000;
            this.itsGameOver();
        }

        enemyShootsHero(enemyBullet, hero) {
            this.shotExplosion(hero);
            this.sound_hero_death.play();
            enemyBullet.kill();
            hero.kill();
            this.itsGameOver();
        }

        shotExplosion(entity) {
            emitter.x = entity.x;
            emitter.y = entity.y;

            emitter.start(true, 1000, null, 10);
        }
        flipHero() {
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
            if (this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);

                if (bullet) {
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)                       
                            bullet.reset(this.hero.body.x + 170, this.hero.y + 30);//  And fire it
                        else
                            bullet.reset(this.hero.x + 30, this.hero.y - 30);
                    } else {
                        bullet.reset(this.hero.x + 30, this.hero.y + 5);
                    }
                    bullet.body.velocity.x = 10000;
                    bulletTime = this.game.time.now + 200;
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
                    enemyBullet.reset(activeEnemy.body.x + 10, activeEnemy.y + 15);
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
            this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text('Lives : ' + numLives, 648, 35, 'white', '34px Arial');
        }

    }

}  