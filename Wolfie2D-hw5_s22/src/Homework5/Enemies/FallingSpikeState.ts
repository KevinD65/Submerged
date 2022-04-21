import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import FallingSpikeController, { FallingSpikeStates } from "./FallingSpikeController";

export default abstract class FallingSpikeState extends State {
	owner: GameNode;
	gravity: number = 0;
	parent: FallingSpikeController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if(event.type == HW5_Events.SPIKES_FALL){
            let spikeID = event.data.get("SpikeID");
            console.log("HANDLING " + this.parent.ID + " WITH " + spikeID);
            if(this.parent.ID == spikeID)
                this.finished(FallingSpikeStates.FALLING);
        }
	}

	update(deltaT: number): void {
		
	}
}