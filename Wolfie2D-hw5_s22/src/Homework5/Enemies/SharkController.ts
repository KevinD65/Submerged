import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { HW5_Events } from "../hw5_enums";
import { HW5_Color } from "../hw5_color";
import Swimming from '../Enemies/Swimming';

export enum SharkStates {
	SWIMMING = "swimming",
}

export default class SharkController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 100;
	ySpeed: number = 700;
	gravity: number = 0;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		let swimming = new Swimming(this, owner);
		this.addState(SharkStates.SWIMMING, swimming);

		this.direction = new Vec2(1, 0);

		this.initialize(SharkStates.SWIMMING);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}