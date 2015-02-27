module GravityGuy {
 
    var cursors;
    var layer;
    var oldXpos;
    var offset;
    var currDistance;
    var oldDistance;
   
    export class Hero extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'hero', 0);
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

        update() {
           
            
            if (this.alive) {
                this.body.velocity.y = 0;
                this.body.velocity.x = 450;

                this.game.camera.focusOnXY(this.x + offset, this.y);

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
                console.log(offset);
                oldDistance = currDistance;

                oldXpos = this.x;

                if (this.game.camera.x >= this.x) {
                    this.kill();
                }
            } else {
                offset = 0;
                oldDistance = 0;
                currDistance = 0;
                oldXpos = this.x;
            }

        }

        //flipHero() {
        //    if (floor) {

        //        this.anchor.setTo(1, .5); //so it flips around its middle
        //        this.scale.y = 1; //facing default direction
        //        this.scale.y = -1; //flipped
        //        floor = false;
        //    } else {
        //        this.anchor.setTo(1, .5); //so it flips around its middle
        //        this.scale.y = -1; //facing default direction
        //        this.scale.y = 1; //flipped
        //        floor = true;
        //    }
        //}
    }
}
