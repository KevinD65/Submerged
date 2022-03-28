import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { HW5_Events } from "../hw5_enums";
import Sinking from "./Sinking";
import Rising from "./Rising";
import ZeroGravity from "./ZeroGravity";
import { HW5_Color } from "../hw5_color";

export enum BalloonStates {
	SINKING = "sinking",
	RISING = "rising",
	ZEROGRAVITY = "zero_gravity",
}

export default class BalloonController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 100;
	ySpeed: number = 700;
	gravity: number = 1000;
	color: HW5_Color;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(HW5_Events.PLAYER_MOVE);
		this.receiver.subscribe(HW5_Events.SUIT_COLOR_CHANGE);

		let sinking = new Sinking(this, owner);
		this.addState(BalloonStates.SINKING, sinking);
		let rising = new Rising(this, owner);
		this.addState(BalloonStates.RISING, rising);
		let zerogravity = new ZeroGravity(this, owner);
		this.addState(BalloonStates.ZEROGRAVITY, zerogravity);

		this.color = options.color;
		this.direction = new Vec2(-1, 0);

		this.initialize(BalloonStates.SINKING);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}