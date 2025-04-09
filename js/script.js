import {initializeSlider} from "./slider.js";
import {Game} from "./game/game.js";
import {initializeDropzone} from "./dropzone.js"

const canvasElement = document.getElementById("canvas");
const container = document.querySelector(".canvas__container");
const ctx = canvasElement.getContext("2d");

let game = new Game();

function resizeCanvas() {
    canvasElement.width = 1600;
    canvasElement.height = 1600;

    game.updateCtx(canvasElement, ctx);
}
resizeCanvas();

/////////        Pause and start buttons                     ///////////////
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

/////////        Sliders and variables initializing          ///////////////
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

initializeSlider('slider1', 'input1', numArcs);
initializeSlider('slider2', 'input2', arcGap);
initializeSlider('slider3', 'input3', arcThickness);
initializeSlider('slider4', 'input4', gapAngle);
initializeSlider('slider5', 'input5', arcSpeed);
initializeSlider('slider10', 'input10', arcSpeedDiff);
initializeSlider('slider11', 'input11', startAngle);

initializeSlider('slider12', 'input12', ballStartAngle);
initializeSlider('slider13', 'input13', ballStartSpeed);
initializeSlider('slider6', 'input6', ballRadius);
initializeSlider('slider7', 'input7', deltaLimit);
initializeSlider('slider8', 'input8', bounceFactor);
initializeSlider('slider9', 'input9', massMultiplier);

//endregion

/////////        Buttons and variables initializing          ///////////////
//region

let directionChange = document.getElementById("toggle1").checked;
let twoSideSpin = document.getElementById("toggle2").checked;
let spinOnPass = document.getElementById("toggle3").checked;
let increaseBall = document.getElementById("toggle4").checked;
let showArcsCount = document.getElementById("toggle5").checked;

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
        document.getElementById("toggle2").closest(".switch").classList.add("switch--disabled");
        document.getElementById("toggle2").checked = false;
    } else {
        document.getElementById("toggle2").closest(".switch").classList.remove("switch--disabled");
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

document.getElementById("toggle6").addEventListener("change", function () {
    arcPassSound = this.checked;
    //console.log("arcPassSound:", arcPassSound);
});

document.getElementById("toggle7").addEventListener("change", function () {
    ballBounceSound = this.checked;
    //console.log("ballBounceSound:", ballBounceSound);
});

//endregion

/////////        Dropzones and variables initializing        ///////////////
//region

let arcPassSoundFile = {value: null};
let ballBounceSoundFile = {value: null};

initializeDropzone('dropzone1', 'fileName1', arcPassSoundFile);
initializeDropzone('dropzone2', 'fileName2', ballBounceSoundFile);

//endregion

/////////                     Colors                         ///////////////
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

//endregion

////////////////////////////////////////////////////// Game /////////////////////////////////

initializeGame();

function initializeGame() {
    game.setSounds(arcPassSound, ballBounceSound, arcPassSoundFile.value, ballBounceSoundFile.value);
    game.setColors(shadowColor, backgroundColor);
    game.setEffects(directionChange, twoSideSpin, spinOnPass, increaseBall, showArcsCount);
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
}

game.animate();