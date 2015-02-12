/*var game = new Phaser.Game(800, 512, Phaser.CANVAS, 'greenone', { preload: preload, create: create, update: update, render: render });
var map;
var hero;
var bullets;
var bullet;
var bulletTime = 0;
var enemyChase;
var cursors;
var background;
var layer;
var gravityButton;
var floor; // boolean for is character on the floor
var floorEnemy;
var first;
var jumpLocation;
var heroJumped = false;


    function preload() {

//        game.load.tilemap('level1', 'resources/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles-1', 'resources/tiles-1.png');
        game.load.image('bullet', 'visuals/laser.png');
        game.load.image('background', 'visuals/bkgrnd_sand.png');
        game.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
        game.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
//        game.load.audio('DnB', ['audio/Title_DnB.mp3', 'audio/Title_DnB.ogg']);
        game.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
        
    }
    
    var music;
    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 2000, 512);
       
         //MUSIC :D
        music = game.add.audio('House');
        music.play();
        
        //SCROLLING BACKGROUND :D
        background = game.add.tileSprite(0, 0, 1024, 512, 'background');
        background.fixedToCamera = true;
        

        //LEVEL :D
        map = game.add.tilemap('level2');
        //set collision
        map.addTilesetImage('tiles-1');

        map.setCollisionByExclusion([]);

        layer = map.createLayer('Tile Layer 1');
        //layer.debug = true;

        layer.resizeWorld();

        game.physics.arcade.gravity.y = 0;
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 1);
        bullets.setAll('anchor.y', 0);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        first = true;

        //Phaser.Physics.Arcade.collideSpriteVsTilemapLayer(hero,
        //hero sprite
        hero = game.add.sprite(150, 300, 'hero'); // Start location
        
        enemyChase = game.add.sprite(0, 300, 'enemyChase'); // Start location

        floor = true;
        floorEnemy = true;
        hero.animations.add('run');
        hero.animations.play('run', 10, true);
        game.physics.enable(hero, Phaser.Physics.ARCADE);
        hero.body.bounce.y = 0.2;
        hero.body.collideWorldBounds = true;
        game.camera.follow(hero);
        hero.body.allowRotation = true;

        enemyChase.animations.add('run');
        enemyChase.animations.play('run', 10, true);
        game.physics.enable(enemyChase, Phaser.Physics.ARCADE);
        enemyChase.body.bounce.y = 0.2;
        enemyChase.body.collideWorldBounds = true;
        enemyChase.body.allowRotation = true;
        hero.body.gravity.y = 18000;
        enemyChase.body.gravity.y = 18000;

        cursors = game.input.keyboard.createCursorKeys();
        gravityButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {
        //console.log("HERO " + hero.body.x);
        //console.log("Enemy " + enemyChase.body.x);
        game.physics.arcade.collide(hero, layer);
        game.physics.arcade.collide(enemyChase, layer);
        background.tilePosition.x -= 2;
        hero.body.velocity.y = 0;
        hero.body.velocity.x = 400;
        //enemyChase.body.x = hero.body.x - 150;
        enemyChase.body.velocity.x = 400;
        enemyChase.body.velocity.y = 0;

        //if (gravityButton.isDown) {
        if (gravityButton.isDown && hero.body.blocked.down || gravityButton.isDown && hero.body.blocked.up) {
            flipHero();
            heroJumped = true;
            jumpLocation = hero.body.x;
            hero.body.gravity.y = hero.body.gravity.y * -1;
            //game.physics.arcade.gravity.y = game.physics.arcade.gravity.y * -1;
            first = false;
        }

        if (enemyChase.body.x >= jumpLocation && heroJumped && (enemyChase.body.blocked.down || enemyChase.body.blocked.up )){
            if (floorEnemy != floor) {
                flipEnemy();
                enemyChase.body.gravity.y = enemyChase.body.gravity.y * -1;
            }
            heroJumped = false;
        }

        if (enemyChase.body.x <= hero.body.x - 300) {
            enemyChase.body.x = hero.body.x - 100;
        }

        if (cursors.right.isDown) {
            fireBullet();
        }
    }

    function flipHero() {
        if (floor) {
            hero.anchor.setTo(1, .5); //so it flips around its middle
            hero.scale.y = 1; //facing default direction
            hero.scale.y = -1; //flipped
            //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
            //enemyChase.scale.y = 1; //facing default direction
            //enemyChase.scale.y = -1; //flipped
            floor = false;
        } else {
            hero.anchor.setTo(1, .5); //so it flips around its middle
            hero.scale.y = -1; //facing default direction
            hero.scale.y = 1; //flipped
            //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
            //enemyChase.scale.y = -1; //facing default direction
            //enemyChase.scale.y = 1; //flipped
            floor = true;
        }
    }

function flipEnemy() {
    if (floorEnemy) {
        //hero.anchor.setTo(1, .5); //so it flips around its middle
        //hero.scale.y = 1; //facing default direction
        //hero.scale.y = -1; //flipped
        enemyChase.anchor.setTo(1, .5); //so it flips around its middle
        enemyChase.scale.y = 1; //facing default direction
        enemyChase.scale.y = -1; //flipped
        floorEnemy = false;
    } else {
        //hero.anchor.setTo(1, .5); //so it flips around its middle
        //hero.scale.y = -1; //facing default direction
        //hero.scale.y = 1; //flipped
        enemyChase.anchor.setTo(1, .5); //so it flips around its middle
        enemyChase.scale.y = -1; //facing default direction
        enemyChase.scale.y = 1; //flipped
        floorEnemy = true;
    }
    }

    function fireBullet() {

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime) {
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);

            if (bullet) {
                if (floor) {
                    if (first) {
                        //  And fire it
                        bullet.reset(hero.x + 170, hero.y + 30);
                        bullet.body.velocity.x = 10000;
                        bulletTime = game.time.now + 200;
                    } else {
                        bullet.reset(hero.x + 30, hero.y - 30);
                        bullet.body.velocity.x = 10000;
                        bulletTime = game.time.now + 200;
                    }
                } else {
                    bullet.reset(hero.x + 30, hero.y + 5);
                    bullet.body.velocity.x = 10000;
                    bulletTime = game.time.now + 200;
                }
            }
        }

    }

    function resetBullet(bullet) {

        //  Called if the bullet goes out of the screen
        bullet.kill();

    }

    function render() {
       // game.debug.cameraInfo(game.camera, 500, 32);//164
       // game.debug.spriteCoords(hero, 32, 32);
    }*/
window.onload = function () {
    var game = new GravityGuy.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GravityGuy;
(function (GravityGuy) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.game.scale.pageAlignHorizontally = true;
            }
            else {
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    GravityGuy.Boot = Boot;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var cursors;
    var layer;
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y) {
            _super.call(this, game, x, y, 'enemy1', 0);
            //layer = layerT;
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            //added
            //this.game = game;
            this.animations.add('walk');
            this.animations.play('walk', 8, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            //
        }
        Enemy.prototype.update = function () {
            //
            //console.log("Hero " + gravityButton.isDown);
            this.body.velocity.y = 0;
            this.body.velocity.x = -70;
            //enemyChase.body.x = hero.body.x - 150;
            //if (gravityButton.isDown) {
            //if (gravityButton.isDown && this.body.blocked.down || gravityButton.isDown && this.body.blocked.up) {
            //    this.flipHero();
            //    heroJumped = true;
            //    jumpLocation = this.body.x;
            //    this.body.gravity.y = this.body.gravity.y * -1;
            //    //game.physics.arcade.gravity.y = game.physics.arcade.gravity.y * -1;
            //    first = false;
            //}
        };
        return Enemy;
    })(Phaser.Sprite);
    GravityGuy.Enemy = Enemy;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var enemyChase = (function (_super) {
        __extends(enemyChase, _super);
        function enemyChase(game, x, y) {
            _super.call(this, game, x, y, 'enemyChase', 0);
            //layer = layerT;
            //this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            //added
            //this.game = game;
            this.animations.add('run');
            this.animations.play('run', 10, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = true;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        }
        enemyChase.prototype.update = function () {
            //
            //console.log("Hero " + gravityButton.isDown);
            this.body.velocity.y = 0;
            this.body.velocity.x = 400;
            //enemyChase.body.x = hero.body.x - 150;
            //if (gravityButton.isDown) {
            //if (gravityButton.isDown && this.body.blocked.down || gravityButton.isDown && this.body.blocked.up) {
            //    this.flip();
            //    //heroJumped = true;
            //    //jumpLocation = this.body.x;
            //    this.body.gravity.y = this.body.gravity.y * -1;
            //    //game.physics.arcade.gravity.y = game.physics.arcade.gravity.y * -1;
            //    first = false;
            //}
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
        };
        return enemyChase;
    })(Phaser.Sprite);
    GravityGuy.enemyChase = enemyChase;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', GravityGuy.Boot, false);
            this.state.add('Preloader', GravityGuy.Preloader, false);
            this.state.add('MainMenu', GravityGuy.MainMenu, false);
            this.state.add('Level1', GravityGuy.Level1, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    GravityGuy.Game = Game;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var cursors;
    var layer;
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game, x, y) {
            _super.call(this, game, x, y, 'hero', 0);
            //layer = layerT;
            //this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            //added
            //this.game = game;
            this.animations.add('run');
            this.animations.play('run', 10, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = true;
            this.game.camera.follow(this);
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            //
        }
        Hero.prototype.update = function () {
            //
            //console.log("Hero " + gravityButton.isDown);
            this.body.velocity.y = 0;
            this.body.velocity.x = 400;
            //enemyChase.body.x = hero.body.x - 150;
            //if (gravityButton.isDown) {
            //if (gravityButton.isDown && this.body.blocked.down || gravityButton.isDown && this.body.blocked.up) {
            //    this.flipHero();
            //    heroJumped = true;
            //    jumpLocation = this.body.x;
            //    this.body.gravity.y = this.body.gravity.y * -1;
            //    //game.physics.arcade.gravity.y = game.physics.arcade.gravity.y * -1;
            //    first = false;
            //}
        };
        return Hero;
    })(Phaser.Sprite);
    GravityGuy.Hero = Hero;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
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
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
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
            this.hero = new GravityGuy.Hero(this.game, 150, 300);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new GravityGuy.enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            //this.add.sprite(150, 300, 'hero'); // Start location
            enemies = [];
            enemiesTotal = 24;
            enemiesDead = 0;
            for (var i = 0; i < enemiesTotal; i++) {
                newEnemyX = this.game.rnd.integerInRange(newEnemyX + 1200, newEnemyX + 2200);
                enemies.push(new GravityGuy.Enemy(this.game, newEnemyX, 300));
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
        };
        Level1.prototype.update = function () {
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
        };
        Level1.prototype.flipHero = function () {
            if (floor) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = 1; //facing default direction
                this.hero.scale.y = -1; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = 1; //facing default direction
                //enemyChase.scale.y = -1; //flipped
                floor = false;
            }
            else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -1; //facing default direction
                this.hero.scale.y = 1; //flipped
                //enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //enemyChase.scale.y = -1; //facing default direction
                //enemyChase.scale.y = 1; //flipped
                floor = true;
            }
        };
        Level1.prototype.flipEnemy = function () {
            if (floorEnemy) {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = 1; //facing default direction
                //hero.scale.y = -1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -1; //flipped
                floorEnemy = false;
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                this.enemyChase.scale.y = -1; //facing default direction
                this.enemyChase.scale.y = 1; //flipped
                floorEnemy = true;
            }
        };
        Level1.prototype.fireBullet = function () {
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
                        }
                        else {
                            bullet.reset(this.hero.x + 30, this.hero.y - 30);
                            bullet.body.velocity.x = 10000;
                            bulletTime = this.game.time.now + 200;
                        }
                    }
                    else {
                        bullet.reset(this.hero.x + 30, this.hero.y + 5);
                        bullet.body.velocity.x = 10000;
                        bulletTime = this.game.time.now + 200;
                    }
                }
            }
        };
        Level1.prototype.resetBullet = function (bullet) {
            //  Called if the bullet goes out of the screen
            bullet.kill();
        };
        Level1.prototype.fireEnemyBullet = function (activeEnemy) {
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
        };
        Level1.prototype.resetEnemyBullet = function (enemyBullet) {
            //  Called if the bullet goes out of the screen
            enemyBullet.kill();
        };
        Level1.prototype.render = function () {
            //  The score
            this.game.debug.text(scoreString + score, 32, 24, 'white', '34px Arial');
            //  Lives
            this.game.debug.text('Lives : ' + numLives, 648, 24, 'white', '34px Arial');
        };
        return Level1;
    })(Phaser.State);
    GravityGuy.Level1 = Level1;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    GravityGuy.MainMenu = MainMenu;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            //  Load our actual games assets
            this.load.image('titlepage', 'assets/titlepage.jpg');
            this.load.image('logo', 'assets/logo.png');
            //this.load.audio('music', 'assets/title.mp3', true);
            //this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
            //this.load.image('level1', 'assets/level1.png');
            //added
            this.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-1', 'resources/tiles-1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');
            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 99);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            //end added
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    GravityGuy.Preloader = Preloader;
})(GravityGuy || (GravityGuy = {}));
var TitleState;
(function (TitleState) {
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            _super.apply(this, arguments);
        }
        TitleScreenState.prototype.contructor = function () {
            //super();
        };
        TitleScreenState.prototype.create = function () {
            this.titleScreenImage = this.add.sprite(0, 0, "space_background_planet");
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); //scales screen image
            this.music = this.game.add.audio("Title_DnB");
            this.music.volume = 15;
            this.music.loop = true;
            this.music.play();
        };
        return TitleScreenState;
    })(Phaser.State);
    TitleState.TitleScreenState = TitleScreenState;
})(TitleState || (TitleState = {}));
