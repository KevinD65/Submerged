import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";
//import Level4 from "./SwimLevel4";

export default class Level3 extends GameLevel {
    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     *
     * Not all of these loads are needed. Decide which to remove and handle keeping resources in Level1
     */
     loadScene(): void {
        // Load resources
        this.load.tilemap("level3", "hw5_assets/tilemaps/SubmergedMap3.tmj");
        this.load.spritesheet("player", "hw5_assets/spritesheets/diver.json");
        this.load.spritesheet("shark", "hw5_assets/spritesheets/shark.json");
        //this.load.spritesheet("green", "hw5_assets/spritesheets/greenBalloon.json");
        //this.load.spritesheet("red", "hw5_assets/spritesheets/redBalloon.json");
        //this.load.spritesheet("blue", "hw5_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("mine", "hw5_assets/spritesheets/mine.json")
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("switch", "hw5_assets/sounds/switch.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
        this.load.audio("level_music", "hw5_assets/music/menu.mp3");
    }

    unloadScene(){

    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level3", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 60*256, 12*256);

        this.playerSpawn = new Vec2(3*256, 3*256);

        this.waterLevel = true;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(55, 5), new Vec2(2, 3));

        //this.nextLevel = Level4;

        for(let pos of [new Vec2(24,7), new Vec2(34, 4), new Vec2(38, 7), new Vec2(42,4), new Vec2(46,7), new Vec2(51,4)]){
            this.addMine("mine", pos, {});
        }
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}