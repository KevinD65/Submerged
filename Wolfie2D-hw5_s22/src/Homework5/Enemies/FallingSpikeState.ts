import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import SharkController, { SharkStates } from "./SharkController";

export default abstract class SharkState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: SharkController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	/**
	 * Here is where the states are defined for handling Shark gravity effects. We recieve a player suit change event 
	 * and adjust the Shark gravity effects accordingly based on its color
	 */
	handleInput(event: GameEvent): void {
		
	}

	update(deltaT: number): void {
		
	}
}