import { audioContext, audioDestination } from "./audio/sounds.js";

export class Recorder {
    constructor(canvas, downloadButton, stopRecordButton) {
        this.canvas = canvas;
        this.downloadButton = downloadButton;
        this.stopRecordButton = stopRecordButton;
        this.audioStream = audioDestination.stream;
    }

    startRecord() {
        this.downloadButton.classList.add("a__button__video__inactive");
        //console.log("Starting Recorder");
        this.stopRecordButton.classList.remove("a__button__video__inactive");

        this.canvasStream = this.canvas.captureStream(60);
        const combinedStream = new MediaStream([
            ...this.canvasStream.getVideoTracks(),
            ...this.audioStream.getAudioTracks()
        ]);
        this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm;codecs=vp8",
            videoBitsPerSecond: 4_000_000
        });

        this.chunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        }

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, {type: "video/webm"});
            const videoUrl = URL.createObjectURL(blob);

            this.downloadButton.href = videoUrl;
            this.downloadButton.download = "ADHDBall.webm";
        };

        this.mediaRecorder.start();
    }

    stopRecord() {
        if (this.mediaRecorder && (this.mediaRecorder.state === "recording" || this.mediaRecorder.state === "recording")) {
            //console.log("Recorder stopped");
            this.downloadButton.classList.remove("a__button__video__inactive");
            this.stopRecordButton.classList.add("a__button__video__inactive");

            this.mediaRecorder.stop();

            this.canvasStream.getTracks().forEach(track => track.stop());

            this.canvasStream = null;
            this.audioStream = null;
            this.mediaRecorder = null;
        }
    }
}