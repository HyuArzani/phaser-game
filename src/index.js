import Phaser from 'phaser';
import TownScene from './scene/TownScene';
import JungleScene from './scene/JungleScene'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [TownScene, JungleScene],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
};

const game = new Phaser.Game(config);
