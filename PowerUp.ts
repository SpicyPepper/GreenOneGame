﻿
module GravityGuy {



    export class PowerUp extends Phaser.Sprite {
        key;
        val;
        lvl;
        hero: GravityGuy.Hero
        /* Parameters: game: uh...
          //              key: this is the string that the game uses to identify the sprite, whatever the preloader code titles it.
          //              hero: uh...
            //            level: uh....
          //              value: If the powerup uses a value, this is where you should add it (ex: 3, if 'life' will give you 3 lives. 10, if 'ammo' gives you ten bullets. 
          //              x: uh...
          //              y: uh...
          //              aState: state value if we want to use it on boss level. can have special conditions.
        */
    
        constructor(game: Phaser.Game, level: Level0, hero: Hero, key: string, value: number, x: number, y: number, aState: number) {

            super(game, x, y, key, 0);
    //        console.log(key + " PowerUp added");
            this.val = value;
            this.lvl = level;
            this.hero = hero;
            this.game.physics.arcade.enableBody(this);
            this.game.add.existing(this);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.bounce.y = 0.2;
            this.body.collideWorldBounds = false;
              this.body.allowRotation = true;

        }
        /* dynamic. */
        powerUpNow() {
  //          console.log("powerup! " + this.key);
            if (this.key == 'life') {
  //              console.log("LIFE");
                this.lvl.addLives(this.val);
            } else if (this.key == 'ammo') {
                /* PLEASE IMPLEMENT ######################################### 
                  addBullets is near the end of Level0.ts ################### */
                this.lvl.addAmmo(this.val);
            }

            this.kill();
        }

        update() {
            this.game.physics.arcade.overlap(this, this.hero, this.powerUpNow, null, this);
            /* UPDATE DEPENDS ON KEY (ex: 'life' 'ammo' etc */
        }


    }
}