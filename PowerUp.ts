
module GravityGuy {

    export class PowerUp extends Phaser.Sprite {
        key;
        val;
        lvl;
        hero: GravityGuy.Hero
        /* Parameters: game: uh...
          //              key: this is the string that the game uses to identify the sprite, whatever the preloader code titles it.
          //              hero: uh...
          //              level: uh....
          //              value: If the powerup uses a value, this is where you should add it (ex: 3, if 'life' will give you 3 lives. 10, if 'ammo' gives you ten bullets. 
          //              x: uh...
          //              y: uh...
          //              aState: state value if we want to use it on boss level. can have special conditions.
        */
    
        constructor(game: Phaser.Game, level: Level0, hero: Hero, key: string, value: number, x: number, y: number, aState: number) {

            super(game, x, y, key, 0);
    //      console.log(key + " PowerUp added");
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
            // console.log("powerup! " + this.key);
            /* The life powerup adds 1 life to the total life count */
            if (this.key == 'life') {
                // console.log("LIFE");
                this.hero.addLives(this.val);

            /* The ammo powerup adds ammo to the total ammo */
            } else if (this.key == 'ammo') {
                /* addBullets is near the end of Level0.ts ######## */
                this.lvl.addAmmo(this.val);

            /* The star powerup adds points to the total score */
            } else if (this.key == 'star') {
                this.lvl.addPoints(this.val);

            /* The diamond powerup adds points to the total score */
            } else if (this.key == 'diamond') {
                this.lvl.addPoints(this.val);
            
            /* The key powerup grants access from the Noob Level to the original First Level */ 
            } else if(this.key == 'key') {
                this.lvl.addKeyToFirstLevel();
        
            /* The magic powerup adds invincibility to the hero */
            } else if (this.key == 'magic') {
                this.lvl.addPoints(this.val);
                //this.lvl.addInvincibility();

            /* The clock powerup adds points to the total score */
            } else if (this.key == 'clock') {
                this.lvl.addPoints(this.val);
            }

                this.kill();
            }

        update() {
            this.game.physics.arcade.overlap(this, this.hero, this.powerUpNow, null, this);
            /* UPDATE DEPENDS ON KEY (ex: 'life' 'ammo' etc */
        }
    }
}