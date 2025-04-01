import {playSound, random} from "../utils.js";

export class Ball {
    bounceSound = "../../assets/sounds/xylophone-hit.mp3";

    constructor(y, x, ballRadius, deltaLimitFactor, canvas, bounceFactor, massMultiplier, ballBounceSound) {
        this.deltaLimitFactor = deltaLimitFactor;
        this.canvas = canvas;
        this.dx = random(-2, 2);
        this.dy = random(-2, 2);
        this.bounceFactor = bounceFactor;
        this.massMultiplier = massMultiplier;
        this._y = y;
        this._x = x;
        this._ballRadius = ballRadius;
        this.gravity = 0;
        this.deltaLimit = 0;
        this.ballBounceSound = ballBounceSound;

        this.calculateParam();
    }

    calculateParam() {
        this.gravity = this.massMultiplier * this._ballRadius * this._ballRadius * Math.PI;
        this.deltaLimit = this.deltaLimitFactor * this._ballRadius * this._ballRadius * Math.PI;
    }

    setRadius(radiusChange) {
        this.calculateParam();
        this._ballRadius += radiusChange;
    }

    setRadiusAndNewGravity(radius) {
        this._ballRadius = radius;
        this.calculateParam();
    }

    move(arcs) {
        //console.log(Math.hypot(this.dx, this.dy));
        //console.log(this.bounceFactor);
        //console.log(this.deltaLimit);
        this.dy += this.gravity;

        if (this._x - this._ballRadius < 0 || this._x + this._ballRadius > this.canvas.width) {
            this.dx *= -this.bounceFactor;
        }
        if (this._y - this._ballRadius < 0 || this._y + this._ballRadius > this.canvas.height) {
            this.dy *= -this.bounceFactor;
        }

        for (let arc of arcs) {
            const contact = arc.hasCollisionInside(this._y + this.dy, this._x + this.dx, this._ballRadius);

            if (contact) {
                if(this.ballBounceSound) playSound(this.bounceSound, 0.5);

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

                const epsilon = 6;
                if (Math.abs(newDx + this.dx) < epsilon && Math.abs(newDy + this.dy) < epsilon) {
                    this.dx = tangentX * dotProductTangent;
                    this.dy = tangentY * dotProductTangent;


                    const angleDeviation = 30 * Math.PI / 180 * Math.sign(random(-1, 1));

                    const normalAngle = Math.atan2(normalY, normalX);

                    const newNormalAngle = normalAngle + angleDeviation;

                    const newNormalX = Math.cos(newNormalAngle);
                    const newNormalY = Math.sin(newNormalAngle);

                    this.dx += newNormalX * -dotProductNormal;
                    this.dy += newNormalY * -dotProductNormal;

                    //console.log("random");
                } else {
                    this.dx = newDx;
                    this.dy = newDy;
                }

                this.dx *= this.bounceFactor;
                this.dy *= this.bounceFactor;

                //speed limit
                let speed = Math.hypot(this.dx, this.dy);
                if (speed > this.deltaLimit) {
                    let scale = this.deltaLimit / speed;
                    this.dx *= scale;
                    this.dy *= scale;
                }

                return;
            }
        }

        let speed = Math.hypot(this.dx, this.dy);
        if (speed > this.deltaLimit) {
            let scale = this.deltaLimit / speed;
            this.dx *= scale;
            this.dy *= scale;
        }

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