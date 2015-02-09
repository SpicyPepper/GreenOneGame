module GravityGuy {

    var bullet;
    var bulletTime = 0;
    var layer; 
    var gravityButton;
    var cursors;
    var jumpLocation;
    var heroJumped = false;
    var first;
    var floor;
    var floorEnemy;

    export class Level1 extends Phaser.State {

        //background: Phaser.Sprite;
        //changed
        background: Phaser.TileSprite;
        //end
        //added
        map: Phaser.Tilemap
        //end
        music: Phaser.Sound;
        bullets: Phaser.Group
        //player: GravityGuy.Player;
        hero: GravityGuy.Hero;
        enemyChase: GravityGuy.enemyChase
       


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
            this.music.play();

            //LEVEL :D
            this.map = this.add.tilemap('level2');
            //set collision
            this.map.addTilesetImage('tiles-1');

            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('Tile Layer 1');
        

            layer.resizeWorld();

            this.hero = new Hero(this.game, 150, 300);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            //this.add.sprite(150, 300, 'hero'); // Start location

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

        }

        update() {
            
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
            if (floor) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = 1; //facing default direction
                this.hero.scale.y = -1; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = 1; //facing default direction
                //enemyChase.scale.y = -1; //flipped
                floor = false;
            } else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -1; //facing default direction
                this.hero.scale.y = 1; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = -1; //facing default direction
                //enemyChase.scale.y = 1; //flipped
                floor = true;
            }
        }

        flipEnemy() {
            if (floorEnemy) {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = 1; //facing default direction
                //hero.scale.y = -1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -1; //flipped
                floorEnemy = false;
            } else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                this.enemyChase.scale.y = -1; //facing default direction
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
                    if (floor) {
                        if (first) {
                            //  And fire it
                            bullet.reset(this.hero.body.x + 170, this.hero.y + 30);
                            bullet.body.velocity.x = 10000;
                            bulletTime = this.game.time.now + 200;
                        } else {
                            bullet.reset(this.hero.x + 30, this.hero.y - 30);
                            bullet.body.velocity.x = 10000;
                            bulletTime = this.game.time.now + 200;
                        }
                    } else {
                        bullet.reset(this.hero.x + 30, this.hero.y + 5);
                        bullet.body.velocity.x = 10000;
                        bulletTime = this.game.time.now + 200;
                    }
                }
            }

        }
       

        resetBullet(bullet) {

            //  Called if the bullet goes out of the screen
            bullet.kill();

        }

    }

}  