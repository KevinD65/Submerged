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

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
		this.respawnTimer = new Timer(3000);
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
		/*
		if(this.respawnTimer.isStopped() && this.respawnTimer.hasRun()){
			console.log("ARE WE EVEN DETECTING THIS AND IF SO WHY IS THIS HAPPENING???");
			this.respawnTimer.reset();
			//this.owner.position.y = this.parent.originalY;
			this.parent.velocity.y = (this.owner.position.y - this.parent.originalY) * -1;
			this.owner.move(this.parent.velocity.scaled(deltaT));
			this.finished(FallingSpikeStates.RESTING);
		}
		if(this.owner.onGround && (!this.respawnTimer.isStopped() && !this.respawnTimer.hasRun())){ //IF THE SPIKE HITS THE GROUND
			//(<AnimatedSprite>this.owner).animation.play("breaking");
			this.respawnTimer.start();
		}*/
		if(this.owner.onGround){ //IF THE SPIKE HITS THE GROUND
			this.finished(FallingSpikeStates.RESTING);
			this.owner.position = new Vec2(this.owner.position.x, this.parent.originalY);
		}
	}
}