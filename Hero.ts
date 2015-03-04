module GravityGuy {
 
    var cursors;
    var layer;
    var oldXpos;
    var offset;
    var currDistance;
    var oldDistance;
    var just_landed;
    var state;
    export class Hero extends Phaser.Sprite {

        in_air;

        sound_footstep: Phaser.Sound;
        sound_landing: Phaser.Sound;

        constructor(game: Phaser.Game, x: number, y: number, aState: number) {

            super(game, x, y, 'hero', 0);
            just_landed = false;
            //layer = layerT;
            //this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            state = aState;
            //added
            //this.game = game;
           
            if (state === 3) {
                this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
            } else {
                game.time.events.loop(200, this.running, this);
                this.sound_footstep = game.add.audio('footstep');
                this.sound_landing = game.add.audio('footstep');
                this.animations.add('run');
                this.animations.play('run', 20, true);
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

        running() {
            if (!this.in_air && this.alive) {
                this.sound_footstep.play();
            }
        }

        update() {
           
            if (state === 3) { /* We should probably create another Hero object for the differences in updating. */
                this.body.velocity.y = 0;
              
            } else {
                if (this.alive) {

                    /* For the purpose of knowing whether Hero is in air of on ground.*/
                    if (this.in_air) {
                        if (this.body.blocked.down || this.body.blocked.up) {
                            this.in_air = false;
                           // console.log("blocked");
                            this.sound_landing.play();
                        }
                    } else {
                        if (!this.body.blocked.down && !this.body.blocked.up) {
                            this.in_air = true;
                          //  console.log("air");
                        }
                    }

                    this.body.velocity.y = 0;
                    this.body.velocity.x = 450;

                    if (offset === 0) {
                        this.game.camera.follow(this);
                    } else {
                        this.game.camera.follow(null);

                        this.game.camera.focusOnXY(this.x + offset, this.y);
                    }

                    if (Math.abs((this.x - oldXpos)) < 1/* && count > 50*/) {
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
                } else {

                    offset = 0;
                    oldDistance = 0;
                    currDistance = 0;
                    oldXpos = this.x;

                }
            }
        }
    }
}
