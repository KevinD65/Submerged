import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import FallingSpikeState from "./FallingSpikeState";

export default class Falling extends FallingSpikeState {
	
	onEnter(): void {
        console.log("FALLINGSPIKE");

		(<AnimatedSprite>this.owner).animation.play("idle", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
        this.parent.velocity.y = 1000;
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}