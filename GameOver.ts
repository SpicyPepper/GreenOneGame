module GravityGuy {

    export class GameOver extends Phaser.State {

        background: Phaser.Sprite;
        logo: Phaser.Sprite;
        song: Phaser.Sound;
        preloadBar: Phaser.Sprite;

        create() {


            this.song = this.add.audio('title_music');
            this.song.play();

            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ alpha: 1 }, 6000, Phaser.Easing.Back.Out, true, 2000, 0, false);

            this.input.onDown.addOnce(this.fadeOut, this);

        }

        fadeOut() {

            this.song.fadeOut(2000);
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(this.startGame, this);

        }

        startGame() {
            this.song.destroy();
            this.game.state.start('Level1', true, false);

        }

        render() {
            this.game.debug.text("Game Over", 265, 200, 'white', '50px Arial');
            this.game.debug.text("That was sad to watch...", 160, 260, 'white', '50px Arial');
            //while (count < 10) {
            //this.game.debug.text('Score: ' + score, 265, 320, 'white', '45px Arial');
            this.game.debug.text("Click Anywhere to Restart", 160, 380, 'white', '45px Arial');
        }
           

    }

} 