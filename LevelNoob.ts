module GravityGuy {


    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    export class LevelNoob extends Level0 {
        background: Phaser.TileSprite;

        init(aScore, aNumberLives) {
            console.log(aScore);
            super.init(aScore, aNumberLives);

        }
        create() {
           
            //has to be above super.ceate
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;
            super.setBackground(this.background);
            //end
            super.create();
            super.setLevel(1);

            //LEVEL :D
            this.map = this.add.tilemap('noob_level');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);

            enemiesTotal = 4;
            super.setEnemiesTotal(enemiesTotal);

            enemyLocationsX = [ this.game.rnd.integerInRange(13193, 13698), this.game.rnd.integerInRange(14727, 15027), this.game.rnd.integerInRange(16000, 16320), this.game.rnd.integerInRange(16800, 16950)];
            enemyLocationsY = [  125, 125, 125, 125];
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
            this.game.state.start('Level1', true, false, super.getScore(), super.getNumLives());
        }
    }
}   