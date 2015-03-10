


module GravityGuy {

    var cursors;
    var layer;
    var move;

    export class Powerups extends Phaser.Sprite {
        hero: Hero
        sound_grav: Phaser.Sound
        level: Level0
        cooldown = false;
        my_velocity;
        collides;

        /* Parameters: game, level, collide with layers, x-coordinate to spawn */
        constructor(game: Phaser.Game, x: number, y: number, aState: number) {

            super(game, x, y, 'life', 1900);

            this.game.physics.enable(this, Phaser.Physics.ARCADE);

            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.body.velocity.x = 0;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;

        }

        update() {

            this.body.velocity.y = 0;
        }
    }
}

