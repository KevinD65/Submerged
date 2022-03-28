import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { HW5_Events } from "../../hw5_enums";
import PlayerController from "../PlayerController";


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: PlayerController;
	positionTimer: Timer;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
	}

	// Change the suit color on receiving a suit color change event
	handleInput(event: GameEvent): void {
		if (event.type == HW5_Events.SUIT_COLOR_CHANGE) {
			this.parent.suitColor = event.data.get("color");
		}
	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isJustPressed("jump") ? -1 : 0);
		return direction;
	}

	/**This function is left to be overrided by any of the classes that extend this base class. That way, each
	 * class can swap their animations accordingly.
	*/
	updateSuit() {
		
	}

	update(deltaT: number): void {
		// Do gravity
		this.updateSuit();
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(HW5_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		this.parent.velocity.y += this.gravity*deltaT;
	}
}