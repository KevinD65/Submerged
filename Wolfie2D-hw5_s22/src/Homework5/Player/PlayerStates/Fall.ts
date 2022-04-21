import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
        if(this.owner.inWater)
		    this.owner.animation.play("swim_down",true);
        else
            this.owner.animation.play("idle", true);
	}

    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}