import {hexToRGBA, random} from "../utils.js";
import {ArcPiece} from "./arcPiece.js";

export class DropArc {
    constructor(centerY, centerX, canvasElement, arcColor, radius, gapAngle, arcThickness, angle, piecesAmount) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.canvasElement = canvasElement;
        this.arcColor = arcColor;
        this.radius = radius;
        this.gapAngle = gapAngle;
        this.arcThickness = arcThickness;
        this.angle = angle;
        this.piecesAmount = piecesAmount;

        this.pieces = [];

        this.piecesAmount *= (2 * Math.PI - this.gapAngle) / (2 * Math.PI);

        let currAngle = this.angle + this.gapAngle;
        const angleDelta =  (2 * Math.PI - gapAngle) / this.piecesAmount;
        for (let i = 0; i < this.piecesAmount; i++) {
            const x = this.centerX + this.radius * Math.cos(currAngle);
            const y = this.centerY + this.radius * Math.sin(currAngle);

            const arcPiece = new ArcPiece(y, x, this.canvasElement, this.arcColor, this.arcThickness / 2 + random(-5, 5));
            this.pieces.push(arcPiece);

            currAngle += angleDelta;
        }
    }

    draw(ctx) {
        for (const arcPiece of this.pieces) {
            arcPiece.draw(ctx);
        }

        this.pieces = this.pieces.filter(arcPiece => arcPiece.isInBounds());
        //console.log(this.pieces.length);
    }

    isInBounds() {
        return this.pieces.length !== 0;
    }
}