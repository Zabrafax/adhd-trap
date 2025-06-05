import {Slider} from "./slider.js";
import {Game} from "./game/game.js";
import {initializeDropzone} from "./dropzone.js"
import {Recorder} from "./recorder.js";
import {stopAllSounds} from "./audio/sounds.js";
import {autoResize} from "./resize.js";

autoResize();

const canvasElement = document.getElementById("canvas");
const ctx = canvasElement.getContext("2d");

/*
    Pause and start buttons.
 */
//region

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    if (pauseButton.classList.contains("green-theme")) {
        pauseButton.classList.remove("green-theme");
        pauseButton.classList.add("red-theme");
        pauseButton.setAttribute("data", "Pause");
    }

    initializeGame();
    //console.log('Start Button is Pressed');
});

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function() {
    if (pauseButton.classList.contains("red-theme")) {
        pauseButton.classList.remove("red-theme");
        pauseButton.classList.add("green-theme");
        pauseButton.setAttribute("data", "Play");
    } else {
        pauseButton.classList.remove("green-theme");
        pauseButton.classList.add("red-theme");
        pauseButton.setAttribute("data", "Pause");
    }

    game.togglePause();
    //console.log('Pause Button is Pressed');
});

//endregion

/*
    Sliders and variables initializing.
 */
//region
let numArcs = {value: null};
let arcGap = {value: null};
let arcThickness = {value: null};
let gapAngle = {value: null};
let arcSpeed = {value: null};
let arcSpeedDiff = {value: null};
let startAngle = {value: null};

let ballRadius = {value: null};
let deltaLimit = {value: null};
let bounceFactor = {value: null};
let massMultiplier = {value: null};
let ballStartAngle = {value: null};
let ballStartSpeed = {value: null};

const sliderConfigs = [
    { id: 'sliderNumArcs', input: 'inputNumArcs', sliderValueRef: numArcs, defaultValue: 20, min: 1, max: 100 },
    { id: 'sliderArcGap', input: 'inputArcGap', sliderValueRef: arcGap, defaultValue: 25, min: 0, max: 50 },
    { id: 'sliderArcThickness', input: 'inputArcThickness', sliderValueRef: arcThickness, defaultValue: 8, min: 1, max: 20 },
    { id: 'sliderGapAngle', input: 'inputGapAngle', sliderValueRef: gapAngle, defaultValue: 30, min: 5, max: 355 },
    { id: 'sliderArcSpeed', input: 'inputArcSpeed', sliderValueRef: arcSpeed, defaultValue: 20, min: 1, max: 200 },
    { id: 'sliderArcSpeedDiff', input: 'inputArcSpeedDiff', sliderValueRef: arcSpeedDiff, defaultValue: 20, min: 0, max: 200 },
    { id: 'sliderStartAngle', input: 'inputStartAngle', sliderValueRef: startAngle, defaultValue: 135, min: 0, max: 360 },

    { id: 'sliderBallStartAngle', input: 'inputBallStartAngle', sliderValueRef: ballStartAngle, defaultValue: 105, min: 0, max: 360 },
    { id: 'sliderBallStartSpeed', input: 'inputBallStartSpeed', sliderValueRef: ballStartSpeed, defaultValue: 12, min: 0, max: 150 },
    { id: 'sliderBallRadius', input: 'inputBallRadius', sliderValueRef: ballRadius, defaultValue: 30, min: 5, max: 100 },
    { id: 'sliderDeltaLimit', input: 'inputDeltaLimit', sliderValueRef: deltaLimit, defaultValue: 5, min: 1, max: 50 },
    { id: 'sliderBounceFactor', input: 'inputBounceFactor', sliderValueRef: bounceFactor, defaultValue: 103, min: 50, max: 150 },
    { id: 'sliderMassMultiplier', input: 'inputMassMultiplier', sliderValueRef: massMultiplier, defaultValue: 100, min: 0, max: 500 }
];

function initSliders() {
    const sliders = [];

    for (const cfg of sliderConfigs) {
        const s = new Slider(cfg.id, cfg.input, cfg.sliderValueRef, cfg.defaultValue, cfg.min, cfg.max);
        sliders.push(s);
    }

    return sliders;
}

let sliders = initSliders();

let resetArcsSettingsButton = document.getElementById('resetArcsSettingsButton');
resetArcsSettingsButton.addEventListener('click', (event) => {
    for (const slider of sliders.slice(0, 7)) {
        slider.resetToDefaultValue();
    }
})

let resetBallSettingsButton = document.getElementById('resetBallSettingsButton');
resetBallSettingsButton.addEventListener('click', (event) => {
    for (const slider of sliders.slice(7)) {
        slider.resetToDefaultValue();
    }
})

//endregion

/*
    Buttons and variables initializing.
 */
//region

let directionChange = document.getElementById("toggle1").checked;
let twoSideSpin = document.getElementById("toggle2").checked;
let spinOnPass = document.getElementById("toggle3").checked;
let increaseBall = document.getElementById("toggle4").checked;
let showArcsCount = document.getElementById("toggle5").checked;
let arcDestroyEffect = document.getElementById("toggleArcDestroyEffect").checked;
let drawArcTick = document.getElementById("drawArcTick").checked;
let arcsSizeDecrease = document.getElementById("arcsSizeDecrease").checked;

let arcPassSound = document.getElementById("toggle6").checked;
let ballBounceSound = document.getElementById("toggle7").checked;

document.getElementById("toggle1").addEventListener("change", function () {
    directionChange = this.checked;
    //console.log("directionChange:", directionChange);
});

document.getElementById("toggle2").addEventListener("change", function () {
    twoSideSpin = this.checked;
    //console.log("twoSideSpin:", twoSideSpin);
});

document.getElementById("toggle3").addEventListener("change", function () {
    spinOnPass = this.checked;
    if(this.checked) {
        document.getElementById("toggle2").closest(".switch").classList.add("switch__disabled");
        document.getElementById("toggle2").checked = false;
    } else {
        document.getElementById("toggle2").closest(".switch").classList.remove("switch__disabled");
    }
    //console.log("spinOnPass:", spinOnPass);
});

document.getElementById("toggle4").addEventListener("change", function () {
    increaseBall = this.checked;
    //console.log("increaseBall:", increaseBall);
});

document.getElementById("toggle5").addEventListener("change", function () {
    showArcsCount = this.checked;
    //console.log("showArcsCount:", showArcsCount);
});

document.getElementById("toggleArcDestroyEffect").addEventListener("change", function () {
    arcDestroyEffect = this.checked;
});

document.getElementById("toggleArcDestroyEffect").addEventListener("change", function () {
    arcDestroyEffect = this.checked;
});

document.getElementById("drawArcTick").addEventListener("change", function () {
    drawArcTick = this.checked;
});

document.getElementById("arcsSizeDecrease").addEventListener("change", function () {
    arcsSizeDecrease = this.checked;
});

//sounds buttons

document.getElementById("toggle6").addEventListener("change", function () {
    arcPassSound = this.checked;
    //console.log("arcPassSound:", arcPassSound);
});

document.getElementById("toggle7").addEventListener("change", function () {
    ballBounceSound = this.checked;
    //console.log("ballBounceSound:", ballBounceSound);
});

//endregion

/*
    Sounds drop zones, sliders and variables initializing.
 */
//region

let arcPassSoundFile = {value: null};
let ballBounceSoundFile = {value: null};

const containerPassSoundDuration = document.getElementById('containerPassSoundDuration');
const containerBounceSoundDuration = document.getElementById('containerBounceSoundDuration');

initializeDropzone('dropzone1', 'fileName1', arcPassSoundFile, containerPassSoundDuration);
initializeDropzone('dropzone2', 'fileName2', ballBounceSoundFile, containerBounceSoundDuration);


let passSoundDuration = {value: null};
let bounceSoundDuration = {value: null};

const soundSliderConfigs = [
    { id: 'sliderPassSoundDuration', input: 'inputPassSoundDuration', sliderValueRef: passSoundDuration, defaultValue: 4, min: 1, max: 20 },
    { id: 'sliderBounceSoundDuration', input: 'inputBounceSoundDuration', sliderValueRef: bounceSoundDuration, defaultValue: 4, min: 1, max: 20 }
];

function initSoundSliders() {
    const sliders = [];

    for (const cfg of soundSliderConfigs) {
        const s = new Slider(cfg.id, cfg.input, cfg.sliderValueRef, cfg.defaultValue, cfg.min, cfg.max);
        sliders.push(s);
    }

    return sliders;
}
initSoundSliders();

//endregion

/*
    Colors.
 */
//region

let shadowColor = document.getElementById("color1").value;
const colorPicker1 = document.getElementById("color1");
colorPicker1.addEventListener("input", (event) => {
    shadowColor = event.target.value;
});

let backgroundColor = document.getElementById("color2").value;
const colorPicker2 = document.getElementById("color2");
colorPicker2.addEventListener("input", (event) => {
    backgroundColor = event.target.value;
});

let arcsColor = document.getElementById("color3").value;
const colorPicker3 = document.getElementById("color3");
colorPicker3.addEventListener("input", (event) => {
    arcsColor = event.target.value;
});

//endregion

/////////                     Video Recording                ///////////////
//region

const downloadButton = document.getElementById("downloadVideoLink");
const stopRecordButton = document.getElementById("stopRecordButton");

stopRecordButton.addEventListener("click", (e) => {
    recorder.stopRecord();
})

let autoRecordSwitch = document.getElementById("autoRecordSwitch");
let autoRecord = autoRecordSwitch.checked;
autoRecordSwitch.addEventListener("change", function () {
    autoRecord = this.checked;
});

//endregion

////////////////////////////////////////////////////// Game /////////////////////////////////

let recorder;
let game;
initializeGame();

function initializeGame() {
    stopAllSounds();

    if (game != null) {
        game.stop();
    }
    resizeCanvas();
    game = new Game();
    game.updateCtx(canvasElement, ctx);

    recorder = new Recorder(canvasElement, downloadButton, stopRecordButton);
    if (autoRecord) {
        recorder.startRecord();
    }
    game.setOnGameEndCallback(() => {
        recorder.stopRecord();
    });

    game.setSounds(
        arcPassSound,
        ballBounceSound,
        arcPassSoundFile.value,
        ballBounceSoundFile.value,
        passSoundDuration.value / 1,
        bounceSoundDuration.value / 1
    );

    game.setColors(
        shadowColor,
        backgroundColor,
        arcsColor
    );

    game.setEffects(
        directionChange,
        twoSideSpin,
        spinOnPass,
        increaseBall,
        showArcsCount,
        arcDestroyEffect,
        drawArcTick,
        arcsSizeDecrease
    );

    game.newGame(
        numArcs.value / 1,
        arcGap.value / 1,
        arcThickness.value / 1,
        gapAngle.value / 1,
        arcSpeed.value / 10000,
        ballRadius.value / 1,
        deltaLimit.value / 1000,
        bounceFactor.value / 100,
        massMultiplier.value / 1000000 * 0.8,
        arcSpeedDiff.value / 100,
        startAngle.value / 1,
        ballStartAngle.value / 1,
        ballStartSpeed.value / 10,
    );

    game.animate();
}

function resizeCanvas() {
    canvasElement.width = 1600;
    canvasElement.height = 1600;
}

export const canvasCenterX = canvasElement.width / 2;
export const canvasCenterY = canvasElement.height / 2;