import {hexToRGBA} from "../utils.js";

export class Arc {
    constructor(centerY, centerX, arcColor, radius, gapAngle, rotationSpeed, arcThickness, angle, drawArcTick) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.arcColor = arcColor;
        this.radius = radius;
        this.gapAngle = gapAngle * Math.PI / 180;
        this.rotationSpeed = rotationSpeed;
        this.holdSpeed = rotationSpeed;
        this.arcThickness = arcThickness;
        this.angle = (angle - 90 - gapAngle / 2) * (Math.PI / 180);

        this.drawArcTick = drawArcTick;
    }

    isInGap(angle) {
        let startGap = this.angle;
        let endGap = this.angle + this.gapAngle;

        // console.log(startGap);
        // console.log(endGap);

        startGap = (startGap + 2 * Math.PI) % (2 * Math.PI);
        endGap = (endGap + 2 * Math.PI) % (2 * Math.PI);
        angle = (angle + 2 * Math.PI) % (2 * Math.PI);

        if (startGap < endGap) {
            return angle >= startGap && angle <= endGap;
        }
        else {
            return angle >= startGap || angle <= endGap;
        }
    }

    hasCollisionInside(y, x, ballRadius) {
        const dy = y - this.centerY;
        const dx = x - this.centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius - ballRadius - this.arcThickness / 2) {
            return false;
        }

        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        if (this.isInGap(angle)) {
            //console.log("gap");
            return false;
        }

        const contactX = this.centerX + (this.radius - this.arcThickness / 2 - ballRadius) * Math.cos(angle);
        const contactY = this.centerY + (this.radius - this.arcThickness / 2 - ballRadius) * Math.sin(angle);

        return { x: contactX, y: contactY };
    }

    hasGoneThrough(y, x, ballRadius) {
        const dy = y - this.centerY;
        const dx = x - this.centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return dist + ballRadius >= this.radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, this.angle + this.gapAngle,
            this.angle);
        ctx.strokeStyle = hexToRGBA(this.arcColor);
        ctx.lineWidth = this.arcThickness;
        ctx.stroke();
        ctx.closePath();

        if (this.drawArcTick) {
            this.drawTick(ctx, this.angle + this.gapAngle);
            this.drawTick(ctx, this.angle);
        }

        this.angle += this.rotationSpeed;
        if (this.angle > 2 * Math.PI) this.angle -= 2 * Math.PI;
        if (this.angle < 0) this.angle += 2 * Math.PI;
    }

    drawTick(ctx, angle) {
        const tickLength = this.arcThickness * 3;

        const x = this.centerX + (this.radius - tickLength / 2) * Math.cos(angle);
        const y = this.centerY + (this.radius - tickLength / 2) * Math.sin(angle);

        const x2 = this.centerX + (this.radius + tickLength / 2) * Math.cos(angle);
        const y2 = this.centerY + (this.radius + tickLength / 2) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = hexToRGBA(this.arcColor);
        ctx.lineWidth = this.arcThickness / 2;
        ctx.stroke();
        ctx.closePath();
    }

    reverseDirection() {
        this.rotationSpeed = -this.rotationSpeed;
        this.holdSpeed = -this.holdSpeed;
    }

    holdSpin() {
        this.rotationSpeed = 0;
    }

    startSpin() {
        this.rotationSpeed = this.holdSpeed;
    }
}