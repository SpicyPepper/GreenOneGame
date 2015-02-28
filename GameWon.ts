module GravityGuy {

    export class GameWon extends Phaser.State {

        background: Phaser.Sprite
        logo: Phaser.Sprite
        title: Phaser.Sprite
        song: Phaser.Sound
 

        create() {

            this.song = this.add.audio('game_won_song');
            this.song.play();



            this.background = this.add.sprite(0, 0, 'game_won_background');
            this.background.alpha = 0;
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
       //     this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
      //      this.logo.anchor.setTo(0.5, 0.5);

            this.title = this.add.sprite(50, -200, 'title_text');
            this.title.scale.setTo(1.2, 1.2);


            this.game.add.existing(this.title);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.addInput, this);

        }

        firstLevel() {
            this.song.destroy();
            this.game.state.start('Level1', true, false);
        }
        restartGame() {
            this.title.x = 100;
            this.title.y = 200;
            this.title.animations.add('display');
            this.title.animations.play('display', 13, false);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.firstLevel, this);
        }

        addInput() {
            this.input.onDown.addOnce(this.restartGame, this);
            //  tween.onComplete.add(this.startGame, this);
        }


    }

} 