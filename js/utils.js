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
    const audio = new Audio(path);
    audio.loop = false;

    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode).connect(audioContext.destination);

    audio.play();
}

export function playSound4Sec(path, volume) {
    const audio = new Audio(path);
    audio.loop = false;

    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode).connect(audioContext.destination);

    audio.play();

    setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    }, 2000);

    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        audioContext.close();
    }, 4000);
}