import {hexToRGBA} from "../utils.js";

export class ShadowBall {
    shadowColor;

    constructor(y, x, ballRadius, opacity, shadowColor) {
        this.y = y;
        this.x = x;
        this.ballRadius = ballRadius;
        this.opacity = opacity;
        this.shadowColor = shadowColor;
    }
d
    iterate() {
        this.opacity -= 0.03;
        if (this.opacity < 0) {
            this.opacity = 0;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRGBA(this.shadowColor, this.opacity);
        ctx.fill();
        ctx.closePath();
    }
}