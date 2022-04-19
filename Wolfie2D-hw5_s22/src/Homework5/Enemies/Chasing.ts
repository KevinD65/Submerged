import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SharkState from "./SharkState";

export default class Chasing extends SharkState {
	
	onEnter(): void {
		//(<AnimatedSprite>this.owner).animation.play("chomping", true);
        this.gravity = 1000;
        this.parent.velocity.x = 250;
        this.owner.enablePhysics();
	}

	update(deltaT: number): void {
		super.update(deltaT);
        let dirX = Math.random();
        if(dirX < 0.01)
        {
            this.parent.velocity.x = -this.parent.velocity.x;
        }
        this.parent.velocity.y += this.gravity*deltaT;
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}