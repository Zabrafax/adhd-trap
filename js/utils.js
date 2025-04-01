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

export function hexToRGBA(hex, opacity = 1) {
    hex = hex.replace("#", "");

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function playSound(path, volume) {
    const sound = new Audio(path);
    sound.volume = volume;
    sound.play();
}
