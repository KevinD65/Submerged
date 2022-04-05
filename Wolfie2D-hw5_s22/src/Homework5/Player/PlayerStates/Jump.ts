import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { HW5_Color } from "../../hw5_color";
import { HW5_Events } from "../../hw5_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	updateSuit() {
		this.owner.animation.play("swim_up", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		console.log("WHERE?");
		// If we're falling (in land level), go to the fall state
		if(this.parent.velocity.y >= 0 && !this.owner.inWater){
			console.log("FALLING");
			this.finished(PlayerStates.FALL);
		}
		else{
			console.log("SWIMMING UP");
			this.parent.velocity.y = -1000;
			this.owner.move(this.parent.velocity.scaled(deltaT));
			this.finished(PlayerStates.IDLE);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}