import {Arc} from './arc.js';
import {Ball} from "./ball.js";
import {ShadowBall} from "./shadowBall.js";
import {drawScore, sleep} from "./utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let centerX, centerY, radius;
let arcs = [];
const numArcs = 15;
const arcGap = 15;
const gapAngle = 30;
const arcSpeed = 0.002;
const arcThickness = 7;

const ballRadius = 15;
const deltaLimit = 7;
const bounceFactor = 1.01;
const massMultiplier = 0.0001;

let shadowBalls = [];

function resizeCanvas() {
    const canvasElement = document.getElementById("canvas");
    const container = document.querySelector(".canvas__container");
    //
    // canvasElement.width = container.clientWidth;
    // canvasElement.height = container.clientHeight;

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


for (let i = 0; i < numArcs; i++) {
    arcs.push(new Arc(centerY, centerX, radius + i * (arcGap + arcThickness), gapAngle,
        arcSpeed + i * arcSpeed / 5, arcThickness));
}

let ball = new Ball(centerY + 10, centerX, ballRadius, deltaLimit, canvas, bounceFactor, massMultiplier);

let isPaused = false;

async function pauseGame(ms) {
    isPaused = true;
    await sleep(ms);
    isPaused = false;
}

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

function onArcPassed(arc) {
    //console.log("Arc is passed", arc);
    ball.setRadius(2);
}

animate();