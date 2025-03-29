import {Arc} from './arc.js';
import {Ball} from "./ball.js";
import {ShadowBall} from "./shadowBall.js";
import {drawScore, sleep} from "./utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let centerX, centerY, radius;
let arcs = [];
const numArcs = 20;
const arcGap = 15;
const gapAngle = 30;
const arcSpeed = 0.002;
const arcThickness = 7;

let ball;
const ballRadius = 15;
const deltaLimit = 7;
const bounceFactor = 1.01;
const massMultiplier = 0.0001;

let shadowBalls = [];

let isPaused;

function resizeCanvas() {
    const canvasElement = document.getElementById("canvas");
    const container = document.querySelector(".canvas__container");

    canvasElement.width = 1024;
    canvasElement.height = 1024;

    canvasElement.style.width = `${container.clientWidth}px`;
    canvasElement.style.height = `${container.clientWidth}px`;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = Math.min(canvas.width, canvas.height) / 20;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    if (pauseButton.classList.contains("green-theme")) {
        pauseButton.classList.remove("green-theme");
        pauseButton.classList.add("red-theme");
        pauseButton.setAttribute("data", "Pause");
    }

    initializeGame();
    isPaused = false;
    console.log('Start Button is Pressed');
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

    isPaused = !isPaused;
    console.log('Pause Button is Pressed');
});

const slider = document.getElementById('slider1');
const input = document.getElementById("input1");
const defaultValue = slider.value;

input.min = slider.min;
input.max = slider.max;
input.step = slider.step;
input.value = slider.value;

slider.addEventListener('input', () => {
    input.value = slider.value;
});

input.addEventListener('input', () => {
    console.log(input.value);
    inputChange(input);
});

input.addEventListener('blur', () => {
    if (input.value.trim() === "") {
        const minValue = parseInt(slider.min);
        const maxValue = parseInt(slider.max);
        input.value = defaultValue;
        slider.value = input.value;
    } else {
        inputChange(input);
    }
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (input.value.trim() === "") {
            const minValue = parseInt(slider.min);
            const maxValue = parseInt(slider.max);
            input.value = defaultValue;
            slider.value = input.value;
        } else {
            inputChange(input);
        }
    }
});

function inputChange(input) {
    const minValue = parseInt(slider.min);
    const maxValue = parseInt(slider.max);

    if (input.value >= minValue && input.value <= maxValue) {
        slider.value = input.value;
    } else if (!(input.value.trim() === "")) {
        input.value = input.value < minValue ? minValue : maxValue;
        slider.value = input.value;
    }
}

initializeGame();

function animate() {
    if (isPaused) {
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //shadowBall opacity decrease
    shadowBalls = shadowBalls.filter(ball => ball.opacity > 0);
    shadowBalls.forEach(ball => {
        ball.iterate();
    });

    //ball movement
    ball.move(arcs);

    //shadowBall adding
    shadowBalls.push(new ShadowBall(ball.y, ball.x, ball.ballRadius, 0.8));

    arcs = arcs.filter(arc => {
        if (arc.hasGoneThrough(ball.y, ball.x, ball.ballRadius)) {
            onArcPassed(arc);
            return false;
        }
        return true;
    });


    drawScore(centerY + 10, centerX - 15, ctx, arcs.length);

    //arc, shadow, ball drawing
    arcs.forEach(arc => arc.draw(ctx));
    shadowBalls.forEach(ball => ball.draw(ctx));
    ball.draw(ctx);

    requestAnimationFrame(animate);

    //pauseGame(5);
}

function initializeGame() {
    shadowBalls = [];
    arcs = [];
    //arcs
    for (let i = 0; i < numArcs; i++) {
        arcs.push(new Arc(centerY, centerX, radius + i * (arcGap + arcThickness), gapAngle,
            arcSpeed + i * arcSpeed / 5, arcThickness));
    }
    //ball
    ball = new Ball(centerY + 10, centerX, ballRadius, deltaLimit, canvas, bounceFactor, massMultiplier);

    isPaused = false;
}

async function pauseGame(ms) {
    isPaused = true;
    await sleep(ms);
    isPaused = false;
}

function onArcPassed(arc) {
    //console.log("Arc is passed", arc);
    ball.setRadius(2);
}

animate();