export class ShadowBall {
    constructor(y, x, ballRadius, opacity) {
        this.y = y;
        this.x = x;
        this.ballRadius = ballRadius;
        this.opacity = opacity;
    }

    iterate() {
        this.opacity -= 0.03;
        if (this.opacity < 0) {
            this.opacity = 0;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 220, 220, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }
}