module GravityGuy {

    export class MainMenu extends Phaser.State {

        background: Phaser.Sprite
        logo: Phaser.Sprite
        title: Phaser.Sprite
        song: Phaser.Sound
        slam: Phaser.Sound

        create() {
            this.game.stage.backgroundColor = '#000000';
            this.song = this.add.audio('title_music');
            this.song.play();

            this.slam = this.add.audio('space_slam');

            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.world.centerX, -300, 'title_planet');
            this.logo.anchor.setTo(0.5, 0.5);

            this.title = this.add.sprite(50, -200, 'title_text');
            this.title.scale.setTo(1.2, 1.2);


            this.game.add.existing(this.title);

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ alpha: 1 }, 6000, Phaser.Easing.Back.Out, true, 2000, 0, false);

            this.input.onDown.addOnce(this.fadeOut, this);

        }

        fadeOut() {
            this.slam.play();
            this.song.fadeOut(2000);
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 1000 }, 2000, Phaser.Easing.Linear.None, true);
            this.title.x = 100;
            this.title.y = 200;
            this.title.animations.add('display');
            this.title.animations.play('display', 13, false);
            this.slam.play();
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.startGame, this);

          //  tween.onComplete.add(this.startGame, this);

        }

        startGame() {
            this.song.destroy();
            this.game.state.start('Level1', true, false);
            
        }

    }

} 