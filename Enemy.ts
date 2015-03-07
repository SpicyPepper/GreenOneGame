module GravityGuy {

    var cursors;
    var layer;
    var move;

    export class Enemy extends Phaser.Sprite {
        hero: Hero
        sound_grav: Phaser.Sound
        level: Level0
        cooldown = false;
        my_velocity;
        constructor(game: Phaser.Game, lvl: Level0, player: Hero, x: number, y: number) {

            super(game, x, y, 'enemy1', 0);
        
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
        
        update() {

            this.body.velocity.y = 0;

            if (!this.cooldown && this.body.x - this.hero.body.x <= 400 && this.alive ) { /* I'M CLOSE TO THE HERO AND I'M ALIVE */
                this.body.velocity.x = this.my_velocity;
                if (this.body.gravity.y > 0) {/* I'm going down */
                    if (this.hero.body.gravity.y < 0 /* && this.body.y < this.hero.body.y - this.hero.height*/) { /* hero is going up */
                        this.flipEntity();
                    }
                } else if (this.hero.body.gravity.y > 0) {
                    this.flipEntity();
                }              
            }


        }
        cooledDown() {
            this.cooldown = false;
        }
        flipEntity() {
        //    console.log("hero: " + this.hero.body.x.toFixed(0) + ", " + this.hero.body.y.toFixed(0) + " enemy: " + this.body.x.toFixed(0) + ", " + this.body.y.toFixed(0)); 
            this.cooldown = true;
            this.game.time.events.add(Phaser.Timer.QUARTER, this.cooledDown, this);
            this.level.sound_grav.play();
            this.body.gravity.y *= -1;
            this.anchor.setTo(1, .5);
            this.scale.y *= -1;

        }
    }
}
