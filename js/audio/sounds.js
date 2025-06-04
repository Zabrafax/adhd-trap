export const audioContext = new AudioContext();
export const audioDestination = audioContext.createMediaStreamDestination();
export const activeAudios = new Set();

export async function playSound(path, volume) {
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
    const audio = new Audio(path);
    audio.loop = false;

    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode);

    gainNode.connect(audioContext.destination);
    gainNode.connect(audioDestination);

    const audioEntry = { audio, track, gainNode };
    activeAudios.add(audioEntry);

    audio.addEventListener("ended", () => {
        stopSingleSound(audioEntry);
    });

    audio.play();
}

export async function playSoundInDuration(path, volume, timeInMillis) {
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
    const timeout = timeInMillis - 1000;
    const audio = new Audio(path);
    audio.loop = false;

    const track = audioContext.createMediaElementSource(audio);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode);

    gainNode.connect(audioContext.destination);
    gainNode.connect(audioDestination);

    const audioEntry = { audio, track, gainNode };
    activeAudios.add(audioEntry);

    setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    }, timeout);

    setTimeout(() => {
        stopSingleSound(audioEntry);
    }, timeInMillis + 100);

    audio.addEventListener("ended", () => {
        stopSingleSound(audioEntry);
    });

    audio.play();
}


export function stopAllSounds() {
    for (const entry of activeAudios) {
        stopSingleSound(entry);
    }
}

function stopSingleSound(entry) {
    const { audio, track, gainNode } = entry;
    try {
        audio.pause();
        audio.currentTime = 0;
        track.disconnect();
        gainNode.disconnect();
        audio.src = "";
    } catch (e) {
        console.warn("Error while manual audio stop:", e);
    }
    activeAudios.delete(entry);
}