import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { HW5_Events } from "../../hw5_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
	}

	updateSuit() {
		//PLAY THE APPROPRIATE ANIMATIONS BASED ON VELOCITY
		/*
		if(this.parent.velocity.x > 0){
			this.owner.animation.play("swim_right", true);
		}*/
	}

	update(deltaT: number): void {
		super.update(deltaT);
		let dir = this.getInputDirection();

		if(!this.owner.inWater){
			if(dir.isZero()){
				this.finished(PlayerStates.IDLE);
			} else {
				if(Input.isPressed("run")){
					this.finished(PlayerStates.RUN);
				}
			}

			this.parent.velocity.x = dir.x * this.parent.speed;

			this.owner.move(this.parent.velocity.scaled(deltaT));
		}
		else{
			console.log("WALKING");
			this.parent.velocity.x = dir.x * 1000;
			//this.parent.velocity.y = this.parent.velocity;
			this.owner.move(this.parent.velocity.scaled(deltaT));
			this.finished(PlayerStates.IDLE);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}