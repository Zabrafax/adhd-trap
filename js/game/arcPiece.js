import {hexToRGBA, random} from "../utils.js";

export class ArcPiece {
    constructor(centerY, centerX, canvasElement, pieceColor, size) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.canvasElement = canvasElement;
        this.pieceColor = pieceColor;
        this.size = size;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = hexToRGBA(this.pieceColor);
        ctx.moveTo(this.centerX, this.centerY - this.size);
        ctx.lineTo(this.centerX + this.size, this.centerY);
        ctx.lineTo(this.centerX, this.centerY + this.size);
        ctx.lineTo(this.centerX - this.size, this.centerY);
        ctx.fill();
        ctx.closePath();

        this.centerY += this.size + random(1, 10);
    }

    isInBounds() {
        return (
            this.centerY - this.size >= 0 &&
            this.centerY + this.size <= this.canvasElement.height &&
            this.centerX - this.size >= 0 &&
            this.centerX + this.size <= this.canvasElement.width
        );
    }
}