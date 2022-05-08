import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SharkState from "./SharkState";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { HW5_Events } from "../hw5_enums";

export default class Chasing extends SharkState {
	
	onEnter(): void {
		//(<AnimatedSprite>this.owner).animation.play("chomping", true);
        this.gravity = 1000;
        this.parent.velocity.x = 250;
        this.owner.enablePhysics();
        (<AnimatedSprite>this.owner).animation.play("pursuing", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
        if(this.damaging)
        {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("damage",false,HW5_Events.SHARK_HEALTHY);
        }
        else if(this.dying)
        {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("dead",false,HW5_Events.SHARK_DEAD);
        }
        else
        {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("pursuing", true);
            if(this.playerPos != null)
            {
                let playerX = this.playerPos.x;
                let playerY = this.playerPos.y;
                let sharkX = this.owner.position.x;
                let sharkY = this.owner.position.y;
                let lookDistanceX = 10*128;
                let lookDistanceY = 6*128;
                let stopDistance = 64;
                if(Math.abs(sharkX-playerX) < lookDistanceX && (Math.abs(sharkY-playerY) < lookDistanceY || sharkY < playerY))
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
                        else if(Math.abs(sharkX-playerX) < stopDistance)
                        {
                            this.parent.velocity.x = 0;
                        }
                }
                else
                {
                    
                    let dirX = Math.random();
                    if(dirX < 0.01)
                    {
                        if(this.parent.velocity.x < 0)
                        {
                            this.parent.velocity.x = this.maxVel/2;
                        }
                        else
                        {
                            this.parent.velocity.x = -this.maxVel/2;
                        }
                    }
                }
            }
            (<Sprite>this.owner).invertX = this.parent.velocity.x<0;
        }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}