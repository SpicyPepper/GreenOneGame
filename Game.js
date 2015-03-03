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
    var move;
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
            this.animations.play('walk', 4, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        }
        Enemy.prototype.update = function () {
            //console.log("Hero " + gravityButton.isDown);
            this.body.velocity.y = 0;
            this.body.velocity.x = -40;
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
            this.blocked_after_end = false;
            this.game.add.existing(this);
            //added
            //this.game = game;
            this.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 17, true);
            this.animations.add('idle', [0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 6, 7, 0, 1, 0, 1, 0, 1, 2, 3, 2, 1, 2, 3, 4, 5, 5, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7]);
            this.animations.play('run');
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 22000;
            this.anchor.setTo(0.5, 0);
            this.body.velocity.x = 450;
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        }
        enemyChase.prototype.update = function () {
            //console.log("Hero " + gravityButton.isDown);
            this.body.velocity.y = 0;
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
            this.state.add('Level0', GravityGuy.Level0, false);
            this.state.add('Level1', GravityGuy.Level1, false);
            // This is the second level, test mode
            this.state.add('Level2', GravityGuy.Level2, false);
            // Boss map
            this.state.add('Level3', GravityGuy.Level3, false);
            this.state.add('GameWon', GravityGuy.GameWon, false);
            this.state.add('GameOver', GravityGuy.GameOver, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    GravityGuy.Game = Game;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.create = function () {
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
        GameOver.prototype.fadeOut = function () {
            this.song.fadeOut(2000);
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        GameOver.prototype.startGame = function () {
            this.song.destroy();
            this.game.state.start('Level1', true, false);
        };
        GameOver.prototype.render = function () {
            this.game.debug.text("Game Over", 265, 200, 'white', '50px Arial');
            this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Arial');
            //while (count < 10) {
            //this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
            this.game.debug.text("Click Anywhere to Restart", 160, 380, 'white', '45px Arial');
        };
        return GameOver;
    })(Phaser.State);
    GravityGuy.GameOver = GameOver;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var GameWon = (function (_super) {
        __extends(GameWon, _super);
        function GameWon() {
            _super.apply(this, arguments);
        }
        GameWon.prototype.create = function () {
            this.song = this.add.audio('game_won_song');
            this.song.play();
            this.background = this.add.sprite(0, 0, 'game_won_background');
            this.background.alpha = 0;
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            //     this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
            //      this.logo.anchor.setTo(0.5, 0.5);
            this.title = this.add.sprite(50, -200, 'title_text');
            this.title.scale.setTo(1.2, 1.2);
            this.game.add.existing(this.title);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.addInput, this);
        };
        GameWon.prototype.firstLevel = function () {
            this.song.destroy();
            this.game.state.start('Level1', true, false);
        };
        GameWon.prototype.restartGame = function () {
            this.title.x = 100;
            this.title.y = 200;
            this.title.animations.add('display');
            this.title.animations.play('display', 13, false);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.firstLevel, this);
        };
        GameWon.prototype.addInput = function () {
            this.input.onDown.addOnce(this.restartGame, this);
            //  tween.onComplete.add(this.startGame, this);
        };
        return GameWon;
    })(Phaser.State);
    GravityGuy.GameWon = GameWon;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var cursors;
    var layer;
    var oldXpos;
    var offset;
    var currDistance;
    var oldDistance;
    var just_landed;
    var state;
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game, x, y, aState) {
            _super.call(this, game, x, y, 'hero', 0);
            just_landed = false;
            //layer = layerT;
            //this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            state = aState;
            //added
            //this.game = game;
            this.animations.add('run');
            this.animations.play('run', 20, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            //this.game.camera.follow(this);
            this.body.allowRotation = true;
            this.body.gravity.y = 22000;
            this.anchor.setTo(0.5, 0);
            oldXpos = this.x;
            offset = 0;
            currDistance = 0;
            oldDistance = -5;
            //this.body.collides(enemyChase, enemyCollidesHero, this)
            //this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        }
        Hero.prototype.update = function () {
            if (state === 3) {
                this.body.velocity.y = 0;
            }
            else {
                if (this.alive) {
                    this.body.velocity.y = 0;
                    this.body.velocity.x = 450;
                    if (offset === 0) {
                        this.game.camera.follow(this);
                    }
                    else {
                        this.game.camera.follow(null);
                        this.game.camera.focusOnXY(this.x + offset, this.y);
                    }
                    if (Math.abs((this.x - oldXpos)) < 1) {
                        currDistance = Math.abs((this.x - this.game.camera.x - 400));
                        if (currDistance >= oldDistance) {
                            offset += 6;
                        }
                    }
                    else {
                        if (offset >= 3) {
                            offset -= 3;
                        }
                    }
                    oldDistance = currDistance;
                    oldXpos = this.x;
                    if (this.game.camera.x >= this.x && offset >= 12) {
                        this.kill();
                    }
                }
                else {
                    offset = 0;
                    oldDistance = 0;
                    currDistance = 0;
                    oldXpos = this.x;
                }
            }
        };
        return Hero;
    })(Phaser.Sprite);
    GravityGuy.Hero = Hero;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
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
    var enemyChase_scale = 4;
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
    var background;
    var level;
    var Level0 = (function (_super) {
        __extends(Level0, _super);
        function Level0() {
            _super.apply(this, arguments);
        }
        Level0.prototype.create = function () {
            //FPS
            this.game.time.advancedTiming = true;
            /*Working on key binding*/
            keyboard_grav = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keyboard_grav.onDown.add(this.attemptGravitySwap, this);
            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            /* If escape is pressed, game ends */
            escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);
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
            this.hero = new GravityGuy.Hero(this.game, 150, 300, 1);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new GravityGuy.enemyChase(this.game, 0, 300);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(25, this.timedUpdate, this);
            enemiesDead = 0;
            enemyBulletList = [];
            enemies = [];
            //this.createEnemies();
            //works above
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
            bullet;
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
        };
        Level0.prototype.removeEnemies = function () {
            for (var i = 0; i < enemiesTotal; i++) {
                enemies[i].destroy();
            }
            enemies = [];
        };
        Level0.prototype.createEnemies = function () {
            enemies = [];
            for (var i = 0; i < enemiesTotal; i++) {
                var anotherEnemy = new GravityGuy.Enemy(this.game, enemyLocationsX[i], enemyLocationsY[i]);
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
            }
        };
        Level0.prototype.update = function () {
            if (!this.hero.alive && heroAlive) {
                this.deathBurst(this.hero);
                this.sound_hero_death.play();
                if (numLives == 0) {
                    this.itsGameOver();
                }
                else {
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
                for (var i = 0; i < jumpLocationList.length; i++) {
                    //   console.log("IN");
                    if (this.enemyChase.body.x >= jumpLocationList[i] && (this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
                        // if (floorEnemy != floor) {
                        this.flipEnemy();
                        this.enemyChase.body.gravity.y = this.enemyChase.body.gravity.y * -1;
                        jumpLocationList.splice(i, 1);
                    }
                    else {
                        break;
                    }
                }
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
            }
            else {
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
                }
                else if (game_over && numLives == 0) {
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
        };
        Level0.prototype.attemptGravitySwap = function () {
            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up);
        };
        Level0.prototype.itsGameOver = function () {
            game_over = true;
            heroAlive = false;
            this.hero.kill();
            this.enemyChase.kill();
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].kill();
            }
        };
        Level0.prototype.timedUpdate = function () {
            if (!game_over && !levelComplete && respawn) {
                score += 10;
                background.tilePosition.x -= 4;
            }
        };
        Level0.prototype.levelComplete = function () {
            this.hero.kill();
            heroAlive = false;
            this.hero.body.y = -200;
            this.enemyChase.kill();
            //this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
            // Transitions to the Second Level after completing the first level
            // this.game.state.start('Level2', true, false);
        };
        Level0.prototype.bulletWallCollide = function (bullet, layer) {
            bullet.kill();
        };
        Level0.prototype.heroEnemyCollide = function (hero, enemy) {
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
        };
        /* Case where Megaman Catches up with Hero, death ensues */
        Level0.prototype.heroEnemyChaseCollide = function (hero, enemyChase) {
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
        };
        Level0.prototype.collideEverything = function () {
            this.physics.arcade.collide(this.hero, layer);
            if (this.hero.body.blocked.down && this.hero.in_air) {
                this.hero.in_air = false;
                this.sound_landing.play();
            }
            this.physics.arcade.collide(this.enemyChase, layer);
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
        };
        /* This function is to kill hero when collide with megaman*/
        Level0.prototype.enemyCollidesHero = function (enemyChase, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            }
            else {
                numLives -= 1;
                this.endRound();
            }
            heroAlive = false;
        };
        Level0.prototype.heroShootsEnemy = function (bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            for (var i = 0; i < enemyBulletsFired; i++) {
                enemyBulletList[i].kill();
            }
            enemiesKilled++;
        };
        Level0.prototype.enemyShootsHero = function (enemyBullet, hero) {
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
        };
        Level0.prototype.dustBurst = function (entity) {
            //explode_emit.x = entity.body.x;
            //explode_emit.y = entity.body.y;
            //explode_emit.start(true, 1000, null, 10);
            dust_cloud_emit.x = entity.body.x + entity.body.halfWidth;
            if (entity.scale.y < 0) {
                dust_cloud_emit.y = entity.body.y;
            }
            else {
                dust_cloud_emit.y = entity.body.y + entity.body.height;
            }
            dust_cloud_emit.start(true, 800, null, 1);
        };
        Level0.prototype.deathBurst = function (entity) {
            explode_emit.x = entity.body.x;
            explode_emit.y = entity.body.y;
            explode_emit.start(true, 1000, null, 10);
        };
        Level0.prototype.flipHero = function () {
            this.dustBurst(this.hero);
            score += 100;
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
        Level0.prototype.flipEnemy = function () {
            this.sound_hero_gravity.play();
            this.dustBurst(this.enemyChase);
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
        Level0.prototype.flipOtherEnemy = function (otherEnemy) {
            this.sound_hero_gravity.play();
            if (floorOtherEnemy) {
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                otherEnemy.scale.y = -enemy_scale; //flipped
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                otherEnemy.scale.y = enemy_scale; //flipped
            }
            floorOtherEnemy = !floorOtherEnemy;
        };
        Level0.prototype.fireBullet = function () {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (totalBullets > 0 && !levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);
                if (bullet) {
                    this.physics.arcade.collide(bullet, layer);
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
                    totalBullets--;
                }
            }
        };
        Level0.prototype.resetBullet = function (bullet) {
            //  Called if the bullet goes out of the screen
            bullet.kill();
        };
        Level0.prototype.fireEnemyBullet = function (activeEnemy) {
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
        };
        Level0.prototype.endRound = function () {
            respawn = false;
            heroAlive = false;
        };
        Level0.prototype.resetEnemyBullet = function (enemyBullet) {
            //  Called if the bullet goes out of the screen
            enemyBullet.kill();
        };
        Level0.prototype.render = function () {
            //  The score
            this.game.debug.text(scoreString + score, 10, 35, 'white', '34px Arial');
            this.game.debug.text(this.game.time.fps + '' || '--', 2, 60, "#00ff00");
            // this.game.debug.spriteCoords(this.hero, 300, 300);
            this.game.debug.text('Bullets : ' + totalBullets, 345, 35, 'white', '34px Arial');
            this.game.debug.text('Lives : ' + numLives, 660, 35, 'white', '34px Arial');
            if (levelComplete) {
                this.game.debug.text('Level ' + level + ' Complete, Click to Continue', 10, 200, 'white', '50px Arial');
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
            }
            else if (!respawn) {
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
            }
            else if (game_over) {
                this.game.debug.text("Game Over", 265, 200, 'white', '50px Arial');
                this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Arial');
                //while (count < 10) {
                this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
                this.game.debug.text("That all you got?", 210, 380, 'white', '45px Arial');
            }
        };
        Level0.prototype.deleteReferences = function () {
            delete totalBullets.regex;
            delete enemies.regex;
            delete enemiesTotal.regex;
            delete enemiesDead.regex;
            delete enemiesKilled.regex;
            delete enemyBulletList.regex;
            delete jumpLocationList['regex'];
            delete enemyLocationsX.regex;
            delete enemyLocationsY.regex;
        };
        Level0.prototype.setLayer = function (aLayer) {
            layer = aLayer;
        };
        Level0.prototype.setEnemiesTotal = function (anEnemyAmount) {
            enemiesTotal = anEnemyAmount;
        };
        Level0.prototype.setEnemyLocations = function (anEnemyLocationsX, anEnemyLocationsY) {
            enemyLocationsX = anEnemyLocationsX;
            enemyLocationsY = anEnemyLocationsY;
        };
        Level0.prototype.setBackground = function (aBackground) {
            background = aBackground;
        };
        Level0.prototype.setLevel = function (aLevel) {
            level = aLevel;
        };
        return Level0;
    })(Phaser.State);
    GravityGuy.Level0 = Level0;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            //has to be above super.ceate
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;
            _super.prototype.setBackground.call(this, this.background);
            //end
            _super.prototype.create.call(this);
            _super.prototype.setLevel.call(this, 1);
            //LEVEL :D
            this.map = this.add.tilemap('level_test');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            _super.prototype.setLayer.call(this, layer);
            enemiesTotal = 15;
            _super.prototype.setEnemiesTotal.call(this, enemiesTotal);
            enemyLocationsX = [this.game.rnd.integerInRange(450, 815), this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3119, 3518), this.game.rnd.integerInRange(3519, 3729), this.game.rnd.integerInRange(3730, 4047), this.game.rnd.integerInRange(6447, 7000), this.game.rnd.integerInRange(7001, 7790), this.game.rnd.integerInRange(7791, 8368), this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100), this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560)];
            enemyLocationsY = [373, 373, 129, 373, 208, 192, 192, 96, 32, 192, 192, 192, 192, 208, 208];
            _super.prototype.setEnemyLocations.call(this, enemyLocationsX, enemyLocationsY);
            _super.prototype.createEnemies.call(this);
            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');
            levelComplete = false;
        };
        Level1.prototype.update = function () {
            if (!levelComplete && this.hero.x >= 17150) {
                _super.prototype.levelComplete.call(this);
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            _super.prototype.update.call(this);
        };
        Level1.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            this.game.state.start('Level2', true, false);
        };
        return Level1;
    })(GravityGuy.Level0);
    GravityGuy.Level1 = Level1;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    var Level2 = (function (_super) {
        __extends(Level2, _super);
        function Level2() {
            _super.apply(this, arguments);
        }
        Level2.prototype.create = function () {
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background2');
            this.background.fixedToCamera = true;
            _super.prototype.setBackground.call(this, this.background);
            _super.prototype.create.call(this);
            _super.prototype.setLevel.call(this, 2);
            //LEVEL :D
            this.map = this.add.tilemap('joels_level');
            //  this.map = this.add.tilemap('joels_level'); //### HERE IS TEST MAP. SWAP TO PLAY SHITTY LEVEL. PLEASE SOMEONE MAKE A DIFFERENT ONE.
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            //    layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            _super.prototype.setLayer.call(this, layer);
            enemiesTotal = 15;
            _super.prototype.setEnemiesTotal.call(this, enemiesTotal);
            //************WRONG CORDINATES THIS IS FOR LEVEL1**************
            enemyLocationsX = [this.game.rnd.integerInRange(450, 815), this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3119, 3518), this.game.rnd.integerInRange(3519, 3729), this.game.rnd.integerInRange(3730, 4047), this.game.rnd.integerInRange(6447, 7000), this.game.rnd.integerInRange(7001, 7790), this.game.rnd.integerInRange(7791, 8368), this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100), this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560)];
            enemyLocationsY = [373, 373, 129, 373, 208, 192, 192, 96, 32, 192, 192, 192, 192, 208, 208];
            _super.prototype.setEnemyLocations.call(this, enemyLocationsX, enemyLocationsY);
            _super.prototype.createEnemies.call(this);
            //************************************************************************************
            //Commented out. This is Level 2 spawn Enemies. Change to they way we do it for level1
            //*****************************************************************************************
            /*
            for (var i = 0; i < enemiesTotal; i++) {
                console.log("created");
                if (i == 0) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
                } else if (i == 1) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
                } else if (i == 2) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
                } else if (i == 3) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
                } else if (i == 4) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
                } else if (i == 5) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
                } else if (i == 6) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
                } else if (i == 7) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
                } else if (i == 8) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
                } else if (i == 9) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
                } else if (i == 10) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
                } else if (i == 11) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
                } else if (i == 12) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
                } else if (i == 13) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
                } else if (i == 14) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
                }
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
                //    console.log('enemy created at ' + newEnemyX);
            }*/
            var spaceship = this.game.add.sprite(13870, 195, 'spaceship');
            levelComplete = false;
        };
        Level2.prototype.update = function () {
            if (!levelComplete && this.hero.x >= 13870) {
                _super.prototype.levelComplete.call(this);
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            _super.prototype.update.call(this);
            //************************************************************************************
            //Commented out. This is Level 2 spawn Enemies. Change to they way we do it for level1
            //*****************************************************************************************
            /*for (var i = 0; i < enemiesTotal; i++) {
                if (i == 0) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
                } else if (i == 1) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
                } else if (i == 2) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
                } else if (i == 3) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
                } else if (i == 4) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
                } else if (i == 5) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
                } else if (i == 6) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
                } else if (i == 7) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
                } else if (i == 8) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
                } else if (i == 9) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
                } else if (i == 10) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
                } else if (i == 11) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
                } else if (i == 12) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
                } else if (i == 13) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
                } else if (i == 14) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
                }
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
            }*/
        };
        Level2.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            this.game.state.start('GameWon', true, false);
        };
        return Level2;
    })(GravityGuy.Level0);
    GravityGuy.Level2 = Level2;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
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
    var enemyChase_scale = 4.3;
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
    var Level3 = (function (_super) {
        __extends(Level3, _super);
        function Level3() {
            _super.apply(this, arguments);
        }
        Level3.prototype.create = function () {
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
            this.hero = new GravityGuy.Hero(this.game, 150, 300, 3);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new GravityGuy.enemyChase(this.game, 0, 300);
            this.enemyChase.scale.setTo(enemyChase_scale, enemyChase_scale);
            this.physics.arcade.enableBody(this.enemyChase);
            this.time.events.loop(25, this.timedUpdate, this);
            enemiesTotal = 15;
            enemiesDead = 0;
            bulletList = [];
            enemyBulletList = [];
            enemies = [];
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
            score = 0;
            numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 50;
        };
        Level3.prototype.update = function () {
            this.game.camera.x = 0;
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
            //if (heroAlive) {
            if (moveRightButton.isDown) {
                this.hero.x += 5;
            }
            if (moveLeftButton.isDown) {
                this.hero.x -= 5;
            }
            if (this.hero.x > 800) {
                this.hero.x = 100;
            }
            if (this.enemyChase.x > 800) {
                this.enemyChase.x = 100;
            }
            /* if (this.enemyChase.x < (this.hero.x - 300) || this.enemyChase.y < (this.hero.y - 512) || this.enemyChase.y > (this.hero.y + 512)) {
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
                 if (this.enemyChase.body.x >= jumpLocationList[i] - 7.5 && (this.enemyChase.body.blocked.down || this.enemyChase.body.blocked.up)) {
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
                 //this.removeEnemies();
                 //this.createEnemies();
                 //for (var i = 0; i < enemiesTotal; i++) {
                 //   THE PROBLEM COMES F
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
             }*/
            //}
        };
        Level3.prototype.attemptGravitySwap = function () {
            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up);
        };
        Level3.prototype.itsGameOver = function () {
            game_over = true;
            heroAlive = false;
            this.hero.kill();
            this.enemyChase.kill();
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].kill();
            }
        };
        Level3.prototype.timedUpdate = function () {
            if (!game_over && !levelComplete && respawn) {
                score += 10;
            }
        };
        Level3.prototype.levelComplete = function () {
            this.hero.kill();
            heroAlive = false;
            this.hero.body.y = -200;
            this.enemyChase.kill();
            //this.deathBurst(this.enemyChase);
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
            this.input.onDown.addOnce(this.fadeOut, this);
            // Transitions to the Second Level after completing the first level
            // this.game.state.start('Level2', true, false);
        };
        Level3.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            this.game.state.start('GameWon', true, false);
        };
        Level3.prototype.bulletWallCollide = function (bullet, layer) {
            bullet.kill();
        };
        Level3.prototype.heroEnemyCollide = function (hero, enemy) {
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
        };
        /* Case where Megaman Catches up with Hero, death ensues */
        Level3.prototype.heroEnemyChaseCollide = function (hero, enemyChase) {
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
        };
        Level3.prototype.collideEverything = function () {
            this.physics.arcade.collide(this.hero, layer);
            if (this.hero.body.blocked.down && this.hero.in_air) {
                this.hero.in_air = false;
                this.sound_landing.play();
            }
            this.physics.arcade.collide(this.enemyChase, layer);
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
            //this.physics.arcade.overlap(this.enemyChase, this.hero, this.enemyCollidesHero, null, this);
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
        };
        /* This function is to kill hero when collide with megaman*/
        Level3.prototype.enemyCollidesHero = function (enemyChase, hero) {
            this.deathBurst(hero);
            this.sound_hero_death.play();
            hero.kill();
            if (numLives == 0) {
                this.itsGameOver();
            }
            else {
                numLives -= 1;
                this.endRound();
            }
            heroAlive = false;
        };
        Level3.prototype.heroShootsEnemy = function (bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            for (var i = 0; i < enemyBulletsFired; i++) {
                enemyBulletList[i].kill();
            }
            enemiesKilled++;
        };
        Level3.prototype.enemyShootsHero = function (enemyBullet, hero) {
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
        };
        Level3.prototype.dustBurst = function (entity) {
            //explode_emit.x = entity.body.x;
            //explode_emit.y = entity.body.y;
            //explode_emit.start(true, 1000, null, 10);
            dust_cloud_emit.x = entity.body.x + entity.body.halfWidth;
            if (entity.scale.y < 0) {
                dust_cloud_emit.y = entity.body.y;
            }
            else {
                dust_cloud_emit.y = entity.body.y + entity.body.height;
            }
            dust_cloud_emit.start(true, 800, null, 1);
        };
        Level3.prototype.deathBurst = function (entity) {
            explode_emit.x = entity.body.x;
            explode_emit.y = entity.body.y;
            explode_emit.start(true, 1000, null, 10);
        };
        Level3.prototype.flipHero = function () {
            this.dustBurst(this.hero);
            score += 100;
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
        Level3.prototype.flipEnemy = function () {
            this.sound_hero_gravity.play();
            this.dustBurst(this.enemyChase);
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
        Level3.prototype.flipOtherEnemy = function (otherEnemy) {
            this.sound_hero_gravity.play();
            if (floorOtherEnemy) {
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                otherEnemy.scale.y = -enemy_scale; //flipped
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                otherEnemy.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                otherEnemy.scale.y = enemy_scale; //flipped
            }
            floorOtherEnemy = !floorOtherEnemy;
        };
        Level3.prototype.fireBullet = function () {
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
                            bulletList[bulletsFired - 1].reset(this.hero.body.x + 140, this.hero.y + 20); //  And fire it
                        else
                            bulletList[bulletsFired - 1].reset(this.hero.x + 32, this.hero.y - 22);
                    }
                    else {
                        bulletList[bulletsFired - 1].reset(this.hero.x + 35, this.hero.y);
                    }
                    bulletList[bulletsFired - 1].body.velocity.x = 5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
                    totalBullets--;
                }
            }
        };
        Level3.prototype.resetBullet = function (bullet) {
            //  Called if the bullet goes out of the screen
            bullet.kill();
        };
        Level3.prototype.fireEnemyBullet = function (activeEnemy) {
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
        };
        Level3.prototype.endRound = function () {
            respawn = false;
            heroAlive = false;
        };
        Level3.prototype.resetEnemyBullet = function (enemyBullet) {
            //  Called if the bullet goes out of the screen
            enemyBullet.kill();
        };
        Level3.prototype.render = function () {
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
            }
            else if (!respawn) {
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
            }
            else if (game_over) {
                this.game.debug.text("Game Over", 265, 200, 'white', '50px Arial');
                this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Arial');
                //while (count < 10) {
                this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
                this.game.debug.text("That all you got?", 210, 380, 'white', '45px Arial');
            }
        };
        return Level3;
    })(Phaser.State);
    GravityGuy.Level3 = Level3;
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
            this.slam = this.add.audio('space_slam');
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
            this.logo.anchor.setTo(0.5, 0.5);
            this.title = this.add.sprite(50, -200, 'title_text');
            this.title.scale.setTo(1.2, 1.2);
            this.game.add.existing(this.title);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ alpha: 1 }, 6000, Phaser.Easing.Back.Out, true, 2000, 0, false);
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.slam.play();
            this.song.fadeOut(2000);
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 1000 }, 2000, Phaser.Easing.Linear.None, true);
            this.title.x = 100;
            this.title.y = 200;
            this.title.animations.add('display');
            this.title.animations.play('display', 13, false);
            this.slam.play();
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.startGame, this);
            //  tween.onComplete.add(this.startGame, this);
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
            //  The Google WebFont Loader will look for this object, so create it before loading the script.
            this.WebFontConfig = {
                //  'active' means all requested fonts have finished loading
                //active: function () { this.time.events.add(Phaser.Timer.SECOND, createText, this); },
                //  The Google Fonts we want to load ( you can specify as many as you like in the array)
                google: {
                    families: ['Revalia']
                }
            };
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(250, 470, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.loadAudio();
            this.loadMaps();
            this.loadSpritesheets();
            this.loadImages();
            //  Load the Google WebFont Loader script - STILL WORKING ON THIS
            this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        Preloader.prototype.loadAudio = function () {
            this.load.audio('space_slam', 'audio/space_slam.mp3');
            this.load.audio('hero_death', ['audio/hero_death.mp3', 'audio/hero_death.mp3']);
            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.ogg']);
            this.load.audio('hero_jump', ['audio/hero_jump.mp3', 'audio/hero_jump.ogg']);
            this.load.audio('enemy_shoot', ['audio/enemy_shoot.mp3', 'audio/enemy_shoot.ogg']);
            this.load.audio('victory', ['audio/victory.mp3', 'audio/victory.ogg']);
            this.load.audio('hero_enemyChase_collision', ['audio/hero_enemyChase_collision.mp3', 'audio/hero_enemyChase_collision.mp3']);
            this.load.audio('landing_sound', ['audio/landing_sound.mp3', 'audio/landing_sound.ogg']);
            this.load.audio('game_won_song', ['audio/game_won_song.mp3', 'audio/game_won_song.ogg']);
        };
        Preloader.prototype.loadImages = function () {
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
        };
        Preloader.prototype.loadMaps = function () {
            this.load.tilemap('joels_level', 'resources/joels_level.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_test', 'resources/level_test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('Level_3', 'resources/Level_3.json', null, Phaser.Tilemap.TILED_JSON);
        };
        Preloader.prototype.loadSpritesheets = function () {
            this.load.spritesheet('title_text', 'visuals/title_text.png', 474, 117);
            this.load.spritesheet('hero', 'visuals/test_runner.png', 138, 115);
            this.load.spritesheet('enemyChase', 'visuals/mega_enemy_sprite.png', 50, 40);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 93);
            this.load.spritesheet('alien', 'visuals/alien.png', 100, 200);
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
