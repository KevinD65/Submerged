import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default abstract class InAir extends PlayerState {
    
    update(deltaT: number): void {
        super.update(deltaT);

        if(!this.owner.inWater){ //IF WE ARE FALLING DOWNWARDS IN THE AIR, LET THE DIVER FOLLOW NORMAL LAND PHYSICS
            let dir = this.getInputDirection();

            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

            this.owner.move(this.parent.velocity.scaled(deltaT));

            if(this.owner.onGround){
                this.finished(PlayerStates.PREVIOUS);
            }
        }
        else{ //IF WE ARE FALLING DOWNWARDS IN THE WATER, LET THE DIVER GO INTO AN IDLE STATE
            console.log("IN THE AIR");
            this.finished(PlayerStates.IDLE);
        }
    }
}