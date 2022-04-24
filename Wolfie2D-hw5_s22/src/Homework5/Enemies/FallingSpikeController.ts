import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
//import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Falling from "./Falling";
import Resting from "./Resting";
import { HW5_Events } from "../hw5_enums";
import { HW5_Color } from "../hw5_color";

export enum FallingSpikeStates {
	RESTING = "resting",
    FALLING = "falling"
}

export default class FallingSpikeController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 0;
	ySpeed: number = 700;
	gravity: number = 1000;
	color: HW5_Color;
    ID: number;
	//tilemap: OrthogonalTilemap;
	originalY: number;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;
		//this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

		//this.receiver.subscribe(HW5_Events.PLAYER_MOVE);
		this.receiver.subscribe(HW5_Events.SPIKES_FALL);

		let resting = new Resting(this, owner);
		this.addState(FallingSpikeStates.RESTING, resting);
		let falling = new Falling(this, owner);
		this.addState(FallingSpikeStates.FALLING, falling);

        this.ID = options.SpikeID;
		this.color = options.color;
		console.log("SPIKE POSITION: " + this.owner.position);
		//let mapPosition = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y)); //svae the original y position for respawning
		this.originalY = this.owner.position.y;
		console.log("ORIGINAL Y OF SPIKE: " + this.originalY);
		this.direction = new Vec2(-1, 0);

		this.initialize(FallingSpikeStates.RESTING);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}