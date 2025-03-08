import {Arc} from './arc.js';
import {Ball} from "./ball.js";
import {ShadowBall} from "./shadowBall.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let centerX, centerY, radius;
let arcs = [];
const numArcs = 15;
const gapAngle = 25;
const arcSpeed = 0.002;
const arcThickness = 5;

const ballRadius = 15;
const deltaLimit = 3;
const gravity = 0.05;
const bounceFactor = 1.1;

let shadowBalls = [];

function resizeCanvas() {
    canvas.width = document.body.clientWidth / 1.7;
    canvas.height = document.body.clientWidth / 1.7;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = Math.min(canvas.width, canvas.height) / 8;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


for (let i = 0; i < numArcs; i++) {
    arcs.push(new Arc(centerY, centerX, radius + i * arcThickness * 3, gapAngle,
        arcSpeed + i * arcSpeed / 15, arcThickness));
}

let ball = new Ball(centerY + 40, centerX, ballRadius, deltaLimit, canvas, gravity, bounceFactor);

function animate() {
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

    //arc delete
    arcs = arcs.filter(arc => !arc.hasGoneThrough(ball.y, ball.x, ball.ballRadius));

    //arc, shadow, ball drawing
    arcs.forEach(arc => arc.draw(ctx));
    shadowBalls.forEach(ball => ball.draw(ctx));
    ball.draw(ctx);

    requestAnimationFrame(animate);
}

animate();