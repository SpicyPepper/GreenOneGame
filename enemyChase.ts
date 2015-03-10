module GravityGuy {
    var state;
    var megaManPath;
    var firstTime;
    var timeDelay;
    var offScreen;
    var bossLevel;
    var stop;
    export class enemyChase extends Phaser.Sprite {

        blocked_after_end;
        in_air;

        constructor(game: Phaser.Game, x: number, y: number, aState: number) {

            super(game, x, y, 'enemyChase', 0);

            this.blocked_after_end = false;
            state = aState;
            this.game.add.existing(this);

            this.game.physics.arcade.enableBody(this);
            this.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 17, true);
            this.animations.add('idle', [0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 6, 7, 0, 1, 0, 1, 0, 1, 2, 3, 2, 1, 2, 3, 4, 5, 5, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7]);
            this.animations.play('run');
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            if (state === 3) {
                this.body.gravity.y = 1000;
                this.body.velocity.x = 275;
            }
            else {
                this.body.gravity.y = 22000;
                this.body.velocity.x = 450;
            }
            this.anchor.setTo(0.5, 0);

            megaManPath = 0;
            firstTime = true;
            offScreen = false;

        }

        update() {
            if (state === 3) {

                if (this.alive && !stop) {
                    this.body.velocity.x = 275;
                    //console.log("Gravity: " + this.body.gravity.y);
                    //if (this.y < 10) {
                    //    console.log("WHY")
                    //    this.y = 100;
                    //}
                    //if (this.y > 510) {
                    //    console.log("WHY2")
                    //    this.y = 500;
                    //}
                    if (firstTime) {
                        firstTime = false;
                        timeDelay = (Math.floor(this.game.time.time / 1000)) + 2;
                       // console.log(1);
                    }

                    if ((Math.floor(this.game.time.time / 1000)) >= timeDelay) {
                        this.animations.play('run');
                        
                        //console.log(2);
                        
                        //console.log(offScreen);
                        if (offScreen) {

                            
                            //// if (this.y < 500 && this.y > 10) {
                            //console.log("IN");
                          
                            //// }
                            if ((this.body.blocked.down || this.body.blocked.up)) {
                                // //     //this.scale.y = -this.scale.y;
                                // //     //this.body.gravity.y = -this.body.gravity.y;
                                //console.log(7);
                                this.body.gravity.y = -this.body.gravity.y;
                                //console.log(4);
                                bossLevel.flipEnemy();
                            }


                        } else {
                            //console.log("HERE");
                            megaManPath = this.game.rnd.integerInRange(0, 100);
                            //console.log(megaManPath % 10 >= 9);
                            if ((megaManPath % 20 >= 19)) {
                             //   console.log(megaManPath);
                                // console.log("HERE1");
                                if ((this.body.blocked.down || this.body.blocked.up)) {
                                    // //     //this.scale.y = -this.scale.y;
                                    // //     //this.body.gravity.y = -this.body.gravity.y;
                                    //console.log(7);
                                    this.body.gravity.y = -this.body.gravity.y;
                                    //console.log(4);
                                    bossLevel.flipEnemy();

                                }

                            }


                        }
                        if ((this.body.blocked.down || this.body.blocked.up)) {
                            if (this.body.gravity.y < 0 && (bossLevel.getFloorEnemy() === true)) {
                             //   console.log(5);
                                this.x = 100;
                                bossLevel.flipEnemy();
                            } else if (this.body.gravity.y > 0 && (bossLevel.getFloorEnemy()) === false) {
                              //  console.log(6);
                                this.x = 100;
                                bossLevel.flipEnemy();
                            }

                        }

                    } else {
                        console.log(7);
                        this.body.velocity.x = 0;
                        this.animations.play('idle');
                    }
                } else {
                 //   console.log(8);
                    firstTime = true;
                    offScreen = false;
                }

            } else {
                this.body.velocity.y = 0;
          
                /* For the general purpose of knowing if the enemyChase is on the ground or in the air. */
                if (this.in_air) {
                    if (this.body.blocked.down || this.body.blocked.up) {
                        this.in_air = false;
                        // console.log("blocked");
                    }
                } else {
                    if (!this.body.blocked.down && !this.body.blocked.up) {
                        this.in_air = true;
                        //  console.log("air");
                    }
                }
            }
        }
        setOffScreen(anOffScreen) {
            // console.log("Before: "+ offScreen );
            offScreen = anOffScreen;
            // console.log("After: " + offScreen);
        }

        setBossLevel(aBossLevel) {
            bossLevel = aBossLevel;
        }

        setStop(value) {
            stop = value;
        }
    }
}
 