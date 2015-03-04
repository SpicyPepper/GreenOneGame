module GravityGuy {

    var cursors;
    var layer;
    var move;

    export class Enemy extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'enemy1', 0);
 
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);

            this.animations.add('walk');
            this.animations.play('walk', 4, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.body.gravity.y = 18000;
            this.anchor.setTo(0.5, 0);

        }

        update() {

            this.body.velocity.y = 0;
            this.body.velocity.x = -40;

        }
    }
}
