module GravityGuy {

  
    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var airEnemiesTotal;
    var airEnemies;
    var crawlEnemiesTotal;
    var enemyCrawlLocationsX;
    var enemyCrawlLocationsY;
    var levelComplete;
    var danger;
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
            // danger = this.game.add.sprite(9630, 300, 'danger');
            this.map = this.add.tilemap('level_test');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);

            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);

            // Powerups
            this.life = new PowerUp(this.game, this, this.hero, 'life', 2, 9000, 150, 0);
            this.ammo = new PowerUp(this.game, this, this.hero, 'ammo', 10, 2800, 150, 0);
            this.star = new PowerUp(this.game, this, this.hero, 'star', 10000, 4000, 150, 0);
            this.magic = new PowerUp(this.game, this, this.hero, 'magic', 1000, 8000, 150, 0);
            //this.clock = new PowerUp(this.game, this, this.hero, 'clock', 1000, 9000, 150, 0);
            this.diamond = new PowerUp(this.game, this, this.hero, 'diamond', 2000, 6000, 150, 0);

            enemiesTotal = 17;
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

            crawlEnemiesTotal = 2; // originally 6
            super.setCrawlEnemiesTotal(crawlEnemiesTotal);

            enemyCrawlLocationsX = [/*this.game.rnd.integerInRange(2000, 2300), this.game.rnd.integerInRange(2800, 3200), this.game.rnd.integerInRange(3120, 3420),
                this.game.rnd.integerInRange(5510, 5600),*/ this.game.rnd.integerInRange(6300, 6450), this.game.rnd.integerInRange(11100, 11500)];
            enemyCrawlLocationsY = [/*25, 0, 130, 20,*/ 300, 192];
            super.setCrawlEnemyLocations(enemyCrawlLocationsX, enemyCrawlLocationsY);

            super.createCrawlEnemies();

            airEnemies =
            [
               // new EnemyAir(this.game, this, this.hero, false, 50, 1475, 200, 400)

            //new EnemyAir(this.game, this, this.hero, false, 300, 200, 400),
           //     new EnemyAir(this.game, this, this.hero, false, 300, 200, 400), new EnemyAir(this.game, this, this.hero, false, 300, 200, 400);
            ];
            airEnemiesTotal = 1;
            super.setAirEnemies(airEnemies);

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