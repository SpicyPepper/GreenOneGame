module GravityGuy {
    
    export class enemyChase extends Phaser.Sprite {

        blocked_after_end;
        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'enemyChase', 0);
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

        update() {
            
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
        }

        //flip() {
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
 