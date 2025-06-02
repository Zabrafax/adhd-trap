export class Recorder {
    constructor(canvas, downloadButton) {
        this.canvas = canvas;
        this.downloadButton = downloadButton;
    }

    startRecord() {
        if (this.mediaRecorder != null) {
            this.mediaRecorder.stop();
        }
        console.log("Starting Recorder");

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