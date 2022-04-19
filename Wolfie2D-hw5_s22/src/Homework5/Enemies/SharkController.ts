import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { HW5_Events } from "../hw5_enums";
import { HW5_Color } from "../hw5_color";
import Swimming from './Swimming';
import Chasing from "./Chasing";

export enum SharkStates {
	SWIMMING = "swimming",
	CHASING = "chasing"
}

export default class SharkController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 100;
	ySpeed: number = 700;
	gravity: number = 1000;
	inWater: boolean = false;
	tilemap: OrthogonalTilemap;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		let swimming = new Swimming(this, owner);
		this.addState(SharkStates.SWIMMING, swimming);
		let chasing = new Chasing(this,owner);
		this.addState(SharkStates.CHASING, chasing);
		this.inWater = options.inWater;
		this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
		if(this.inWater)
		{
			this.initialize(SharkStates.SWIMMING);
		}
		else
		{
			this.initialize(SharkStates.CHASING);
		}
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(!this.inWater)
		{
			let pos = this.owner.position;
			if(this.tilemap.getTileAtWorldPosition(new Vec2(pos.x,pos.y+25)) != 0)
			{
				if(this.velocity.x > 0)
				{
					if(this.tilemap.getTileAtWorldPosition(new Vec2(pos.x+25,pos.y)) != 0)
					{
						this.velocity.y = -600;
					}
				}
				else if(this.velocity.x < 0)
				{
					if(this.tilemap.getTileAtWorldPosition(new Vec2(pos.x-25,pos.y)) != 0)
					{
						this.velocity.y = -600;
					}
				}
			}
		}
	}
}