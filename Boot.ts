module GravityGuy {

    export class Boot extends Phaser.State {

        create() {
            
            this.input.maxPointers = 1;
        
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
              
                this.game.scale.pageAlignHorizontally = true;
            }
         

            this.game.state.start('Preloader', true, false);

        }

    }

} 