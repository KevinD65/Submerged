import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    damageCooldown: number = -1;

    // HOMEWORK 5 - TODO
    /**
     * Implement a death animation for the player using tweens. The animation rotate the player around itself multiple times
     * over the tween duration, as well as fading out the alpha value of the player. The tween should also make use of the
     * onEnd field to send out a PLAYER_KILLED event.
     * 
     * Tweens MUST be used to create this new animation, although you can add to the spritesheet if you want to add some more detail.
     * 
     * Look at incPlayerHealth() in GameLevel to see where this animation would be called.
     */
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        //this.suitColor = options.color;

        //this.receiver.subscribe(HW5_Events.SUIT_COLOR_CHANGE);

        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    // HOMEWORK 5 - THIS IS WHERE WE WILL IMPLEMENT TAKING DAMAGE ON THE BACKGROUND SPIKES
    /**
     * We want to detect when our player is moving over one of the switches in the world, and along with the sound
     * and label changes, we also visually want to change the tile.
     * 
     * You'll have to figure out when the player is over a tile, and then change that tile to the ON tile that you see in
     * tileset.png in tilemaps. You also need to send the PLAYER_HIT_SWITCH event so elements can be handled in GameLevel.ts
     * 
     * Make use of the tilemap field in the PlayerController and the methods at it's disposal.
     * 
     */
    update(deltaT: number): void {
		super.update(deltaT);
        let checkForSpikes = this.owner.position; //get player world position
        //console.log(checkForSpikes);
        let checkSpikesAbove = this.tilemap.getColRowAt(new Vec2(checkForSpikes.x, checkForSpikes.y - 25));
        let checkSpikesBelow = this.tilemap.getColRowAt(new Vec2(checkForSpikes.x, checkForSpikes.y + 25));
        let checkSpikesInFront = this.tilemap.getColRowAt(new Vec2(checkForSpikes.x + 1, checkForSpikes.y));
        let checkSpikesBehind = this.tilemap.getColRowAt(new Vec2(checkForSpikes.x - 1, checkForSpikes.y));
        
        let tileAbove = this.tilemap.getTileAtRowCol(new Vec2(checkSpikesAbove.x, checkSpikesAbove.y));
        let tileBelow = this.tilemap.getTileAtRowCol(new Vec2(checkSpikesBelow.x, checkSpikesBelow.y));
        let tileAhead = this.tilemap.getTileAtRowCol(new Vec2(checkSpikesInFront.x, checkSpikesInFront.y));
        let tileBehind = this.tilemap.getTileAtRowCol(new Vec2(checkSpikesBehind.x, checkSpikesBehind.y));

        //CHECK IF THE PLAYER IS IN CONTACT WITH A SPIKED TILE
        //console.log(tileAbove);
        console.log(tileBelow);
        if(tileAbove == 1 || tileAbove == 2 || tileAbove == 3 || tileAbove == 6 || tileAbove == 7 || tileAbove == 15 || tileAbove == 17 || tileAbove == 18){
            if(this.damageCooldown == -1 || this.damageCooldown == 0){
                this.damageCooldown = 30;
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SPIKES);
            }
            else{
                this.damageCooldown -= 1;
            }

        } 
        else if(tileBelow == 4 || tileBelow == 5 || tileBelow == 8 || tileBelow == 9 || tileBelow == 10 || tileBelow == 11 /*|| tileBelow == 26*/ || tileBelow == 27){
            if(this.damageCooldown == -1 || this.damageCooldown == 0){
                this.damageCooldown = 30;
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SPIKES);
            }
            else{
                this.damageCooldown -= 1;
            }
        }
        else if(tileAhead == 1 || tileAhead == 2 || tileAhead == 3 || tileAhead == 4 || tileAhead == 6 || tileAhead == 7 || tileAhead == 8 || tileAhead == 9 || tileAhead == 10 
            || tileAhead == 11 || tileAhead == 15 || tileAhead == 17 || tileAhead == 18 /*|| tileAhead == 26*/ || tileAhead == 27){
            if(this.damageCooldown == -1 || this.damageCooldown == 0){
                this.damageCooldown = 30;
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SPIKES);
            }
            else{
                this.damageCooldown -= 1;
            }
        }
        else if(tileBehind == 1 || tileBehind == 2 || tileBehind == 3 || tileBehind == 4 || tileBehind == 5 || tileBehind == 6 || tileBehind == 7 || tileBehind == 8 
            || tileBehind == 9 || tileBehind == 10 || tileBehind == 11 || tileBehind == 15 || tileBehind == 17 || tileBehind == 18 || tileBehind == 26 || tileBehind == 27){
            if(this.damageCooldown == -1 || this.damageCooldown == 0){
                this.damageCooldown = 30;
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SPIKES);
            }
            else{
                this.damageCooldown -= 1;
            }
        }
        else if(tileBelow == 28){ //FALLING SPIKE TRIGGER
            //MIGHT NEED COOLDOWN TIMER
            console.log("TRIGGER HIT WITH ID OF: " + (this.tilemap.getColRowAt(this.owner.position)).x);
            this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH, {TriggerXLocation: (this.tilemap.getColRowAt(this.owner.position)).x});
        }

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
	}
}