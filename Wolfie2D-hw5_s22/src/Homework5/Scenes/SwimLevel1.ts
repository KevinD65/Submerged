import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "hw5_assets/tilemaps/SubmergedMap1.tmj");
        this.load.spritesheet("player", "hw5_assets/spritesheets/diver.json");
        this.load.spritesheet("shark", "hw5_assets/spritesheets/shark.json");
        //this.load.spritesheet("red", "hw5_assets/spritesheets/redBalloon.json");
        //this.load.spritesheet("blue", "hw5_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("mine", "hw5_assets/spritesheets/mine.json")
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
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 81*256, 10*256);

        this.playerSpawn = new Vec2(2*128, 4*128);

        // Set the total switches and balloons in the level
        this.totalMines = 1;
        this.totalSwitches = 4;

        // Set this to a water level
        this.waterLevel = true;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(75, 5), new Vec2(5, 5));

        this.nextLevel = Level2;

        //COMMENT THIS FOR NOW! WILL REPURPOSE BALLOONS FOR MINES AND HEALTH KITS!!!!!!
        // Add balloons of various types, just red and blue for the first level
        for(let pos of [new Vec2(10, 5)]){
            this.addMine("mine", pos, {});
        }

        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
        //console.log("LEVEL1: " + this.waterLevel)
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}