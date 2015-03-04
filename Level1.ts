module GravityGuy {

  
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    export class Level1 extends Level0 {
        background: Phaser.TileSprite;
        create() {

            //has to be above super.ceate
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;
            super.setBackground(this.background);
            //end
            super.create();
            super.setLevel(1);

            //LEVEL :D
            this.map = this.add.tilemap('level_test');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);
            
            enemiesTotal = 12;
            super.setEnemiesTotal(enemiesTotal);

            enemyLocationsX = [this.game.rnd.integerInRange(450, 815), this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3519, 3729),
                this.game.rnd.integerInRange(3730, 4047), this.game.rnd.integerInRange(6447, 7000), this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100),
                this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560)];
            enemyLocationsY = [373, 373, 129, 373, 208, 192, 192, 96, 32, 192, 192, 192, 192, 208, 208];
            super.setEnemyLocations(enemyLocationsX, enemyLocationsY);

            super.createEnemies();
           
            var spaceship = this.game.add.sprite(17080, 245, 'spaceship');

            levelComplete = false;
        }

        update() {
            if (!levelComplete && this.hero.x >= 17150) {
                super.levelComplete();
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            super.update();
        }

        fadeOut() {
            this.victoryMusic.stop();
            this.game.state.start('Level2', true, false);
        }
    }
}  