export class Recorder {
    constructor(canvas, downloadButton, stopRecordButton) {
        this.canvas = canvas;
        this.downloadButton = downloadButton;
        this.stopRecordButton = stopRecordButton;
    }

    startRecord() {
        if (this.mediaRecorder != null) {
            this.mediaRecorder.stop();
            this.downloadButton.classList.add("a__button__video__inactive");
        }
        console.log("Starting Recorder");
        this.stopRecordButton.classList.remove("a__button__video__inactive");

        this.canvasStream = this.canvas.captureStream(60);
        this.mediaRecorder = new MediaRecorder(this.canvasStream, { mimeType: "video/webm" });

        this.chunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        }

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, {type: "video/webm"});
            const videoUrl = URL.createObjectURL(blob);

            this.downloadButton.href = videoUrl;
            this.downloadButton.download = "ADHDBall.webm";

            this.downloadButton.classList.remove("a__button__video__inactive");
            this.stopRecordButton.classList.add("a__button__video__inactive");
        };

        this.mediaRecorder.start();
    }

    stopRecord() {
        if (this.mediaRecorder && (this.mediaRecorder.state === "recording" || this.mediaRecorder.state === "recording")) {
            console.log("Recorder stopped");
            this.mediaRecorder.stop();
        }
    }
}