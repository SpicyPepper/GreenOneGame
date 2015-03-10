module GravityGuy {

  
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;
    var danger;
    export class Level1 extends Level0 {
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
           // danger = this.game.add.sprite(9630, 300, 'danger');
            this.map = this.add.tilemap('level_test');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);
            
            enemiesTotal = 18;
            super.setEnemiesTotal(enemiesTotal);

            enemyLocationsX = [this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3519, 3729),
                this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600),
                this.game.rnd.integerInRange(12601, 13100), this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150),
                this.game.rnd.integerInRange(16151, 16560), this.game.rnd.integerInRange(13443, 13743), this.game.rnd.integerInRange(13959 + 400, 14259 + 400),
                this.game.rnd.integerInRange(13193, 13698), this.game.rnd.integerInRange(14727, 15027), this.game.rnd.integerInRange(15220, 15880),
                this.game.rnd.integerInRange(16000, 16320), this.game.rnd.integerInRange(16800, 16950), this.game.rnd.integerInRange(16600, 16800)];
            enemyLocationsY = [373, 373, 32, 192, 192, 192, 192, 208, 208, 125, 125, 125, 125, 125, 125, 125, 125];
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
            this.game.state.start('Level2', true, false, super.getScore(), super.getNumLives());
        }
    }
}  