import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";
import Level1 from "./SwimLevel1";
import Level2 from "./SwimLevel2";
import Level3 from "./SwimLevel3";
import Level4 from "./SwimLevel4";
import Level5 from "./SwimLevel5";

export default class BossLevel extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("bossLevel", "hw5_assets/tilemaps/CaveBossLevel1.tmj");
        this.load.spritesheet("player", "hw5_assets/spritesheets/diver.json");
        this.load.spritesheet("shark", "hw5_assets/spritesheets/landshark.json");
        this.load.spritesheet("stalactite", "hw5_assets/spritesheets/stalactites.json")
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("switch", "hw5_assets/sounds/switch.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
        this.load.audio("level_music", "hw5_assets/music/gameplay.mp3");
        this.load.audio("damage","hw5_assets/sounds/dmg.wav");
        this.load.audio("invincibilityOn", "hw5_assets/sounds/invincibilityOn.wav");
        this.load.audio("invincibilityOff", "hw5_assets/sounds/invincibilityOff.wav");
        this.load.audio("pause", "hw5_assets/sounds/pause.wav");
        this.load.audio("resume", "hw5_assets/sounds/resume.wav");
        this.load.audio("spikeFalling", "hw5_assets/sounds/spikeFalling.wav");
        this.load.audio("sharkAttack", "hw5_assets/sounds/sharkAttack.wav");
        this.load.audio("sharkHurt", "hw5_assets/sounds/sharkHurt.wav");
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
    }

    startScene(): void {
        // Add the boss level tilemap
        this.add.tilemap("bossLevel", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 29*256, 13*256);

        this.playerSpawn = new Vec2(11*128, 9*128);

        // Set the total switches and balloons in the level
        this.totalMines = 1;
        this.totalSwitches = 4;
        this.totalFallingSpikes = 2;

        // Set this to a water level
        this.waterLevel = false;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(75, 5), new Vec2(5, 5));

        //this.nextLevel = gameComplete

        //COMMENT THIS FOR NOW! WILL REPURPOSE BALLOONS FOR MINES AND HEALTH KITS!!!!!!
        // Add balloons of various types, just red and blue for the first level

        this.triggerXPositions = [5, 22, 18];

        //IMPORTANT: WHEN ASSIGNING SPIKE IDS, ASSIGN BASED ON INCREASING X POSITION OF THE SPIKES ON THE MAP
        for(let pos of [new Vec2(8, 2), new Vec2(16, 2), new Vec2(19, 7)]){
            this.addSpike("stalactite", pos, {SpikeID: pos.x});
            this.fallingSpikeXPositions.push(pos.x);
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