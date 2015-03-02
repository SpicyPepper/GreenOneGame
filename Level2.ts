module GravityGuy {

    var layer;
    var enemiesTotal;
    var enemyLocationsX;
    var enemyLocationsY;
    var levelComplete;

    export class Level2 extends Level0 {

        background: Phaser.TileSprite;


        create() {
            this.background = this.add.tileSprite(0, 0, 1024, 512, 'background2');
            this.background.fixedToCamera = true;
            super.setBackground(this.background);
            super.create();
            super.setLevel(2);
            //LEVEL :D
            this.map = this.add.tilemap('joels_level');
            //  this.map = this.add.tilemap('joels_level'); //### HERE IS TEST MAP. SWAP TO PLAY SHITTY LEVEL. PLEASE SOMEONE MAKE A DIFFERENT ONE.
            this.map.addTilesetImage('tileset_1');
            this.map.setCollisionByExclusion([]);
            //    layer = this.map.createLayer('layer_1');
            layer = this.map.createLayer('layer_1');
            layer.resizeWorld();
            super.setLayer(layer);


            enemiesTotal = 15;
            super.setEnemiesTotal(enemiesTotal);

            //************WRONG CORDINATES THIS IS FOR LEVEL1**************
            enemyLocationsX = [this.game.rnd.integerInRange(450, 815), this.game.rnd.integerInRange(1215, 1840), this.game.rnd.integerInRange(3119, 3518), this.game.rnd.integerInRange(3519, 3729),
                this.game.rnd.integerInRange(3730, 4047), this.game.rnd.integerInRange(6447, 7000), this.game.rnd.integerInRange(7001, 7790), this.game.rnd.integerInRange(7791, 8368),
                this.game.rnd.integerInRange(8369, 8752), this.game.rnd.integerInRange(11600, 12100), this.game.rnd.integerInRange(12101, 12600), this.game.rnd.integerInRange(12601, 13100),
                this.game.rnd.integerInRange(13101, 13965), this.game.rnd.integerInRange(15700, 16150), this.game.rnd.integerInRange(16151, 16560)];
            enemyLocationsY = [373, 373, 129, 373, 208, 192, 192, 96, 32, 192, 192, 192, 192, 208, 208];
            super.setEnemyLocations(enemyLocationsX, enemyLocationsY);

            super.createEnemies();
            //************************************************************************************
            //Commented out. This is Level 2 spawn Enemies. Change to they way we do it for level1
            //*****************************************************************************************
            /*
            for (var i = 0; i < enemiesTotal; i++) {
                console.log("created");
                if (i == 0) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
                } else if (i == 1) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
                } else if (i == 2) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
                } else if (i == 3) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
                } else if (i == 4) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
                } else if (i == 5) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
                } else if (i == 6) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
                } else if (i == 7) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
                } else if (i == 8) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
                } else if (i == 9) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
                } else if (i == 10) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
                } else if (i == 11) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
                } else if (i == 12) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
                } else if (i == 13) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
                } else if (i == 14) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
                }
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
                //    console.log('enemy created at ' + newEnemyX);
            }*/

            var spaceship = this.game.add.sprite(13870, 195, 'spaceship');
            levelComplete = false;

        }


        update() {
            if (!levelComplete && this.hero.x >= 13870) {
                super.levelComplete();
                this.input.onDown.addOnce(this.fadeOut, this);
                levelComplete = true;
            }
            super.update();

            //************************************************************************************
            //Commented out. This is Level 2 spawn Enemies. Change to they way we do it for level1
            //*****************************************************************************************
            /*for (var i = 0; i < enemiesTotal; i++) {
                if (i == 0) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(450, 815), 373);
                } else if (i == 1) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(1215, 1840), 373);
                } else if (i == 2) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3119, 3518), 129);
                } else if (i == 3) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3519, 3729), 373);
                } else if (i == 4) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(3730, 4047), 208);
                } else if (i == 5) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(6447, 7000), 192);
                } else if (i == 6) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7001, 7790), 192);
                } else if (i == 7) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(7791, 8368), 96);
                } else if (i == 8) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(8369, 8752), 34);
                } else if (i == 9) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(11600, 12100), 192);
                } else if (i == 10) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12101, 12600), 192);
                } else if (i == 11) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(12601, 13100), 192);
                } else if (i == 12) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(13101, 13965), 192);
                } else if (i == 13) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(15700, 16150), 208);
                } else if (i == 14) {
                    var anotherEnemy = new Enemy(this.game, this.game.rnd.integerInRange(16151, 16560), 208);
                }
                anotherEnemy.scale.setTo(enemy_scale, enemy_scale);
                this.physics.arcade.enableBody(anotherEnemy);
                enemies.push(anotherEnemy);
            }*/
        }

        fadeOut() {
            this.victoryMusic.stop();
            this.game.state.start('GameWon', true, false);
        }
    
    }
}  