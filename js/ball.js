import {random} from "./utils.js";

export class Ball {
    constructor(y, x, ballRadius, deltaLimit, canvas, bounceFactor, massMultiplier) {
        this.deltaLimit = deltaLimit;
        this.canvas = canvas;
        this.dx = random(2.5, 3);
        this.dy = random(2.5, 3);
        this.bounceFactor = bounceFactor;
        this.massMultiplier = massMultiplier;
        this._y = y;
        this._x = x;
        this._ballRadius = ballRadius;
        this.gravity = 0;

        this.calculateGravity();
    }

    calculateGravity() {
        this.gravity = this.massMultiplier * this._ballRadius * this._ballRadius * Math.PI;
    }

    setRadius(radiusChange) {
        this.deltaLimit *= (1 + radiusChange / this._ballRadius / 4);
        this._ballRadius += radiusChange;
    }

    setRadiusAndNewGravity(radius) {
        this._ballRadius = radius;
        this.calculateGravity();
    }

    move(arcs) {
        if (this._x - this._ballRadius < 0 || this._x + this._ballRadius > this.canvas.width) {
            this.dx *= -this.bounceFactor;
            if(this.dx > this.deltaLimit){
                this.dx = this.deltaLimit;
            }
            this._x = Math.max(this._ballRadius, Math.min(this.canvas.width - this._ballRadius, this._x));
        }
        if (this._y - this._ballRadius < 0 || this._y + this._ballRadius > this.canvas.height) {
            this.dy *= -this.bounceFactor;
            if(this.dy > this.deltaLimit){
                this.dy = this.deltaLimit;
            }
            this._y = Math.max(this._ballRadius, Math.min(this.canvas.height - this._ballRadius, this._y));
        }

        for (let arc of arcs) {
            const contact = arc.hasCollisionInside(this._y + this.dy, this._x + this.dx, this._ballRadius);

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

                this._x = contact.x;
                this._y = contact.y;

                return;
            }
        }

        this.dy += this.gravity;

        this._x += this.dx;
        this._y += this.dy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this._x, this._y, this._ballRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    get y() {
        return this._y;
    }

    get x() {
        return this._x;
    }

    get ballRadius() {
        return this._ballRadius;
    }
}