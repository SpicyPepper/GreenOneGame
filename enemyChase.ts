module GravityGuy {
    var state;
    export class enemyChase extends Phaser.Sprite {

        blocked_after_end;
        in_air;

        constructor(game: Phaser.Game, x: number, y: number, aState: number) {

            super(game, x, y, 'enemyChase', 0);

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

        }

        update() {
            if (state === 3) {
                this.body.velocity.x = 0;
                this.animations.play('idle');
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
    }
}
 