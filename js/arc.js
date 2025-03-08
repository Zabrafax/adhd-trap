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

    hasCollisionInside(y, x, ballRadius) {
        const dy = y - this.centerY;
        const dx = x - this.centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius - ballRadius - this.arcThickness) {
            return false;
        }

        const angle = Math.atan2(dy, dx);

        const contactX = this.centerX + (this.radius - this.arcThickness/2 - ballRadius) * Math.cos(angle);
        const contactY = this.centerY + (this.radius - this.arcThickness/2 - ballRadius) * Math.sin(angle);

        return { x: contactX, y: contactY };
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, this.angle,
            this.angle + 2 * Math.PI - this.gapAngle * Math.PI / 180);
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = this.arcThickness;
        ctx.stroke();
        ctx.closePath();

        // Обновляем угол для вращения
        this.angle += this.rotationSpeed;
    }
}