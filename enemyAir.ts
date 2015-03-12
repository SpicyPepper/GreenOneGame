module GravityGuy {

    var cursors;
    var layer;
    var move;

    export class EnemyAir extends Phaser.Sprite {
        hero: Hero
        sound_grav: Phaser.Sound
        level: Level0
        cooldown = false;
        my_velocity;
        y_low;
        y_high;
        orbitRadius;
        ascending;
        collides;
        gravity = 10000;
        ascensionRate;
        speed;

        /* Parameters: game, the level, does the enemy collide with layers, x-coord to spawn, speed of movement, low y threshold for motion, high y threshold for motion.*/
        constructor(game: Phaser.Game, lvl: Level0, player: Hero, collide: boolean, speed: number, x: number,  yLow: number, yHigh: number) {

            super(game, x, yLow, 'enemyAir', 0);

            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.hero = player;
            this.level = lvl;
            this.collides = collide;
            this.y_low = yLow;
            this.y_high = yHigh;
            this.ascending = true;
            this.orbitRadius = (yHigh - yLow) / 2;
            //     this.scale.setTo(lvl.enemy_scale, lvl.enemy_scale);
            this.animations.add('hover');
            this.animations.play('hover', 10, true);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
            this.body.allowRotation = true;
            this.speed = speed * .1;
          //  if (collide)
          //      this.body.gravity.y = 1000;

            //     this.anchor.setTo(0.5, 0);

        }

        update() {

            if (this.body.y > this.y_high) {
                this.ascending = false;
            } else if (this.body.y < this.y_low) {
                this.ascending = true;
            }

            if (this.ascending) {
                this.body.y += this.speed;
            } else {
                this.body.y -= this.speed;
            }
            
           // this.body.x = this.hero.body.x + 100; // THIS LINE IS ONLY FOR TESTING (TO KEEP THE ENEMY ON THE SCREEN)
            //this.body.x = this.hero.body.x + 100;
            //this.body.x = this.orbitRadius * Math.cos(this.angle) + this.body.x
            //this.y = this.orbitRadius * Math.sin(this.angle) + this.body.x;
            //this.angle += this.angular_increase;
            //this.angle = cycle(this.angle, 0, 360);
            //this.body.x = this.hero.body.x + 100;
            //this.body.x = 
            //this.body.y++;
            //this.body.y = this.cycle(this.body.y, this.y_low, this.y_high);
            //this.body.velocity.y = 0;


        }

        cycle(value, min, max) {
        var result, delta;
        delta = (max - min);
        // % is remainder-of-division operator here.
        // limit input to (-delta .. +delta):
        result = (value - min) % delta;
        // wrap negative results around the limit:
        if (result < 0) result += delta;
        // return adjusted input:
        return min + result;
    }
    }
}