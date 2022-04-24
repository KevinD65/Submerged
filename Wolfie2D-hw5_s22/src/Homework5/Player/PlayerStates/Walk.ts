import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { HW5_Events } from "../../hw5_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		if(this.owner.inWater)
			this.owner.animation.play("swim_right",true);
		else
			this.owner.animation.play("walk_right", true);
	}

	updateSuit() {
	}

	update(deltaT: number): void {
		super.update(deltaT);
		let dir = this.getInputDirection();

		if(!this.owner.inWater){ ///land level
			console.log("LAND GRAVITY WHILE WALKING: " + this.parent.velocity.y);
			this.parent.velocity.x = dir.x * 500;
			this.owner.move(this.parent.velocity.scaled(deltaT));
			if(Input.isJustPressed("jump") && this.owner.onGround){
				this.finished("jump");
			}
			if(dir.isZero()){
				console.log("DONE WALK NOW IDLE");
				this.finished(PlayerStates.IDLE);
			}
		}
		else{ //water level
			console.log("WATER GRAVITY WHILE WALKING: " + this.parent.velocity.y);
			this.parent.velocity.x = dir.x * 500;
			let isJumping = false;
			if(Input.isJustPressed("jump")){
				this.parent.velocity.y = -600;
				isJumping = true;
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
			}
			this.owner.move(this.parent.velocity.scaled(deltaT));
			if(dir.isZero() && !isJumping){
				this.finished(PlayerStates.IDLE);
			}
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}