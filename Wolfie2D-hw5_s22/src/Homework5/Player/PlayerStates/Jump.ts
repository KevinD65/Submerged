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
		if(this.parent.velocity.x == 0)
		{
			this.owner.animation.play("swim_up", true);
		}
		else{
			this.owner.animation.play("swim_right", true);
		}
	}

	updateSuit() {
		
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		//console.log("WHERE?");
		// If we're falling (in land level), go to the fall state
		if(this.parent.velocity.y >= 0 && !this.owner.inWater){
			//console.log("FALLING");
			this.finished(PlayerStates.FALL);
		}
		else{
			//console.log("SWIMMING UP");
			this.parent.velocity.y = -600;
			this.owner.move(this.parent.velocity.scaled(deltaT));
			if(this.parent.velocity.x == 0)
			{
				this.finished(PlayerStates.IDLE);
			}
			else
			{
				this.finished(PlayerStates.WALK);
			}
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}