module GravityGuy {


    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var crawlEnemiesTotal;
    var enemyCrawlLocationsX;
    var enemyCrawlLocationsY;
    var levelComplete;
    var danger;
    var spacebar;
    var rightarrow;
    export class LevelNoob extends Level0 {
        background: Phaser.TileSprite;

       
        create() {
           
            //has to be above super.ceate
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
            this.background.fixedToCamera = true;
            super.setBackground(this.background);
            //end
            super.create();
            super.setLevel(1);

            spacebar = this.game.add.sprite(840, 40, 'spacebar');
            rightarrow = this.game.add.sprite(11000, 50, 'rightarrow');
            danger = this.game.add.sprite(10030, 10, 'danger');
            this.life = new PowerUp(this.game, this, this.hero, 'life', 2, 3000, 150, 0);
            this.ammo = new PowerUp(this.game, this, this.hero, 'ammo', 10, 2800, 150, 0);
            this.star = new PowerUp(this.game, this, this.hero, 'star', 1000, 4000, 150, 0);
            this.key = new PowerUp(this.game, this, this.hero, 'key', 1000, 6500, 150, 0);
            this.magic = new PowerUp(this.game, this, this.hero, 'magic', 1000, 7500, 150, 0);
            this.clock = new PowerUp(this.game, this, this.hero, 'clock', 1000, 9000, 150, 0);
            this.diamond = new PowerUp(this.game, this, this.hero, 'diamond',  2000, 4700, 150, 0);

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

            crawlEnemiesTotal = 2;
            super.setCrawlEnemiesTotal(crawlEnemiesTotal);

            enemyCrawlLocationsX = [this.game.rnd.integerInRange(11500, 12500), this.game.rnd.integerInRange(15350, 15800)];
            enemyCrawlLocationsY = [125, 125];
            super.setCrawlEnemyLocations(enemyCrawlLocationsX, enemyCrawlLocationsY);

            super.createCrawlEnemies();

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