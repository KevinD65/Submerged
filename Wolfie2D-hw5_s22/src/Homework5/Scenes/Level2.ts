import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel {
    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     *
     * Not all of these loads are needed. Decide which to remove and handle keeping resources in Level1
     */
     loadScene(): void {
        // Load resources
        this.load.tilemap("level2", "hw5_assets/tilemaps/SubmergedMap2.tmj");
        this.load.spritesheet("player", "hw5_assets/spritesheets/diver.json");
        this.load.spritesheet("shark", "hw5_assets/spritesheets/shark.json");
        //this.load.spritesheet("green", "hw5_assets/spritesheets/greenBalloon.json");
        //this.load.spritesheet("red", "hw5_assets/spritesheets/redBalloon.json");
        //this.load.spritesheet("blue", "hw5_assets/spritesheets/blueBalloon.json");
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("switch", "hw5_assets/sounds/switch.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
        this.load.audio("level_music", "hw5_assets/music/menu.mp3");
    }

    unloadScene(){
        this.resourceManager.keepSpritesheet("player");
        this.resourceManager.keepSpritesheet("shark");
        this.resourceManager.keepSpritesheet("mine");
        this.resourceManager.keepAudio("player_death");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level2", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 72*256, 15*256);

        this.playerSpawn = new Vec2(4*256, 3*256);
        //this.totalSwitches = 7;

        this.waterLevel = true;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(67, 7), new Vec2(3, 3));

        //this.nextLevel = Level3;

        // Add in our green balloons to the enemies
        /*
        for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
            this.addMine("red", pos, {color: HW5_Color.RED});
        }

        //COMMENT THIS FOR NOW! WILL REPURPOSE BALLOONS FOR MINES AND HEALTH KITS!!!!!!
        // Add balloons of various types, just red and blue for the first level
        for(let pos of [new Vec2(10, 5)]){
            this.addMine("mine", pos, {});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4)]){
            this.addMine("blue", pos, {color: HW5_Color.BLUE});
        }
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});*/
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}
