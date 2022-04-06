import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import MineController, { MineStates } from "./MineController";

export default abstract class MineState extends State {
	owner: GameNode;
	gravity: number = 500;
	parent: MineController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	/**
	 * Here is where the states are defined for handling mine gravity effects. We recieve a player suit change event 
	 * and adjust the mine gravity effects accordingly based on its color
	 */
	handleInput(event: GameEvent): void {
		if (event.type == HW5_Events.SUIT_COLOR_CHANGE) {
			let new_color = event.data.get("color");
			if (this.parent.color == new_color){
				this.finished(MineStates.SINKING);
			}
			else {
				if (this.parent.color == HW5_Color.RED) {
					if (new_color == HW5_Color.BLUE) {
						this.finished(MineStates.ZEROGRAVITY);
					} else {
						this.finished(MineStates.RISING);
					}
				} else if (this.parent.color == HW5_Color.BLUE) {
					if (new_color == HW5_Color.RED) {
						this.finished(MineStates.ZEROGRAVITY);
					} else {
						this.finished(MineStates.RISING);
					}
				} else if (this.parent.color == HW5_Color.GREEN) {
					if (new_color == HW5_Color.RED) {
						this.finished(MineStates.RISING);
					} else {
						this.finished(MineStates.ZEROGRAVITY);
					}
				} 
			}
		}
	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity * deltaT;

		if (this.owner.onWall) {
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner)
				.invertX;
		}

		if (this.owner.onCeiling || this.owner.onGround) {
			if (this.gravity != 0) {
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * this.parent.ySpeed);
			}
			else{
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * MathUtils.clamp(Math.abs(this.parent.velocity.y), 0, this.parent.ySpeed));
			}
		}
	}
}
