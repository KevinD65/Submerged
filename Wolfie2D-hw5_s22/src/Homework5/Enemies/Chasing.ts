import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SharkState from "./SharkState";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Chasing extends SharkState {
	
	onEnter(): void {
		//(<AnimatedSprite>this.owner).animation.play("chomping", true);
        this.gravity = 1000;
        this.parent.velocity.x = 250;
        this.owner.enablePhysics();
	}

	update(deltaT: number): void {
		super.update(deltaT);
        if(this.playerPos != null)
        {
            let playerX = this.playerPos.x;
            let sharkX = this.owner.position.x;
            let lookDistance = 6*128;
            if(Math.abs(sharkX-playerX) < lookDistance)
            {
                if(playerX < sharkX)
                {
                    this.parent.velocity.x = -this.maxVel;
                    console.log(this.parent.velocity.x);
                }
                else if(playerX > sharkX)
                {
                    this.parent.velocity.x = this.maxVel;
                }
                else
                {
                    this.parent.velocity.x = 0;
                }
            }
            else
            {
                
                let dirX = Math.random();
                if(dirX < 0.01)
                {
                    this.parent.velocity.x = -this.parent.velocity.x;
                }
            }
        }
        this.parent.velocity.y += this.gravity*deltaT;
        this.owner.move(this.parent.velocity.scaled(deltaT));
        (<Sprite>this.owner).invertX = this.parent.velocity.x>0;
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}