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
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MineController from "../Enemies/MineController";
import SharkController from "../Enemies/SharkController";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import HW5_ParticleSystem from "../HW5_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";

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

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
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
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    // Boolean determining whether or not this is a water level
    protected waterLevel: boolean;

    startScene(): void {
        this.totalMines = 0;
        this.switchesPressed = 0;
        GameLevel.health = 3;

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
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case HW5_Events.PLAYER_HIT_SPIKES:
                    {
                        // If the player hit spikes, decrement the health and display the updated health
                        if(!GameLevel.playerBeenKilled){
                            this.player.animation.play("damage");
                            this.incPlayerHealth(-1);
                            this.healthLabel.text = "Health: " + GameLevel.health;
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switch", loop: false, holdReference: false}); //CHANGE THIS TO A SPIKE SOUND
                        }
                    }
                    break;

                case HW5_Events.PLAYER_HIT_MINE:
                    {
                        this.player.animation.play("damage");
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
                        //console.log("LEVEL END FIRED");
                        //console.log("LEVEL1: " + this.waterLevel);
                        //this.waterLevel = true;
                        //console.log("LEVEL2: " + this.waterLevel);

                        if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                            // The player has reached the end of the level
                            this.levelEndTimer.start();
                            this.levelEndLabel.tweens.play("slideIn");
                        }
                    }
                    break;

                case HW5_Events.UPDATE_GRAVITY:
                    {
                        //console.log("UPDATE_GRAVITY EVENT FIRED");
                        //console.log("LEVEL1: " + this.waterLevel);
                        //this.waterLevel = true;
                        //console.log("LEVEL2: " + this.waterLevel);
                        if(this.waterLevel == true) //WATER LEVEL
                        {
                            //console.log(event.data);
                            console.log(event.data.set("gravity", 7000));
                            //event.data.set("inWater", false)
                            console.log(event.data);
                            //this.gravity = 1;
                        }
                        else //LAND LEVEL
                        {
                            //event.data.set("inWater", false)
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
                                    groupNames: ["ground", "player", "mine"],
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

                case HW5_Events.PLAYER_KILLED:
                    {
                        if(!GameLevel.deathTimerFlag && this.levelEndTimer.isStopped()){ //we check if the levelEndTimer has run in case a player dies after reaching the level end
                            console.log("HOW MANY?");
                            this.player.animation.play("dying");
                            this.player.animation.play("dead");
                            GameLevel.deathTimerFlag = true;
                            this.deathTimer.start();
                        }
                        else if(!GameLevel.deathTimerFlag && (this.levelEndTimer.isStopped() && !this.levelEndTimer.hasRun())){
                            console.log("HOW MANY?");
                            this.player.animation.play("dying");
                            this.player.animation.play("dead");
                            GameLevel.deathTimerFlag = true;
                            this.deathTimer.start();
                        }
                    }
            }
        }

        this.handleSharkPlayerCollision(this.player,this.shark);

        if(this.deathTimer.isStopped() && GameLevel.deathTimerFlag == true){
            GameLevel.deathTimerFlag = false;
            this.deathTimer.reset();
            GameLevel.playerBeenKilled = false;
            this.respawnPlayer();
        }
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 1);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        console.log(this.viewport.getCenter());
        console.log(this.viewport.getZoomLevel());
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
            HW5_Events.PLAYER_KILLED
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels

        this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 30), text: "Health: " + GameLevel.health});
        this.healthLabel.textColor = Color.BLACK;
        this.healthLabel.font = "PixelSimple";

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

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
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
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player.inWater = true;
        this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Background", color: HW5_Color.RED});

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    /**
     * Initializes the Shark
     */
     protected initShark(): void {
        // Add the player
        this.shark = this.add.animatedSprite("shark", "primary");
        //this.player.scale.set(2, 2);
        let sharkSpawn = new Vec2(-6*128, 6*128);
        this.shark.position.copy(sharkSpawn);
        this.shark.addAI(SharkController, {});
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
        mine.addPhysics();
        mine.addAI(MineController, {});
        mine.setGroup("mine");
        mine.setTrigger("player", HW5_Events.PLAYER_HIT_MINE, null);
    }

    protected handleSharkPlayerCollision(player: AnimatedSprite, shark: AnimatedSprite)
    {
        if(player.position.x<(shark.position.x+shark.size.x/4))
        {
            this.emitter.fireEvent(HW5_Events.PLAYER_KILLED, {});
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
            //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mine_explosion", loop: false});
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

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerHealth(amt: number): void {
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

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        Input.enableInput();
        this.system.stopSystem();
        this.sceneManager.changeToScene(MainMenu, {isGameOver: true});
    }
}