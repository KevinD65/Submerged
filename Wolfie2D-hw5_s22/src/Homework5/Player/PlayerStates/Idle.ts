import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Idle extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		if(this.owner.inWater)
		{
			this.owner.animation.play("swim_down");
		}
	}

	
	updateSuit() {
		/*if(this.parent.velocity.y > 0 && this.parent.velocity.x == 0){ //straight down
			this.owner.animation.playIfNotAlready("swim_down");
		}
		else if(this.parent.velocity.y < 0 && this.parent.velocity.x == 0){ //straight up
			this.owner.animation.playIfNotAlready("swim_up");
		}
		else if(this.parent.velocity.x > 0){ //swim right
			this.owner.animation.playIfNotAlready("swim_right",true);
		}
		else if(this.parent.velocity.x < 0){ //swim left
			this.owner.animation.playIfNotAlready("swim_right",true);
		}
		else{
			this.owner.animation.play("idle");
		}

		
		if (this.parent.suitColor == HW5_Color.RED){ 
			this.owner.animation.playIfNotAlready("RED_IDLE", true);
		}
		else if (this.parent.suitColor == HW5_Color.GREEN){
			this.owner.animation.playIfNotAlready("GREEN_IDLE", true);
		}
		else if (this.parent.suitColor == HW5_Color.BLUE){
			this.owner.animation.playIfNotAlready("BLUE_IDLE", true);
		}*/
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(!this.owner.inWater){ //IF WE ARE IN A LAND LEVEL...
			if(!dir.isZero() && dir.y === 0){
				if(Input.isPressed("run")){
					this.finished(PlayerStates.RUN);
				} else {
					this.finished(PlayerStates.WALK);
				}
			}
			
			this.parent.velocity.x = 0;

			this.owner.move(this.parent.velocity.scaled(deltaT));
		}
		else{ //IF WE ARE IN A WATER LEVEL...
			if(!dir.isZero() && dir.y === 0){ //MOVING ACROSS THE WATER FLOOR
				if(Input.isPressed("run")){
					this.finished(PlayerStates.RUN);
				} else {
					this.finished(PlayerStates.WALK);
				}
			}
			else if(Input.isJustPressed("jump")){
				console.log("TRANBADNWOJKNDW");
				//this.parent.velocity.y = -1500;
				this.finished("jump");
			}
			else{
				console.log("IDLE");
				this.parent.velocity.x = dir.x * this.parent.speed;
				this.parent.velocity.y = 250;
				this.owner.move(this.parent.velocity.scaled(deltaT));
			}
			
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}