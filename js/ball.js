import {random} from "./utils.js";

export class Ball {
    constructor(y, x, ballRadius, deltaLimit, canvas, gravity, bounceFactor) {
        this.y = y;
        this.x = x;
        this.ballRadius = ballRadius;
        this.deltaLimit = deltaLimit;
        this.canvas = canvas;
        this.dx = random(-3, 3);
        this.dy = random(-3, 3);
        this.gravity = gravity;
        this.bounceFactor = bounceFactor;
    }

    move(arcs) {
        this.dy += this.gravity;

        if (this.x - this.ballRadius < 0 || this.x + this.ballRadius > this.canvas.width) {
            this.dx *= -this.bounceFactor;
            if(this.dx > this.deltaLimit){
                this.dx = this.deltaLimit;
            }
            this.x = Math.max(this.ballRadius, Math.min(this.canvas.width - this.ballRadius, this.x));
        }
        if (this.y - this.ballRadius < 0 || this.y + this.ballRadius > this.canvas.height) {
            this.dy *= -this.bounceFactor;
            if(this.dy > this.deltaLimit){
                this.dy = this.deltaLimit;
            }
            this.y = Math.max(this.ballRadius, Math.min(this.canvas.height - this.ballRadius, this.y));
        }

        for (let arc of arcs) {
            const contact = arc.hasCollisionInside(this.y + this.dy, this.x + this.dx, this.ballRadius);

            if (contact) {
                const totalDx = contact.x - arc.centerX;
                const totalDy = contact.y - arc.centerY;
                const dist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);

                //normal vector to 1
                const normalX = totalDx / dist;
                const normalY = totalDy / dist;

                //tangent
                const tangentX = -normalY;
                const tangentY = normalX;

                //speed projection
                const dotProductNormal = this.dx * normalX + this.dy * normalY;
                const dotProductTangent = this.dx * tangentX + this.dy * tangentY;

                //speed reverse
                let newDx = tangentX * dotProductTangent + normalX * -dotProductNormal;
                let newDy = tangentY * dotProductTangent + normalY * -dotProductNormal;

                const epsilon = 1.5;
                if (Math.abs(newDx + this.dx) < epsilon && Math.abs(newDy + this.dy) < epsilon) {
                    this.dx = tangentX * dotProductTangent;
                    this.dy = tangentY * dotProductTangent;


                    const angleDeviation = 15 * Math.PI / 180 * Math.sign(random(-1, 1));

                    const normalAngle = Math.atan2(normalY, normalX);

                    const newNormalAngle = normalAngle + angleDeviation;  // Поворот на 15 градусов

                    const newNormalX = Math.cos(newNormalAngle);
                    const newNormalY = Math.sin(newNormalAngle);

                    this.dx += newNormalX * -dotProductNormal;
                    this.dy += newNormalY * -dotProductNormal;

                    //console.log("random");
                } else {
                    this.dx = newDx;
                    this.dy = newDy;
                }

                //speed limit
                if (Math.abs(this.dx *= this.bounceFactor) > this.deltaLimit) {
                    this.dx = Math.sign(this.dx) * this.deltaLimit;
                } else {
                    this.dx *= this.bounceFactor;
                }

                if (Math.abs(this.dy *= this.bounceFactor) > this.deltaLimit) {
                    this.dy = Math.sign(this.dy) * this.deltaLimit;
                } else {
                    this.dy *= this.bounceFactor;
                }

                this.x = contact.x;
                this.y = contact.y;

                return;
            }
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
}