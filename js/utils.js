export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function drawScore(y, x, ctx, score) {
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, x, y);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
