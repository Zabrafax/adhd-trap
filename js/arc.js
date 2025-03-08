export class Arc {
    constructor(centerY, centerX, radius, gapAngle, rotationSpeed, arcThickness) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.gapAngle = gapAngle;
        this.rotationSpeed = rotationSpeed;
        this.arcThickness = arcThickness;
        this.angle = 0;
    }

    isInGap(angle) {
        let startGap = this.angle;
        let endGap = this.angle + this.gapAngle * Math.PI / 180;

        // console.log("angle: " + angle);
        // console.log("startGap: " + startGap);
        // console.log("endGap: " + endGap);
        return angle >= startGap && angle <= endGap;
    }

    hasCollisionInside(y, x, ballRadius) {
        const dy = y - this.centerY;
        const dx = x - this.centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius - ballRadius - this.arcThickness) {
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

        if (dist + ballRadius >= this.radius) {
            console.log("Gone through");
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, this.angle + this.gapAngle * Math.PI / 180,
            this.angle);
        ctx.strokeStyle = "white";
        ctx.lineWidth = this.arcThickness;
        ctx.stroke();
        ctx.closePath();

        this.angle += this.rotationSpeed;
        if (this.angle > 2 * Math.PI) this.angle -= 2 * Math.PI;
        if (this.angle < 0) this.angle += 2 * Math.PI;
    }
}