import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MineController from "../Enemies/MineController";
import FallingSpikeController from "../Enemies/FallingSpikeController";
import SharkController from "../Enemies/SharkController";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import HW5_ParticleSystem from "../HW5_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import Level1 from "./SwimLevel1";
import Level2 from "./SwimLevel2";
import Level3 from "./SwimLevel3";
import Level4 from "./SwimLevel4";
import Level5 from "./SwimLevel5";
//import BossLevel from "./BossLevel";

// HOMEWORK 5 - TODO
/**
 * Add in some level music.
 * 
 * This can be done here in the base GameLevel class, or in Level1 and Level2,
 * it's up to you.
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected shark: AnimatedSprite;
    protected respawnTimer: Timer;
    protected static playerBeenKilled: boolean = false;

    // Labels for the UI
    protected static health: number = 3;
    protected healthLabel: Label;
    protected sharkLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    protected levelEndReached: boolean;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: HW5_ParticleSystem;

    // Cooldown timer for changing suits
    protected deathTimer: Timer;
    protected static deathTimerFlag: boolean = false;

    protected totalMines: number;

    // Total switches and amount currently pressed
    protected totalFallingSpikes: number;
    protected fallingSpikeXPositions: Array<number>; //this holds the x positions of the falling spikes on the map from left to right
    protected triggerXPositions: Array<number>; //this is hardcoded for each land level and holds teh x positions of the triggers on the map with the order corresponding to the falling spikes they each control
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    // Boolean determining whether the player is invincible or not
    protected toggleInvincibility: boolean;

    // Boolean determining whether or not this is a water level
    protected waterLevel: boolean;

    //Paused boolean
    protected paused: boolean;

    //Screen layers
    protected gameLayer: Layer;
    protected uiLayer: Layer;
    protected pauseScreen: Layer;

    //Pause screen UI
    protected titleP: Label;
    protected buttonP1: Button;
    protected buttonP2: Button;

    //Shark land stats
    protected sharkCooldown: number;
    protected sharkHealth: number;
    protected sharkDying: boolean;

    protected spikeTriggered: boolean; //temporary workaround for glitch where shark dies from touching player (due to spikes being part of "player" group). To fix, make spikes their own trigger group

    startScene(): void {
        this.spikeTriggered = false;
        this.totalMines = 0;
        this.switchesPressed = 0;
        this.totalFallingSpikes = 0;
        this.fallingSpikeXPositions = [];
        GameLevel.health = 3;
        this.paused = false;
        this.levelEndReached = false;
        this.toggleInvincibility = false;

        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.initShark();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the timers
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.health === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // 5 second timer after a death
        this.deathTimer = new Timer(2000);

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();
        this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "gameplay", loop: true, holdReference: true});
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        if(!this.paused){
            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();
                
                switch(event.type){
                    case HW5_Events.PLAYER_HIT_SPIKES:
                        {
                            // If the player hit spikes, decrement the health and display the updated health
                            if(!GameLevel.playerBeenKilled){
                                this.incPlayerHealth(-1);
                                this.healthLabel.text = "Health: " + GameLevel.health;
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "damage", loop: false, holdReference: false}); //CHANGE THIS TO A SPIKE SOUND
                            }
                        }
                        break;

                    case HW5_Events.PLAYER_HIT_MINE:
                        {
                            let node = this.sceneGraph.getNode(event.data.get("node"));
                            let other = this.sceneGraph.getNode(event.data.get("other"));

                            if(node === this.player){
                                // Node is player, other is mine
                                this.handlePlayerMineCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                            } else {
                                // Other is player, node is mine
                                this.handlePlayerMineCollision(<AnimatedSprite>other,<AnimatedSprite>node);

                            }
                        }
                        break;

                    case HW5_Events.MINE_EXPLODED:
                        {
                            this.totalMines = this.totalMines - 1;
                            let node = this.sceneGraph.getNode(event.data.get("owner"));
                            
                            // Set mass based on color
                            let particleMass = 0;
                            if ((<MineController>node._ai).color == HW5_Color.RED) {
                                particleMass = 1;
                            }
                            else if ((<MineController>node._ai).color == HW5_Color.GREEN) {
                                particleMass = 2;
                            }
                            else {
                                particleMass = 3;
                            }
                            this.system.startSystem(2000, particleMass, node.position.clone());
                            node.destroy();
                        }
                        break;
                        
                    case HW5_Events.PLAYER_ENTERED_LEVEL_END:
                        {
                            this.levelEndReached = true;
                            if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "levelComplete", loop: false, holdReference: false});
                                this.levelEndTimer.start();
                                this.levelEndLabel.tweens.play("slideIn");
                            }
                        }
                        break;

                    case HW5_Events.PLAYER_HIT_SWITCH:
                        {
                            //obtain the x position of the switch that was hit as event data
                            this.spikeTriggered = true;
                            let triggerXLocation = event.data.get("TriggerXLocation");
                            //console.log("BEBEEBEBE " + triggerXLocation);
                            let correspondingIndex = -1;
                            for(let t = 0; t < this.triggerXPositions.length; t++){
                                if(this.triggerXPositions[t] == triggerXLocation){
                                    correspondingIndex = t;
                                }
                            }
                            //console.log("CORRESPONDNG INDEX " + correspondingIndex);
                            let fallingSpikeID = this.fallingSpikeXPositions[correspondingIndex];
                            //console.log("SPIKE TO FALL HAS ID OF: " + fallingSpikeID);
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "spikeFalling", loop: false, holdReference: false});
                            this.emitter.fireEvent(HW5_Events.SPIKES_FALL, {SpikeID: fallingSpikeID});
                        }
                        break;
                    
                    case HW5_Events.SHARK_HIT_PLAYER:
                        {
                            if(this.sharkCooldown == 0)
                            {
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "sharkAttack", loop: false, holdReference: false});
                                this.player.animation.play("damage");
                                this.incPlayerHealth(-1);
                                this.sharkCooldown = 250;
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "damage", loop: false, holdReference: false});
                            }
                        }
                        break;

                    case HW5_Events.SPIKE_HIT_SHARK:
                        {
                            if(this.spikeTriggered){
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "sharkHurt", loop: false, holdReference: false});
                                this.incSharkHealth(-1);
                                this.spikeTriggered = false;
                            }
                        }
                        break;

                    case HW5_Events.LEVEL_START:
                        {
                            // Re-enable controls
                            Input.enableInput();
                        }
                        break;
                    
                    case HW5_Events.LEVEL_END:
                        {
                            // Go to the next level
                            if(this.nextLevel){
                                let sceneOptions = {
                                    physics: {
                                        groupNames: ["ground", "player", "mine"/*, "shark", "stalactite"*/],
                                        collisions:
                                        [
                                            [0, 1, 1],
                                            [1, 0, 0],
                                            [1, 0, 0]
                                        ]
                                    }
                                }
                                this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                            }
                        }
                        break;

                    case HW5_Events.SHARK_DEAD:
                        {
                            this.gameWon();
                        }
                        break;

                    case HW5_Events.PLAYER_KILLED:
                        {
                            if(!GameLevel.deathTimerFlag && this.levelEndTimer.isStopped()){ //we check if the levelEndTimer has run in case a player dies after reaching the level end
                                console.log("HOW MANY?");
                                this.player.animation.play("dying");
                                this.player.animation.play("dead");
                                GameLevel.deathTimerFlag = true;
                                this.deathTimer.start();
                            }
                        }
                }
            }

            this.checkSharkPlayerInteraction(this.player,this.shark);

            if(this.deathTimer.isStopped() && GameLevel.deathTimerFlag == true){
                this.player.animation.play("dead", true);
                GameLevel.deathTimerFlag = false;
                this.deathTimer.reset();
                GameLevel.playerBeenKilled = false;
                this.respawnPlayer();
            }

            if(this.sharkHealth == 0 && !this.waterLevel && !this.sharkDying)
            {
                this.sharkDying = true;
                this.emitter.fireEvent(HW5_Events.SHARK_KILLED);
            }

            if(Input.isKeyPressed("q"))
            {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pause", loop: false, holdReference: false});
                this.pauseGame();
                this.paused = true;
            }
            if(Input.isKeyPressed("i")){
                if(this.toggleInvincibility){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "invincibilityOff", loop: false, holdReference: false});
                    this.toggleInvincibility = false;
                }
                else{
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "invincibilityOn", loop: false, holdReference: false});
                    this.toggleInvincibility = true;
                }
            }
        }
        else{
            if(Input.isKeyPressed("r")) //RESUME GAME
            {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "resume", loop: false, holdReference: false});
                this.unpauseGame();
                this.paused = false;
            }
        }    
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.uiLayer = this.addUILayer("UI");

        // Add a layer for players and enemies
        this.gameLayer = this.addLayer("primary", 1);

        //Create pause screen
        this.pauseScreen = this.addLayer("pause",2);
        this.pauseScreen.setHidden(true);

        let posX = this.viewport.getCenter().x;
        let posY = this.viewport.getCenter().y;
        
        this.titleP = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(posX, posY - 200), text: "Paused"});
        this.titleP.textColor = Color.fromStringHex("BB0070");
        this.titleP.fontSize = 100;

        this.buttonP1 = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(posX, posY), text: "Resume"});
        this.buttonP1.backgroundColor = Color.fromStringHex("00BDF9");
        this.buttonP1.borderColor = Color.fromStringHex("00BDF9");
        this.buttonP1.borderRadius = 20;
        this.buttonP1.setPadding(new Vec2(50, 10));
        this.buttonP1.font = "PixelSimple";
        this.buttonP1.textColor = Color.fromStringHex("BB0070");

        this.buttonP2 = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(posX, posY + 200), text: "Back To Menu"});
        this.buttonP2.backgroundColor = Color.fromStringHex("00BDF9");
        this.buttonP2.borderColor = Color.fromStringHex("00BDF9");
        this.buttonP2.borderRadius = 20;
        this.buttonP2.setPadding(new Vec2(50, 10));
        this.buttonP2.font = "PixelSimple";
        this.buttonP2.textColor = Color.fromStringHex("BB0070");

        this.buttonP1.onClick = () => {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "resume", loop: false, holdReference: false});
            this.unpauseGame();
            this.paused = false;
        }

        this.buttonP2.onClick = () => {
            this.exitGame();
        }

    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(1);
        
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            HW5_Events.PLAYER_HIT_SWITCH,
            HW5_Events.PLAYER_HIT_SPIKES,
            HW5_Events.PLAYER_HIT_MINE,
            HW5_Events.MINE_EXPLODED,
            HW5_Events.PLAYER_ENTERED_LEVEL_END,
            HW5_Events.UPDATE_GRAVITY,
            HW5_Events.LEVEL_START,
            HW5_Events.LEVEL_END,
            HW5_Events.PLAYER_KILLED,
            HW5_Events.SHARK_HIT_PLAYER,
            HW5_Events.SPIKE_HIT_SHARK,
            HW5_Events.SHARK_DEAD
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels

        this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(150, 50), text: "Health: " + GameLevel.health});
        this.healthLabel.textColor = Color.fromStringHex("BB0070");
        this.healthLabel.fontSize = 75;
        this.healthLabel.font = "PixelSimple";
        this.healthLabel.backgroundColor = Color.fromStringHex("00BDF9");

        if(!this.waterLevel)
        {
            this.sharkLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(1750, 50), text: "Boss Health: " + this.sharkHealth});
            this.sharkLabel.textColor = Color.fromStringHex("00BDF9");
            this.sharkLabel.fontSize = 75;
            this.sharkLabel.font = "PixelSimple";
            this.sharkLabel.backgroundColor = Color.fromStringHex("BB0070");
        }

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-1000, 500), text: "Level Complete"});
        this.levelEndLabel.size.set(1800, 100);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -1000,
                    end: 1100,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        // Create our particle system and initialize the pool
        this.system = new HW5_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(5000, 2000)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW5_Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW5_Events.LEVEL_START
        });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        //this.player.scale.set(2, 2);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        if(this.waterLevel)
        {
            this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(48, 14)));
        }
        else
        {
            this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 48)));
        }

        //THIS DETERMINES WHETHER THE PLAYER IS IN WATER OR NOT (BASED ON THE ATTRIBUTE OF THE LEVEL) SO THAT PHYSICS CAN BE ADJUSTED PROPERLY
        if(this.waterLevel)
            this.player.inWater = true;
        else
            this.player.inWater = false;

        this.player.colliderOffset.set(0, 0);
        this.player.addAI(PlayerController, {waterLevel: this.waterLevel, playerType: "platformer", tilemap: "Background", color: HW5_Color.RED});

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    /**
     * Initializes the Shark
     */
     protected initShark(): void {
        if(this.waterLevel)
        {
            this.shark = this.add.animatedSprite("shark", "primary");
            //this.shark.setGroup("shark");
            let sharkSpawn = new Vec2(-12*128, 6*128);
            this.shark.position.copy(sharkSpawn);
        }
        else{
            this.shark = this.add.animatedSprite("shark", "primary");
            this.shark.addPhysics(new AABB(Vec2.ZERO, new Vec2(100, 100)));
            this.shark.setGroup("player");
            this.shark.colliderOffset.set(0, 0);
            let sharkSpawn = new Vec2(13*128, 9*128);;
            this.shark.position.copy(sharkSpawn);
            this.shark.setTrigger("player", HW5_Events.SHARK_HIT_PLAYER, null);
            this.sharkCooldown = 0;
            this.sharkHealth = 3;
            this.sharkDying = false;
        }
        this.shark.addAI(SharkController, {inWater: this.waterLevel, tilemap: "Background"});
    }

    /**
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.scale(128), size: size.scale(128)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", HW5_Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }

    /**
     * Adds a mine into the game
     * @param spriteKey The key of the mine sprite
     * @param tilePos The tilemap position to add the mine to
     * @param aiOptions The options for the mine AI
     */
    protected addMine(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let mine = this.add.animatedSprite(spriteKey, "primary");
        mine.position.set(tilePos.x*128, tilePos.y*128);
        mine.scale.set(1, 1);
        mine.addPhysics(new AABB(Vec2.ZERO, new Vec2(120, 120)));
        mine.addAI(MineController, {});
        mine.setGroup("mine");
        mine.setTrigger("player", HW5_Events.PLAYER_HIT_MINE, null);
    }

    /**
     * Adds a spike into the game
     * @param spriteKey The key of the spike sprite
     * @param tilePos The tilemap position to add the spike to
     * @param aiOptions The options for the spike AI
     */
     protected addSpike(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let spike = this.add.animatedSprite(spriteKey, "primary");
        spike.position.set(tilePos.x*128, tilePos.y*128);
        spike.scale.set(1, 1);
        spike.addPhysics(new AABB(Vec2.ZERO, new Vec2(60, 60)));
        spike.addAI(FallingSpikeController, {SpikeID: aiOptions.SpikeID, tilemap: "Background"});
        if(!this.waterLevel){
            spike.setTrigger("player", HW5_Events.SPIKE_HIT_SHARK, null);
        }
        //spike.setGroup("mine"); //add another collision group for spikes
        //spike.setTrigger("player", HW5_Events.PLAYER_HIT_SPIKES, null);
    }

    protected checkSharkPlayerInteraction(player: AnimatedSprite, shark: AnimatedSprite)
    {
        if(this.waterLevel){
            if(!this.levelEndReached){
                if(player.position.x<(shark.position.x+shark.size.x/2))
                {
                    this.respawnPlayer();
                }
            }
        }
        else
        {
            if(this.sharkCooldown > 0)
            {
                this.sharkCooldown -= 1;
            }
        }
    }

    /**
     * Handles player collisions with mines by firing the proper event
     * @param player The player which collided with the mine
     * @param mine The mine that the player collided with
     */
    protected handlePlayerMineCollision(player: AnimatedSprite, mine: AnimatedSprite) {
        if(player == undefined || mine == undefined){ //right after a mine explodes, another collision might be detected
            console.log("Not a collision");
        }
        else if(typeof player !== undefined && mine !== undefined && mine.active == true){
            mine.active = false
            console.log("EXPLODED");
            mine.animation.play("explode", false, HW5_Events.MINE_EXPLODED);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explosion", loop: false});
            this.incPlayerHealth(-2);
        }
    }

    /**
     * Adds a health kit into the game
     * @param spriteKey 
     * @param tilePos 
     * @param aiOptions 
     */
    protected addHealthKit(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void{

    }

    /**
     * Handles player collisions with health kits by firing the proper event
     * @param player 
     * @param mine 
     */
    protected handlePlayerHealthKitCollision(player: AnimatedSprite, mine: AnimatedSprite){

    }

    protected incSharkHealth(amt: number): void {
        this.sharkHealth += amt;
        this.sharkLabel.text = "Boss Health: " + this.sharkHealth;
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerHealth(amt: number): void {
        if(!this.toggleInvincibility){
            GameLevel.health += amt;
            this.healthLabel.text = "Health: " + GameLevel.health;
            if (GameLevel.health <= 0 && !GameLevel.playerBeenKilled){
                Input.disableInput();
                GameLevel.playerBeenKilled = true;
                this.player.disablePhysics();
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                this.emitter.fireEvent(HW5_Events.PLAYER_KILLED);
            }
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.system.stopSystem();
        this.sceneManager.changeToScene(MainMenu, {isGameOver: true,hasWon: false});
    }

    protected exitGame(): void{
        Input.enableInput();
        this.system.stopSystem();
        this.sceneManager.changeToScene(MainMenu, {isGameOver: false,hasWon: false});
    }

    protected gameWon(): void{
        Input.disableInput();
        this.player.disablePhysics();
        this.player.setAIActive(false,{});
        this.shark.setAIActive(false,{});
        this.sceneManager.changeToScene(MainMenu, {isGameOver: false,hasWon: true});
    }

    protected pauseGame(): void{
        this.player.disablePhysics();
        this.player.setAIActive(false,{});
        this.shark.setAIActive(false,{});
        this.pauseScreen.setHidden(false);
        this.uiLayer.setHidden(true);
        this.gameLayer.setHidden(true);
        this.viewport.follow(this.buttonP1);
    }

    protected unpauseGame(): void{
        this.player.enablePhysics();
        this.player.setAIActive(true,{});
        this.shark.setAIActive(true,{});
        this.pauseScreen.setHidden(true);
        this.uiLayer.setHidden(false);
        this.gameLayer.setHidden(false);
        this.viewport.follow(this.player);
    }
}