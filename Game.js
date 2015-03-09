/* lol */
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
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                this.game.scale.pageAlignHorizontally = true;
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
    var Enemy2 = (function (_super) {
        __extends(Enemy2, _super);
        function Enemy2(game, lvl, player, x, y) {
            _super.call(this, game, x, y, 'enemy2', 0);
            this.cooldown = false;
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.hero = player;
            this.level = lvl;
            this.my_velocity = -40;
            this.scale.setTo(lvl.enemy_scale, lvl.enemy_scale);
            this.animations.add('walk');
            this.animations.play('walk', 4, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
        }
        Enemy2.prototype.update = function () {
            this.body.velocity.y = 0;
            if (!this.cooldown && this.body.x - this.hero.body.x <= 400 && this.alive) {
                this.body.velocity.x = this.my_velocity;
                if (this.body.gravity.y > 0) {
                    if (this.hero.body.gravity.y < 0) {
                        this.flipEntity();
                    }
                }
                else if (this.hero.body.gravity.y > 0) {
                    this.flipEntity();
                }
            }
        };
        Enemy2.prototype.cooledDown = function () {
            this.cooldown = false;
        };
        Enemy2.prototype.flipEntity = function () {
            //    console.log("hero: " + this.hero.body.x.toFixed(0) + ", " + this.hero.body.y.toFixed(0) + " enemy: " + this.body.x.toFixed(0) + ", " + this.body.y.toFixed(0)); 
            this.cooldown = true;
            this.game.time.events.add(Phaser.Timer.QUARTER, this.cooledDown, this);
            this.level.sound_grav.play();
            this.body.gravity.y *= -1;
            this.anchor.setTo(1, .5);
            this.scale.y *= -1;
        };
        return Enemy2;
    })(Phaser.Sprite);
    GravityGuy.Enemy2 = Enemy2;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var cursors;
    var layer;
    var move;
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, lvl, player, x, y) {
            _super.call(this, game, x, y, 'enemy1', 0);
            this.cooldown = false;
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.hero = player;
            this.level = lvl;
            this.my_velocity = -40;
            this.scale.setTo(lvl.enemy_scale, lvl.enemy_scale);
            this.animations.add('walk');
            this.animations.play('walk', 4, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);
        }
        Enemy.prototype.update = function () {
            this.body.velocity.y = 0;
            if (!this.cooldown && this.body.x - this.hero.body.x <= 400 && this.alive) {
                this.body.velocity.x = this.my_velocity;
                if (this.body.gravity.y > 0) {
                    if (this.hero.body.gravity.y < 0) {
                        this.flipEntity();
                    }
                }
                else if (this.hero.body.gravity.y > 0) {
                    this.flipEntity();
                }
            }
        };
        Enemy.prototype.cooledDown = function () {
            this.cooldown = false;
        };
        Enemy.prototype.flipEntity = function () {
            //    console.log("hero: " + this.hero.body.x.toFixed(0) + ", " + this.hero.body.y.toFixed(0) + " enemy: " + this.body.x.toFixed(0) + ", " + this.body.y.toFixed(0)); 
            this.cooldown = true;
            this.game.time.events.add(Phaser.Timer.QUARTER, this.cooledDown, this);
            this.level.sound_grav.play();
            this.body.gravity.y *= -1;
            this.anchor.setTo(1, .5);
            this.scale.y *= -1;
        };
        return Enemy;
    })(Phaser.Sprite);
    GravityGuy.Enemy = Enemy;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var state;
    var megaManPath;
    var firstTime;
    var timeDelay;
    var offScreen;
    var bossLevel;
    var enemyChase = (function (_super) {
        __extends(enemyChase, _super);
        function enemyChase(game, x, y, aState) {
            _super.call(this, game, x, y, 'enemyChase', 0);
            this.blocked_after_end = false;
            state = aState;
            this.game.add.existing(this);
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
            megaManPath = 0;
            firstTime = true;
            offScreen = false;
        }
        enemyChase.prototype.update = function () {
            if (state === 3) {
                if (this.alive) {
                    if (firstTime) {
                        firstTime = false;
                        timeDelay = (Math.floor(this.game.time.time / 1000) % 60) + 3;
                    }
                    if ((Math.floor(this.game.time.time / 1000)) >= timeDelay) {
                        this.animations.play('run');
                        this.body.velocity.x = 250;
                        //megaManPath = this.game.rnd.integerInRange(0, 2);
                        if (offScreen) {
                            this.body.gravity.y = -this.body.gravity.y;
                            if ((this.body.blocked.down || this.body.blocked.up)) {
                                //this.scale.y = -this.scale.y;
                                bossLevel.flipEnemy();
                            }
                        }
                        if ((this.body.blocked.down || this.body.blocked.up)) {
                            if (this.body.gravity.y < 0 && (bossLevel.getFloorEnemy() == true)) {
                                bossLevel.flipEnemy();
                            }
                            else if (this.body.gravity.y > 0 && (bossLevel.getFloorEnemy()) == false) {
                                bossLevel.flipEnemy();
                            }
                        }
                    }
                    else {
                        this.body.velocity.x = 0;
                        this.animations.play('idle');
                    }
                }
                else {
                    firstTime = true;
                    offScreen = false;
                }
            }
            else {
                this.body.velocity.y = 0;
                /* For the general purpose of knowing if the enemyChase is on the ground or in the air. */
                if (this.in_air) {
                    if (this.body.blocked.down || this.body.blocked.up) {
                        this.in_air = false;
                    }
                }
                else {
                    if (!this.body.blocked.down && !this.body.blocked.up) {
                        this.in_air = true;
                    }
                }
            }
        };
        enemyChase.prototype.setOffScreen = function () {
            // console.log("Before: "+ offScreen );
            offScreen = !(offScreen);
            // console.log("After: " + offScreen);
        };
        enemyChase.prototype.setBossLevel = function (aBossLevel) {
            bossLevel = aBossLevel;
        };
        return enemyChase;
    })(Phaser.Sprite);
    GravityGuy.enemyChase = enemyChase;
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
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 512, Phaser.CANVAS, 'content', null);
            this.state.add('Boot', GravityGuy.Boot, false);
            this.state.add('Preloader', GravityGuy.Preloader, false);
            this.state.add('MainMenu', GravityGuy.MainMenu, false);
            this.state.add('LevelNoob', GravityGuy.LevelNoob, false);
            this.state.add('Level0', GravityGuy.Level0, false);
            this.state.add('Level1', GravityGuy.Level1, false);
            // This is the second level, test mode
            this.state.add('Level2', GravityGuy.Level2, false);
            // Boss map
            //    this.state.add('Level3', Level3, false);
            this.state.add('BossLevel', GravityGuy.BossLevel, false);
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
            this.hero_scale = 1.65;
            just_landed = false;
            //layer = layerT;
            //this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            state = aState;
            //added
            //this.game = game;
            this.scale.setTo(this.hero_scale, this.hero_scale);
            if (state === 3) {
                //this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
                this.animations.add('run_left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20);
                this.animations.add('idle_left', [10, 11, 12], 0.3);
                this.animations.add('idle_straight', [13], 1);
                this.animations.add('idle_right', [14, 15, 16], 0.3);
                this.animations.add('run_right', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 20);
                this.animations.add('walk', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
            }
            else {
                game.time.events.loop(200, this.running, this);
                this.sound_footstep = game.add.audio('footstep');
                this.sound_footstep.volume = .50;
                //this.sound_landing = game.add.audio('footstep');
                this.animations.add('run_left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20);
                this.animations.add('idle_left', [10, 11, 12], 0.3);
                this.animations.add('idle_straight', [13], 1);
                this.animations.add('idle_right', [14, 15, 16], 0.3); //changed from left to right
                this.animations.add('run_right', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 20);
                this.animations.play('run_right', 20, true);
            }
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
        Hero.prototype.running = function () {
            if (!this.in_air && this.alive) {
                this.sound_footstep.play();
            }
        };
        Hero.prototype.update = function () {
            if (state === 3) {
                this.body.velocity.y = 0;
            }
            else {
                if (this.alive) {
                    /* For the purpose of knowing whether Hero is in air of on ground.*/
                    if (this.in_air)
                        if (this.body.blocked.down || this.body.blocked.up)
                            this.in_air = false;
                        else if (!this.body.blocked.down && !this.body.blocked.up)
                            this.in_air = true;
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
            this.enemy_scale = 0.8;
            respawnButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            /* If escape is pressed, game ends */
            escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 2000, 512);
            this.init_sounds();
            this.init_emitters();
            this.hero = new GravityGuy.Hero(this.game, 150, 300, 1);
            hero_scale = this.hero.hero_scale;
            this.physics.arcade.enableBody(this.hero);
            this.enemyChase = new GravityGuy.enemyChase(this.game, 0, 300, 1);
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
            this.init_bullets();
            //Enemy Bullets
        };
        Level0.prototype.init_emitters = function () {
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
        };
        Level0.prototype.init_sounds = function () {
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
        };
        Level0.prototype.init_vars = function () {
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
            score = 0;
            numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 35;
        };
        Level0.prototype.init_bullets = function () {
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
                var anotherEnemy = new GravityGuy.Enemy(this.game, this, this.hero, enemyLocationsX[i], enemyLocationsY[i]);
                enemies.push(anotherEnemy);
            }
        };
        Level0.prototype.update = function () {
            this.collideEverything();
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
            }
            else {
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
                }
                else if (game_over && numLives == 0) {
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
        };
        Level0.prototype.restartAtFirstLevel = function () {
            this.deleteReferences();
            this.music.stop();
            this.game.state.start('LevelNoob', true, false);
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
        };
        Level0.prototype.collideEverything = function () {
            this.physics.arcade.collide(this.hero, layer);
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
            this.sound_collision.play();
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
            this.sound_enemy_death.play();
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
        Level0.prototype.flipEntity = function (entity) {
            // console.log("HERYO");
            this.sound_grav.play();
            entity.body.gravity.y *= -1;
            entity.anchor.setTo(1, .5);
            entity.scale.y *= -1;
        };
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
            //this.game.debug.spriteInfo(this.hero, 400, 400);
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
            }
            else if (!respawn) {
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
            }
            else if (game_over) {
                this.game.debug.text("Game Over", 40, 320, 'red', '70px Lucida Sans Unicode');
                //   this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Lucida Sans Unicode');
                //while (count < 10) {
                this.game.debug.text('Final Score: ' + score, 46, 368, 'white', '45px Lucida Sans Unicode');
                this.game.debug.text("Click anywhere to try again.", 48, 415, 'white', '20px Lucida Sans Unicode');
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
            enemiesTotal = 18;
            _super.prototype.setEnemiesTotal.call(this, enemiesTotal);
            enemyLocationsX = [this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3519, 3729), this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100), this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560), this.game.rnd.integerInRange(13443, 13743), this.game.rnd.integerInRange(13959, 14259), this.game.rnd.integerInRange(13193, 13698), this.game.rnd.integerInRange(14727, 15027), this.game.rnd.integerInRange(15220, 15880), this.game.rnd.integerInRange(16000, 16320), this.game.rnd.integerInRange(16800, 16950), this.game.rnd.integerInRange(16600, 16800)];
            enemyLocationsY = [373, 373, 32, 192, 192, 192, 192, 208, 208, 125, 125, 125, 125, 125, 125, 125, 125];
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
            this.map = this.add.tilemap('joels_level');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            _super.prototype.setLayer.call(this, layer);
            enemiesTotal = 23;
            _super.prototype.setEnemiesTotal.call(this, enemiesTotal);
            enemyLocationsX = [this.game.rnd.integerInRange(500, 1214), this.game.rnd.integerInRange(1570, 1920), this.game.rnd.integerInRange(2000, 2400), this.game.rnd.integerInRange(6990, 7085), 8246, 8611, 8944, 9366, 9895, 10286, 11136, 11100, 11000, 12074, 12579, 13670, 13790, 5191, 5299, 5005, 6011, 6196, 6860];
            enemyLocationsY = [360, 145, 75, 300, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100, 250, 250, 250, 123, 335, 355, 135, 335, 130];
            _super.prototype.setEnemyLocations.call(this, enemyLocationsX, enemyLocationsY);
            _super.prototype.createEnemies.call(this);
            var spaceship = this.game.add.sprite(13870, 195, 'spaceship');
            levelComplete = false;
        };
        Level2.prototype.update = function () {
            if (!levelComplete && this.hero.x >= 13900) {
                _super.prototype.levelComplete.call(this);
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            _super.prototype.update.call(this);
        };
        Level2.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            //  this.game.state.start('BossLevel', true, false);
            this.game.state.start('GameWon', true, false);
        };
        return Level2;
    })(GravityGuy.Level0);
    GravityGuy.Level2 = Level2;
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
    var BossLevel = (function (_super) {
        __extends(BossLevel, _super);
        function BossLevel() {
            _super.apply(this, arguments);
        }
        BossLevel.prototype.create = function () {
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
            this.map = this.add.tilemap('boss_level');
            //  this.map = this.add.tilemap('joels_level'); //### HERE IS TEST MAP. SWAP TO PLAY SHITTY LEVEL. PLEASE SOMEONE MAKE A DIFFERENT ONE.
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            //    layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            this.hero = new GravityGuy.Hero(this.game, 750, 300, 3);
            this.hero.scale.setTo(hero_scale, hero_scale);
            this.physics.arcade.enableBody(this.hero);
            this.hero.animations.play('idle_right');
            this.flipLeft();
            this.enemyChase = new GravityGuy.enemyChase(this.game, 200, 100, 3);
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
            score = 0;
            numLives = 3;
            heroJumped = false;
            enemyJump = false;
            totalBullets = 500;
            facingRight = true;
            shootingRight = true;
            counterToKill = 0;
        };
        BossLevel.prototype.update = function () {
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
                }
                else if (moveLeftButton.isDown) {
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
                }
                else {
                    //this.hero.animations.frame = 0;
                    if (facingRight) {
                        this.hero.animations.play('idle_right');
                    }
                    else {
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
                if (this.hero.x > 800) {
                    this.hero.x = 8;
                }
                if (this.enemyChase.x > 800) {
                    this.enemyChase.x = 8;
                    //if (this.enemyChase.body.gravity.y < 0 && floor) {
                    //    console.log("Whoa");
                    //    this.flipEnemy();
                    //} else if (this.enemyChase.body.gravity.y > 0 && !floor) {
                    //    console.log("Whoa2");
                    //    this.flipEnemy();
                    //}
                    this.enemyChase.setOffScreen();
                }
                if (this.enemyChase.x < 8) {
                    this.enemyChase.x = 800;
                }
                if (this.enemyChase.y <= 0 || this.enemyChase.y >= 512) {
                    this.enemyChase.y = 200;
                }
                if (this.hero.x < 8) {
                    this.hero.x = 800;
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
            }
            else {
                if (!this.enemyChase.blocked_after_end && (this.enemyChase.body.blocked.right || this.enemyChase.body.blocked.down)) {
                    this.enemyChase.blocked_after_end = true;
                    this.enemyChase.play('idle', 4, true);
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
                if (respawnButton.isDown && !respawn) {
                    this.enemyChase.kill();
                    this.hero.reset(750, 300);
                    this.enemyChase.reset(200, 100);
                    respawn = true;
                    score = 0;
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
                }
                else if (game_over && numLives == 0) {
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
        };
        BossLevel.prototype.flipRight = function () {
            var offset = 0;
            if (this.hero.scale.x < 0) {
                this.hero.anchor.setTo(1, .5); //so it flips around its middle
                this.hero.scale.x = hero_scale; //flipped
                offset = this.hero.body.halfWidth + 15;
            }
            this.hero.x += offset;
        };
        BossLevel.prototype.flipLeft = function () {
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
        };
        BossLevel.prototype.attemptGravitySwap = function () {
            swapGravity = (this.hero.body.blocked.down || this.hero.body.blocked.up);
        };
        BossLevel.prototype.itsGameOver = function () {
            game_over = true;
            heroAlive = false;
            this.hero.kill();
            this.enemyChase.kill();
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].kill();
            }
        };
        BossLevel.prototype.timedUpdate = function () {
            if (!game_over && !levelComplete && respawn) {
                score += 10;
            }
        };
        BossLevel.prototype.levelComplete = function () {
            this.hero.kill();
            heroAlive = false;
            this.hero.body.y = -200;
            this.enemyChase.kill();
            levelComplete = true;
            this.victoryMusic.play();
            this.music.stop();
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        BossLevel.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            this.game.state.start('GameWon', true, false);
        };
        BossLevel.prototype.bulletWallCollide = function (bullet, layer) {
            bullet.kill();
        };
        BossLevel.prototype.heroEnemyCollide = function (hero, enemy) {
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
        BossLevel.prototype.heroEnemyChaseCollide = function (hero, enemyChase) {
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
        BossLevel.prototype.collideEverything = function () {
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
        };
        /* This function is to kill hero when collide with megaman*/
        BossLevel.prototype.enemyCollidesHero = function (enemyChase, hero) {
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
        BossLevel.prototype.heroShootsEnemy = function (bullet, enemy) {
            this.deathBurst(enemy);
            bullet.kill();
            enemy.kill();
            for (var i = 0; i < enemyBulletsFired; i++) {
                enemyBulletList[i].kill();
            }
            enemiesKilled++;
        };
        BossLevel.prototype.enemyShootsHero = function (enemyBullet, hero) {
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
        BossLevel.prototype.heroShootsEnemyChase = function (enemyChase, bullet) {
            //console.log(counterToKill);
            //if(bullet.body === undefined)
            this.deathBurst(bullet);
            bullet.kill();
            //console.log("SHOT");
            counterToKill++;
            if (counterToKill > 40) {
                this.deathBurst(enemyChase);
                enemyChase.kill();
                this.game.state.start('GameWon', true, false);
            }
        };
        BossLevel.prototype.dustBurst = function (entity) {
            if (entity.scale.x < 0) {
                dust_cloud_emit.x = entity.body.x + 3 * entity.body.halfWidth;
            }
            else {
                dust_cloud_emit.x = entity.body.x + entity.body.halfWidth;
            }
            if (entity.scale.y < 0) {
                dust_cloud_emit.y = entity.body.y;
            }
            else {
                dust_cloud_emit.y = entity.body.y + entity.body.height;
            }
            dust_cloud_emit.start(true, 800, null, 1);
        };
        BossLevel.prototype.deathBurst = function (entity) {
            explode_emit.x = entity.body.x;
            explode_emit.y = entity.body.y;
            explode_emit.start(true, 1000, null, 10);
        };
        BossLevel.prototype.flipHero = function () {
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
        BossLevel.prototype.flipEnemy = function () {
            this.sound_hero_gravity.play();
            this.dustBurst(this.enemyChase);
            if (floorEnemy) {
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //  this.enemyChase.scale.y = 1; //facing default direction
                this.enemyChase.scale.y = -4.0; //flipped
                floorEnemy = false;
            }
            else {
                //hero.anchor.setTo(1, .5); //so it flips around its middle
                //hero.scale.y = -1; //facing default direction
                //hero.scale.y = 1; //flipped
                this.enemyChase.anchor.setTo(1, .5); //so it flips around its middle
                //this.enemyChase.scale.y = -1; //facing default direction
                this.enemyChase.scale.y = 4.0; //flipped
                floorEnemy = true;
            }
        };
        BossLevel.prototype.flipOtherEnemy = function (otherEnemy) {
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
        BossLevel.prototype.fireBullet = function () {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (totalBullets > 0 && !levelComplete && this.game.time.now > bulletTime) {
                //  Grab the first bullet we can from the pool
                bullet = this.bullets.getFirstExists(false);
                if (bullet && shootingRight) {
                    this.physics.arcade.collide(bullet, layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first) {
                            console.log("HERE1");
                            bullet.reset(this.hero.body.x + 140, this.hero.y); //  And fire it
                        }
                        else {
                            console.log("HERE2");
                            bullet.reset(this.hero.x + 32, this.hero.y - 22);
                        }
                    }
                    else {
                        console.log("HERE3");
                        bullet.reset(this.hero.x + 35, this.hero.y);
                    }
                    bullet.body.velocity.x = 5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
                    totalBullets--;
                }
                else if (bullet) {
                    this.physics.arcade.collide(bullet, layer);
                    this.sound_hero_fire.play();
                    if (floor) {
                        if (first)
                            bullet.reset(this.hero.body.x - 140, this.hero.y + 20); //  And fire it
                        else
                            bullet.reset(this.hero.x - 32, this.hero.y - 22);
                    }
                    else {
                        bullet.reset(this.hero.x - 35, this.hero.y);
                    }
                    bullet.body.velocity.x = -5000;
                    bulletTime = this.game.time.now + 200;
                    bulletFired = true;
                    totalBullets--;
                }
            }
        };
        BossLevel.prototype.resetBullet = function (bullet) {
            //  Called if the bullet goes out of the screen
            bullet.kill();
        };
        BossLevel.prototype.fireEnemyBullet = function (activeEnemy) {
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
        BossLevel.prototype.endRound = function () {
            respawn = false;
            heroAlive = false;
        };
        BossLevel.prototype.resetEnemyBullet = function (enemyBullet) {
            //  Called if the bullet goes out of the screen
            enemyBullet.kill();
        };
        BossLevel.prototype.render = function () {
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
        BossLevel.prototype.getFloorEnemy = function () {
            return floorEnemy;
        };
        return BossLevel;
    })(Phaser.State);
    GravityGuy.BossLevel = BossLevel;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    var LevelNoob = (function (_super) {
        __extends(LevelNoob, _super);
        function LevelNoob() {
            _super.apply(this, arguments);
        }
        LevelNoob.prototype.create = function () {
            //has to be above super.ceate
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;
            _super.prototype.setBackground.call(this, this.background);
            //end
            _super.prototype.create.call(this);
            _super.prototype.setLevel.call(this, 1);
            //LEVEL :D
            this.map = this.add.tilemap('noob_level');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            _super.prototype.setLayer.call(this, layer);
            enemiesTotal = 4;
            _super.prototype.setEnemiesTotal.call(this, enemiesTotal);
            enemyLocationsX = [this.game.rnd.integerInRange(13193, 13698), this.game.rnd.integerInRange(14727, 15027), this.game.rnd.integerInRange(16000, 16320), this.game.rnd.integerInRange(16800, 16950)];
            enemyLocationsY = [125, 125, 125, 125];
            _super.prototype.setEnemyLocations.call(this, enemyLocationsX, enemyLocationsY);
            _super.prototype.createEnemies.call(this);
            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');
            levelComplete = false;
        };
        LevelNoob.prototype.update = function () {
            if (!levelComplete && this.hero.x >= 17150) {
                _super.prototype.levelComplete.call(this);
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            _super.prototype.update.call(this);
        };
        LevelNoob.prototype.fadeOut = function () {
            this.victoryMusic.stop();
            this.game.state.start('Level1', true, false);
        };
        return LevelNoob;
    })(GravityGuy.Level0);
    GravityGuy.LevelNoob = LevelNoob;
})(GravityGuy || (GravityGuy = {}));
var GravityGuy;
(function (GravityGuy) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.game.stage.backgroundColor = '#000000';
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
            this.game.state.start('LevelNoob', true, false);
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
        Preloader.prototype.create = function () {
            this.game.stage.backgroundColor = '#FFFF00';
            this.game.load.onLoadStart.add(this.loadStart, this);
            this.game.load.onFileComplete.add(this.fileComplete, this);
            this.game.load.onLoadComplete.add(this.loadComplete, this);
            this.pepper = this.game.add.sprite(360, 196, 'pepper');
            this.pepper.animations.add('burn', [0, 1, 2, 3, 4], 9, true);
            this.pepper.play('burn');
            this.text = this.game.add.text(365, 490, "Preparing Resources...", { color: '#CC0000', font: 'Lucida Sans Unicode', size: '45px' });
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.loadAll, this);
        };
        Preloader.prototype.preload = function () {
            this.game.load.spritesheet('pepper', 'visuals/spicy_pepper_sprite.png', 80, 120);
        };
        Preloader.prototype.loadAll = function () {
            /*AUDIO*/
            this.load.audio('space_slam', 'audio/space_slam.mp3');
            this.load.audio('hero_death', ['audio/hero_death.mp3', 'audio/hero_death.mp3']);
            this.load.audio('title_music', ['audio/title_music.mp3', 'audio/title_music.ogg']);
            this.load.audio('House', ['audio/Title_TechHouse.mp3', 'audio/Title_TechHouse.ogg']);
            this.load.audio('hero_fire', ['audio/hero_fire.mp3', 'audio/hero_fire.ogg']);
            this.load.audio('hero_gravity', ['audio/hero_gravity.mp3', 'audio/hero_gravity.ogg']);
            this.load.audio('hero_jump', ['audio/hero_jump.mp3', 'audio/hero_jump.ogg']);
            this.load.audio('enemy_shoot', ['audio/enemy_shoot.mp3', 'audio/enemy_shoot.ogg']);
            this.load.audio('victory', ['audio/victory.mp3', 'audio/victory.ogg']);
            //   this.load.audio('hero_enemyChase_collision', ['audio/hero_enemyChase_collision.mp3', 'audio/hero_enemyChase_collision.mp3']);
            this.load.audio('footstep', ['audio/landing_sound.mp3', 'audio/landing_sound.ogg']);
            this.load.audio('game_won_song', ['audio/game_won_song.mp3', 'audio/game_won_song.ogg']);
            this.load.audio('enemy_death', ['audio/enemy_death.mp3', 'audio/enemy_death.ogg']);
            this.load.audio('grav', ['audio/sound_enemies_grav.mp3', 'audio/sound_enemies_grav.ogg']);
            this.load.audio('collision', ['audio/collision.mp3', 'audio/collision.ogg']);
            /*IMAGES*/
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
            /*MAPS*/
            this.load.tilemap('noob_level', 'resources/noob_level.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('joels_level', 'resources/joels_level.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_test', 'resources/level_test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('Level_3', 'resources/Level_3.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('boss_level', 'resources/boss_level.json', null, Phaser.Tilemap.TILED_JSON);
            /*SPRITESHEETS*/
            this.load.spritesheet('title_text', 'visuals/title_text.png', 474, 117);
            this.load.spritesheet('hero', 'visuals/hero_sprite_full.png', 41, 49);
            this.load.spritesheet('enemyChase', 'visuals/mega_enemy_sprite.png', 50, 40);
            this.load.spritesheet('enemy1', 'visuals/enemy1.png', 68, 93);
            this.load.spritesheet('alien', 'visuals/alien.jpg', 100, 200);
            this.game.load.start();
        };
        Preloader.prototype.loadStart = function () {
            this.text.setText("Loading ...");
        };
        Preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
        };
        Preloader.prototype.loadComplete = function () {
            this.text.setText("LOAD COMPLETE");
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.pepper.destroy();
            this.text.destroy();
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    GravityGuy.Preloader = Preloader;
})(GravityGuy || (GravityGuy = {}));
