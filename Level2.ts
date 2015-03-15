module GravityGuy {

    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var crawlEnemiesTotal;
    var enemyCrawlLocationsX;
    var enemyCrawlLocationsY;
    var levelComplete;

    export class Level2 extends Level0 {

        background: Phaser.TileSprite;

        create() {
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background2');
            this.background.fixedToCamera = true;
            super.setBackground(this.background);
            super.create();
            super.setLevel(2);
            this.map = this.add.tilemap('joels_level');
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);

            // Powerups
            this.life = new PowerUp(this.game, this, this.hero, 'life', 2, 6000, 150, 0);
            this.ammo = new PowerUp(this.game, this, this.hero, 'ammo', 10, 2800, 150, 0);
            this.star = new PowerUp(this.game, this, this.hero, 'star', 1000, 9000, 150, 0);
            this.magic = new PowerUp(this.game, this, this.hero, 'magic', 1000, 7500, 150, 0);
            //this.clock = new PowerUp(this.game, this, this.hero, 'clock', 1000, 9000, 150, 0);
            this.diamond = new PowerUp(this.game, this, this.hero, 'diamond', 2000, 3000, 150, 0);


            enemiesTotal = 13; //23 originally
            super.setEnemiesTotal(enemiesTotal);

            enemyLocationsX = [this.game.rnd.integerInRange(500, 1214), /*this.game.rnd.integerInRange(1570, 1920), this.game.rnd.integerInRange(2000, 2400),this.game.rnd.integerInRange(6990, 7085),*/
                                                8246, 8611, /*8944,*/ 9366, 9895, 10286, /*11136, 11100, 11000,*/ 12074, 12579, 13670, 13790, 5191, 5299, 5005, /*6011, 6196, 6860*/];
            enemyLocationsY = [360, 145, 75, 300, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100, 250, 250, 250, 123, 335, 355, 135, 335, 130];
            super.setEnemyLocations(enemyLocationsX, enemyLocationsY);

            super.createEnemies();

            crawlEnemiesTotal = 1; // 6 originally
            super.setCrawlEnemiesTotal(crawlEnemiesTotal);

            enemyCrawlLocationsX = [/*this.game.rnd.integerInRange(1424, 1480), this.game.rnd.integerInRange(6813, 7000), this.game.rnd.integerInRange(7840, 8000), this.game.rnd.integerInRange(8700, 8770),
                this.game.rnd.integerInRange(9900, 10000), this.game.rnd.integerInRange(10900, 11050)*/13790];
            enemyCrawlLocationsY = [/*430, 350, 30, 30, 30, 30*/355];
            super.setCrawlEnemyLocations(enemyCrawlLocationsX, enemyCrawlLocationsY);

            super.createCrawlEnemies();

            var spaceship = this.game.add.sprite(13870, 195, 'spaceship');
            levelComplete = false;

        }

        update() {
            if (!levelComplete && this.hero.x >= 13900) {
                super.levelComplete();
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            super.update();            
        }

        fadeOut() {
            this.victoryMusic.stop();
          //  this.game.state.start('BossLevel', true, false);
            this.game.state.start('BossLevel', true, false, super.getScore(), super.getNumLives());
        }
    
    }
}  