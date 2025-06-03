import { audioContext, audioDestination } from "./audioSetup.js";

export function playSound(path, volume) {
    const audio = new Audio(path);
    audio.loop = false;

    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode).connect(audioDestination);
    gainNode.connect(audioContext.destination);

    audio.addEventListener("ended", () => {
        track.disconnect();
        gainNode.disconnect();
        audio.src = "";
    });

    audio.play();
}

export function playSoundInDuration(path, volume, timeInMillis) {
    const timeout = timeInMillis - 2000;
    const audio = new Audio(path);
    audio.loop = false;

    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode).connect(audioDestination);
    gainNode.connect(audioContext.destination);

    audio.play();

    setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    }, timeout);

    audio.addEventListener("ended", () => {
        track.disconnect();
        gainNode.disconnect();
        audio.src = "";
    });

    audio.play();
}