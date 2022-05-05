import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import FallingSpikeController, { FallingSpikeStates } from "./FallingSpikeController";

export default abstract class FallingSpikeState extends State {
	owner: GameNode;
	parent: FallingSpikeController;
	respawnTimer: Timer;
	originalX: number;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
		this.respawnTimer = new Timer(5000);
	}

	handleInput(event: GameEvent): void {
		if(event.type == HW5_Events.SPIKES_FALL){
            let spikeID = event.data.get("SpikeID");
            console.log("HANDLING " + this.parent.ID + " WITH " + spikeID);
            if(this.parent.ID == spikeID){
                this.finished(FallingSpikeStates.FALLING);
			}
        }
	}

	update(deltaT: number): void {
		if(this.owner.onGround){ //IF THE SPIKE HITS THE GROUND
			if(!this.respawnTimer.hasRun()){
				this.respawnTimer.start();
				this.originalX = this.owner.position.x;
				this.owner.position = new Vec2(2000, 5000);
			}
		}
		else if(this.respawnTimer.hasRun()){
			console.log("RESPAWNED");
			this.finished(FallingSpikeStates.RESTING);
			this.owner.position = new Vec2(this.originalX, this.parent.originalY);
			this.respawnTimer.reset();
		}
	}
}