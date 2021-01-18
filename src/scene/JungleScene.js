import Phaser from 'phaser';
import tiles from '../assets/tilesets/tuxmon-sample-32px-extruded.png';
import map from '../assets/tilemaps/tuxemon-town.json';
import atlasImg from '../assets/atlas/atlas.png';
import atlasData from '../assets/atlas/atlas.json';
import { MAIN_PLAYER } from '../constant';

export default class JungleScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'JungleScene' });
        let cursors;
        let player;
        let showDebug = false;
    }

    preload ()
    {
        this.load.image("tiles", tiles);
        this.load.tilemapTiledJSON("map", map);
        this.load.atlas(MAIN_PLAYER.atlas, atlasImg, atlasData);
        // this.load.image('logo', logoImg);
    }
      
    create ()
    {
        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createLayer("World", tileset, 0, 0);
        const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true });

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(10);

        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
        const playerObj = PlayerFunc.createPlayer({
            physics: this.physics,
            spawnPoint,
            anims: this.anims,
            atlasInit: MAIN_PLAYER.front,
            ...MAIN_PLAYER,
        }, worldLayer, map, this.cameras.main);
        this.player = playerObj.player;

        this.cursors = this.input.keyboard.createCursorKeys();

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#ffffff"
            })
            .setScrollFactor(0)
            .setDepth(30);

        // Debug graphics
        this.input.keyboard.once("keydown_D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            // Create worldLayer collision graphic above the player, but below the help text
            const graphics = this.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20);
            worldLayer.renderDebug(graphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        });
    }

    update(time, delta) {
        PlayerFunc.updatePlayer({
            player: this.player, ...MAIN_PLAYER
        }, this.cursors)
    }
}