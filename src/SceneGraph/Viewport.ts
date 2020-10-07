import Vec2 from "../DataTypes/Vec2";
import Vec4 from "../DataTypes/Vec4";
import GameNode from "../Nodes/GameNode";
import CanvasNode from "../Nodes/CanvasNode";
import MathUtils from "../Utils/MathUtils";
import Queue from "../DataTypes/Queue";
import AABB from "../DataTypes/AABB";
import Debug from "../Debug/Debug";

export default class Viewport {
    private view: AABB;
	private boundary: AABB;
    private following: GameNode;

    /**
     * A queue of previous positions of what this viewport is following. Used for smoothing viewport movement
     */
    private lastPositions: Queue<Vec2>;

    /**
     * The number of previous positions this viewport tracks
     */
    private smoothingFactor: number;

    constructor(){
        this.view = new AABB(Vec2.ZERO, Vec2.ZERO);
        this.boundary = new AABB(Vec2.ZERO, Vec2.ZERO);
        this.lastPositions = new Queue();
        this.smoothingFactor = 10;
    }

    /**
     * Returns the position of the viewport as a Vec2
     */
    getCenter(): Vec2 {
        return this.view.getCenter();
    }

    getOrigin(): Vec2 {
        return this.view.getCenter().clone().sub(this.view.getHalfSize())
    }

    /**
     * Returns the region visible to this viewport
     */
    getView(): AABB {
        return this.view;
    }

    /**
     * Set the position of the viewport
     * @param vecOrX 
     * @param y 
     */
    setCenter(vecOrX: Vec2 | number, y: number = null): void {
        let pos: Vec2;
		if(vecOrX instanceof Vec2){
            pos = vecOrX;
        } else {
            pos = new Vec2(vecOrX, y);
        }

        this.lastPositions.clear();
        this.lastPositions.enqueue(pos);
    }

    /**
     * Returns the size of the viewport as a Vec2
     */
    getHalfSize(): Vec2 {
        return this.view.getHalfSize();
    }
    
    /**
     * Sets the size of the viewport
     * @param vecOrX 
     * @param y 
     */
    setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.view.setHalfSize(vecOrX.scaled(1/2));
		} else {
			this.view.setHalfSize(new Vec2(vecOrX/2, y/2));
		}
    }

    setHalfSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.view.setHalfSize(vecOrX.clone());
		} else {
			this.view.setHalfSize(new Vec2(vecOrX, y));
		}
    }

    /**
     * Sets the smoothing factor for the viewport movement.
     * @param smoothingFactor The smoothing factor for the viewport
     */
    setSmoothingFactor(smoothingFactor: number): void {
        if(smoothingFactor < 1) smoothingFactor = 1;
        this.smoothingFactor = smoothingFactor;
    }
    
    /**
     * Returns true if the CanvasNode is inside of the viewport
     * @param node 
     */
    includes(node: CanvasNode): boolean {
        let parallax = node.getLayer().getParallax();
        let center = this.view.getCenter().clone();
        this.view.getCenter().mult(parallax);
        let overlaps = this.view.overlaps(node.getBoundary());
        this.view.setCenter(center);
        return overlaps;
    }

	// TODO: Put some error handling on this for trying to make the bounds too small for the viewport
    // TODO: This should probably be done automatically, or should consider the aspect ratio or something
    /**
     * Sets the bounds of the viewport
     * @param lowerX 
     * @param lowerY 
     * @param upperX 
     * @param upperY 
     */
    setBounds(lowerX: number, lowerY: number, upperX: number, upperY: number): void {
        let hwidth = (upperX - lowerX)/2;
        let hheight = (upperY - lowerY)/2;
        let x = lowerX + hwidth;
        let y = lowerY + hheight;
        this.boundary.setCenter(new Vec2(x, y));
        this.boundary.setHalfSize(new Vec2(hwidth, hheight));
    }

    /**
     * Make the viewport follow the specified GameNode
     * @param node The GameNode to follow
     */
    follow(node: GameNode): void {
        this.following = node;
    }

    update(deltaT: number): void {
        // If viewport is following an object
        if(this.following){
            // Update our list of previous positions
            this.lastPositions.enqueue(this.following.getPosition().clone());
            if(this.lastPositions.getSize() > this.smoothingFactor){
                this.lastPositions.dequeue();
            }
            
            // Get the average of the last 10 positions
            let pos = Vec2.ZERO;
            this.lastPositions.forEach(position => pos.add(position));
            pos.scale(1/this.lastPositions.getSize());

            // Set this position either to the object or to its bounds
            pos.x = MathUtils.clamp(pos.x, this.boundary.left + this.view.hw, this.boundary.right - this.view.hw);
            pos.y = MathUtils.clamp(pos.y, this.boundary.top + this.view.hh, this.boundary.bottom - this.view.hh);

            this.view.setCenter(pos);
        } else {
            if(this.lastPositions.getSize() > this.smoothingFactor){
                this.lastPositions.dequeue();
            }

            let pos = Vec2.ZERO;
            this.lastPositions.forEach(position => pos.add(position));
            pos.scale(1/this.lastPositions.getSize());
            
            // Set this position either to the object or to its bounds
            pos.x = MathUtils.clamp(pos.x, this.boundary.left + this.view.hw, this.boundary.right - this.view.hw);
            pos.y = MathUtils.clamp(pos.y, this.boundary.top + this.view.hh, this.boundary.bottom - this.view.hh);

            this.view.setCenter(pos);
        }
    }
}