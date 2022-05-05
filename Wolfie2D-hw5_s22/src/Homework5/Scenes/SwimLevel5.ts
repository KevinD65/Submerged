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
import BossLevel from "./BossLevel";

export default class Level5 extends GameLevel {
     loadScene(): void {
        // Load resources
        this.load.tilemap("level5", "hw5_assets/tilemaps/SubmergedMap5.tmj");
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
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
    }

    startScene(): void {
        // Add the level 5 tilemap
        this.add.tilemap("level5", new Vec2(0.5, 0.5));
        this.viewport.setBounds(0, 0, 173*256, 19*256);

        this.playerSpawn = new Vec2(3*256, 3*256);

        this.totalFallingSpikes = 0;

        this.waterLevel = true;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(157, 6), new Vec2(4, 7));

        this.nextLevel = BossLevel;

        for(let pos of [new Vec2(65, 10), new Vec2(66, 6), new Vec2(70, 12), new Vec2(70, 12), new Vec2(75, 9), new Vec2(78, 12), new Vec2(82, 7), new Vec2(87, 13), new Vec2(88, 5), new Vec2(90, 9)]){
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