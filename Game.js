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
            this.load.image('preloadBar', 'visuals/loadbar.png');
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
    var startMoving;
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y) {
            _super.call(this, game, x, y, 'enemy1', 0);
            //layer = layerT;
            startMoving = x;
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            //added
            //this.game = game;
            this.animations.add('walk');
            this.animations.play('walk', 8, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            //
        }
        Enemy.prototype.update = function () {
            startMoving--;
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
            this.body.collideWorldBounds = false;
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
            _super.call(this, 800, 512, Phaser.CANVAS, 'content', null);
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
            this.animations.play('run', 15, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.game.camera.follow(this);
            this.body.allowRotation = true;
            this.body.gravity.y = 20000;
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
    var enemyJump = false;
    var first;
    var floor;
    var floorEnemy;
    var floorOtherEnemy;
    var hero_scale = 0.7;
    var enemy_scale = 0.8;
    var emitter;
    var levelComplete = false;
    var game_over = false;
    var bonusAdded = false;
    var swapGravity = false;
    var keyboard_grav;
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
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
            this.hero = new GravityGuy.Hero(this.game, 150, 300);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new GravityGuy.enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(50, this.timedUpdate, this);
            enemies = [];
            enemiesTotal = 30;
            enemiesDead = 0;
            var newEnemyX = 0;
            for (var i = 0; i < enemiesTotal; i++) {
                newEnemyX = this.game.rnd.integerInRange(newEnemyX + 1000, newEnemyX + 1800);
                var anotherEnemy = new GravityGuy.Enemy(this.game, newEnemyX, 100);
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
                console.log('enemy created at ' + newEnemyX);
            }
            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');
            first = true;
            floor = true;
            floorEnemy = true;
            floorOtherEnemy = true;
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
        };
        Level1.prototype.update = function () {
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
                for (var j = enemiesDead; j < enemies.length; j++) {
                    if (enemies[j].alive && enemies[j].x - this.hero.x <= 325 && enemies[j].y - this.hero.y > 50) {
                        if (enemyJump && (enemies[j].body.blocked.down || enemies[j].body.blocked.up)) {
                            this.flipOtherEnemy(enemies[j]);
                            enemies[j].body.gravity.y = enemies[j].body.gravity.y * -1;
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
            }
        };
        Level1.prototype.attemptGravitySwap = function () {
            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up);
        };
        Level1.prototype.itsGameOver = function () {
            game_over = true;
            // this.enemies.   
        };
        Level1.prototype.timedUpdate = function () {
            if (!game_over && !levelComplete) {
                score += 10;
                this.background.tilePosition.x--;
            }
        };
        Level1.prototype.levelComplete = function () {
            this.hero.kill();
            this.enemyChase.kill();
            this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
        };
        Level1.prototype.heroEnemyCollide = function (hero, enemy) {
            this.deathBurst(hero);
            this.deathBurst(enemy);
            this.sound_hero_death.play();
            enemy.kill();
            hero.kill();
            this.itsGameOver();
        };
        Level1.prototype.collideEverything = function () {
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
        };
        Level1.prototype.heroShootsEnemy = function (bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            if (enemyBullet) {
                enemyBullet.kill();
            }
            enemiesKilled++;
        };
        Level1.prototype.enemyShootsHero = function (enemyBullet, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            enemyBullet.kill();
            hero.kill();
            this.itsGameOver();
        };
        Level1.prototype.deathBurst = function (entity) {
            emitter.x = entity.body.x;
            emitter.y = entity.body.y;
            emitter.start(true, 1000, null, 10);
        };
        Level1.prototype.flipHero = function () {
            this.sound_hero_jump.play();
            this.sound_hero_gravity.play();
            if (floor) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = -hero_scale; //flipped
                enemyJump = true;
            }
            else {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.y = hero_scale; //flipped
                enemyJump = false;
            }
            floor = !floor;
        };
        Level1.prototype.flipEnemy = function () {
            this.sound_hero_gravity.play();
            if (floorEnemy) {
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -1; //flipped
                floorEnemy = false;
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                this.enemyChase.scale.y = 1; //flipped
                floorEnemy = true;
            }
        };
        Level1.prototype.flipOtherEnemy = function (otherEnemy) {
            this.sound_hero_gravity.play();
            if (floorOtherEnemy) {
                otherEnemy.anchor.setTo(0, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                otherEnemy.scale.y = -1; //flipped
                floorOtherEnemy = false;
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                otherEnemy.anchor.setTo(0, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                otherEnemy.scale.y = 1; //flipped
                floorOtherEnemy = true;
            }
        };
        Level1.prototype.fireBullet = function () {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (!levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);
                if (bullet) {
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)
                            bullet.reset(this.hero.body.x + 140, this.hero.y + 20); //  And fire it
                        else
                            bullet.reset(this.hero.x + 32, this.hero.y - 22);
                    }
                    else {
                        bullet.reset(this.hero.x + 35, this.hero.y);
                    }
                    bullet.body.velocity.x = 5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
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
                    this.sound_enemy_shoot.play();
                    enemyBullet.reset(activeEnemy.body.x + 10, activeEnemy.y + 18);
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
            this.game.debug.text(scoreString + score, 10, 35, 'white', '34px Arial');
            // this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text('Lives : ' + numLives, 648, 35, 'white', '34px Arial');
            if (levelComplete) {
                this.game.debug.text('Level 1 Complete', 200, 200, 'white', '50px Arial');
                this.game.debug.text('Score: ' + score, 265, 260, 'white', '45px Arial');
                this.game.debug.text('Enemies Killed: ' + enemiesKilled, 240, 350, 'white', '40px Arial');
                this.game.debug.text('Bonus: ' + enemiesKilled * 5000, 285, 400, 'white', '40px Arial');
                if (!bonusAdded) {
                    for (var i = 0; i < enemiesKilled * 5000; i++) {
                        score++;
                    }
                    bonusAdded = true;
                }
            }
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
            this.song = this.add.audio('title_music');
            this.song.play();
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
            this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ alpha: 1 }, 6000, Phaser.Easing.Back.Out, true, 2000, 0, false);
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.song.fadeOut(2000);
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.song.destroy();
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
            this.preloadBar = this.add.sprite(250, 470, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.loadAudio();
            this.loadMaps();
            this.loadSpritesheets();
            this.loadImages();
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        Preloader.prototype.loadAudio = function () {
            this.load.audio('hero_death', ['audio/hero_death.mp3', 'audio/hero_death.mp3']);
            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.mp3']);
            this.load.audio('hero_jump', ['audio/hero_jump.mp3', 'audio/hero_jump.mp3']);
            this.load.audio('enemy_shoot', ['audio/enemy_shoot.mp3', 'audio/enemy_shoot.mp3']);
            this.load.audio('victory', ['audio/victory.mp3', 'audio/victory.ogg']);
        };
        Preloader.prototype.loadImages = function () {
            this.load.image('explosion_small', 'visuals/explosion_small.png');
            this.load.image('titlepage', 'visuals/title_background_scaled.png');
            this.load.image('title_planet', 'visuals/title_planet.png');
            this.load.image('tileset_1', 'resources/tileset_1.png');
            this.load.image('bullet', 'visuals/laser.png');
            this.load.image('enemybullet', 'visuals/enemylaser.png');
            this.load.image('background', 'visuals/bkgrnd_sand.png');
            this.load.image('spaceship', 'visuals/spaceship.png');
        };
        Preloader.prototype.loadMaps = function () {
            // this.load.tilemap('level2', 'resources/level2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_test', 'resources/level_test.json', null, Phaser.Tilemap.TILED_JSON);
        };
        Preloader.prototype.loadSpritesheets = function () {
            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/megaenemy.png', 56.66, 60);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 93);
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
