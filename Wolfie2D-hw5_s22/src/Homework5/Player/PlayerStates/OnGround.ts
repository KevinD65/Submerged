import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		// If we jump, move to the Jump state, give a burst of upwards velocity, and play our flip tween animation if 
		// we're moving left or right
		if(Input.isJustPressed("jump")){
			this.finished("jump");
			if(this.owner.inWater){ //IF IN WATER LEVEL, MOVE UPWARDS SLOWER
				this.parent.velocity.y = -1000; //reduced upwards burst
				if(!this.owner.onGround){
					this.finished("fall");
				}
			}
			else{ //IF ON GROUND LEVEL, MOVE UPWARDS AND HAVE NORMAL ANIMATIONS
				if(this.parent.velocity.x !== 0){
					this.owner.tweens.play("flip");
				}
				this.parent.velocity.y = -1500;
				if(!this.owner.onGround){
					this.finished("fall");
				}
			}
			/*
			if(this.parent.velocity.x !== 0){
				this.owner.tweens.play("flip");
			}*/
		/*
		} else if(!this.owner.onGround){
			this.finished("fall");*/
		}
	}

	onExit(): Record<string, any> {
		return {};
	}
}