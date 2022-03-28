import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		if (this.parent.suitColor == HW5_Color.RED){ 
			this.owner.animation.play("RED_FALL", true);
		}
		else if (this.parent.suitColor == HW5_Color.GREEN){
			this.owner.animation.play("GREEN_FALL", true);
		}
		else if (this.parent.suitColor == HW5_Color.BLUE){
			this.owner.animation.play("BLUE_FALL", true);
		}
	}

    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}