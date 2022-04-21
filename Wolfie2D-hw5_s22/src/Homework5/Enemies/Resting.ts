import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import FallingSpikeState from "./FallingSpikeState";

export default class Resting extends FallingSpikeState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
        this.parent.velocity.y = 0;
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}