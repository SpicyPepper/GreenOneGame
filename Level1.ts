module GravityGuy {

    var bullet;
    var bulletTime = 0;
    var enemies;
    var enemiesTotal;
    var enemiesDead;
    var enemyBullet;
    var enemyBulletTime = 0;
    var newEnemyX = 0;
    var enemyBulletWait = 0;
    var enemyAlive = false;
    var enemyAliveCount;
    var scoreString = 'Score : ';
    var scoreText;
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
  

    export class Level1 extends Phaser.State {

        background: Phaser.TileSprite;

        map: Phaser.Tilemap
 
        music: Phaser.Sound
        sound_hero_gravity: Phaser.Sound
        sound_hero_fire: Phaser.Sound

        bullets: Phaser.Group
        enemyBullets: Phaser.Group

        //player: GravityGuy.Player;
        hero: GravityGuy.Hero
        enemyChase: GravityGuy.enemyChase
        enemy: GravityGuy.Enemy
        


        create() {
            
            //this.background = this.add.sprite(0, 0, 'level1');

            //this.music = this.add.audio('music', 1, false);
            //this.music.play();

            //this.player = new Player(this.game, 130, 284);

            //added

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);


            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;

            this.music = this.add.audio('House');
            this.sound_hero_gravity = this.add.audio('hero_gravity');
            this.sound_hero_fire = this.add.audio('hero_fire');
            this.music.play();

            //LEVEL :D
            this.map = this.add.tilemap('level2');
            //set collision
            this.map.addTilesetImage('tiles-1');

            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('Tile Layer 1');
        

            layer.resizeWorld();

            this.hero = new Hero(this.game, 150, 300);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            //this.add.sprite(150, 300, 'hero'); // Start location
            
            enemies = [];

            enemiesTotal = 24;
            enemiesDead = 0;

            for (var i = 0; i < enemiesTotal; i++) {
                newEnemyX = this.game.rnd.integerInRange(newEnemyX + 1200, newEnemyX + 2200);
                enemies.push(new Enemy(this.game, newEnemyX, 300));
            }

         
            first = true;
            floor = true;
            floorEnemy = true;
            gravityButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            cursors = this.game.input.keyboard.createCursorKeys();



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
            score++;
            this.physics.arcade.collide(this.hero, layer);
            this.physics.arcade.collide(this.enemyChase, layer);
            this.background.tilePosition.x -= 2;

            if (gravityButton.isDown && this.hero.body.blocked.down || gravityButton.isDown && this.hero.body.blocked.up) {

                this.flipHero();
               
                heroJumped = true;
                jumpLocation = this.hero.body.x;
                this.hero.body.gravity.y = this.hero.body.gravity.y * -1;
                //game.physics.arcade.gravity.y = game.physics.arcade.gravity.y * -1;
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
            
            /*this.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                this.body.velocity.x = -150;
                this.animations.play('run');

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                this.body.velocity.x = 150;
                this.animations.play('run');

                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            }
            else {
                this.animations.frame = 0;
            }*/

        }

        flipHero() {
            this.sound_hero_gravity.play();
            if (floor) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -hero_scale; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = 1; //facing default direction
                //enemyChase.scale.y = -1; //flipped
                floor = false;
            } else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = hero_scale; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = -1; //facing default direction
                //enemyChase.scale.y = 1; //flipped
                floor = true;
            }
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
            this.game.debug.text(scoreString + score, 32, 24, 'white', '34px Arial');

            //  Lives
            this.game.debug.text('Lives : ' + numLives, 648, 24, 'white', '34px Arial');
        }

    }

}  