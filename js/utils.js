export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function drawScore(y, x, ctx, score) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(score, x, y);
}
