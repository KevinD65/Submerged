import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";
import Level2 from "./SwimLevel2";
import Level3 from "./SwimLevel3";
import Level4 from "./SwimLevel4";
import Level5 from "./SwimLevel5";
import BossLevel from "./BossLevel";

export default class Level1 extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "hw5_assets/tilemaps/SubmergedMap1.tmj");
        this.load.spritesheet("player", "hw5_assets/spritesheets/diver.json");
        this.load.spritesheet("shark", "hw5_assets/spritesheets/shark.json");
        this.load.spritesheet("mine", "hw5_assets/spritesheets/mine.json")
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("switch", "hw5_assets/sounds/switch.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
        this.load.audio("level_music", "hw5_assets/music/gameplay.mp3");
        this.load.audio("damage","hw5_assets/sounds/dmg.wav");
        this.load.audio("explosion", "hw5_assets/sounds/explosion.wav");
        this.load.audio("levelComplete", "hw5_assets/sounds/levelComplete.wav");
        this.load.audio("invincibilityOn", "hw5_assets/sounds/invincibilityOn.wav");
        this.load.audio("invincibilityOff", "hw5_assets/sounds/invincibilityOff.wav");
        this.load.audio("pause", "hw5_assets/sounds/pause.wav");
        this.load.audio("resume", "hw5_assets/sounds/resume.wav");
    }

    unloadScene(){
        this.resourceManager.keepSpritesheet("player");
        this.resourceManager.keepSpritesheet("shark");
        this.resourceManager.keepSpritesheet("mine");
        this.resourceManager.keepAudio("player_death");
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 81*256, 10*256);

        this.playerSpawn = new Vec2(2*128, 4*128);

        // Set the total switches and balloons in the level
        this.totalMines = 1;
        this.totalSwitches = 4;
        this.totalFallingSpikes = 0;

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

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        if(Input.isKeyPressed("1")){
            this.sceneManager.changeToScene(Level1, {}, this.sceneOptions);
        }
        if(Input.isKeyPressed("2")){
            this.sceneManager.changeToScene(Level2, {}, this.sceneOptions);
        }
        if(Input.isKeyPressed("3")){
            this.sceneManager.changeToScene(Level3, {}, this.sceneOptions);
        }
        if(Input.isKeyPressed("4")){
            this.sceneManager.changeToScene(Level4, {}, this.sceneOptions);
        }
        if(Input.isKeyPressed("5")){
            this.sceneManager.changeToScene(Level5, {}, this.sceneOptions);
        }
        if(Input.isKeyPressed("6")){
            this.sceneManager.changeToScene(BossLevel, {}, this.sceneOptions);
        }
    }
}