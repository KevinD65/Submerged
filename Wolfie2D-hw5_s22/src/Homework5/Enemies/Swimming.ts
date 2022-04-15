import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SharkState from "./SharkState";

export default class Swimming extends SharkState {
	
	onEnter(): void {
        this.gravity = 0;
        this.owner.disablePhysics();
		(<AnimatedSprite>this.owner).animation.play("chomping", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

        this.owner.position.x = this.owner.position.x+5;
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}