module GravityGuy {

    var cursors;
    var layer;
    var move;

    export class EnemyCrawl extends Phaser.Sprite {
        hero: Hero
        level: Level0
        my_velocity;
        constructor(game: Phaser.Game, lvl: Level0, player: Hero, x: number, y: number) {

            super(game, x, y, 'enemyCrawl', 0);

            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.hero = player;
            this.level = lvl;
            this.my_velocity = -20;
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

        update() {

            this.body.velocity.y = 0;
            this.body.velocity.x = this.my_velocity;
        }
    }
}
 