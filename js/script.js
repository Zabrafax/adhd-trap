import {Arc} from './arc.js';
import {Ball} from "./ball.js";
import {ShadowBall} from "./shadowBall.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let centerX, centerY, radius;
const arcs = [];
const numArcs = 10;
const arcSpeed = 0.003;
const arcThickness = 3;

const ballRadius = 15;
const deltaLimit = 3;
const gravity = 0.04;
const bounceFactor = 1.1;

let shadowBalls = [];

function resizeCanvas() {
    canvas.width = document.body.clientWidth / 1.7;
    canvas.height = document.body.clientWidth / 1.7;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = Math.min(canvas.width, canvas.height) / 5;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


for (let i = 0; i < numArcs; i++) {
    arcs.push(new Arc(centerY, centerX, radius + i * arcThickness * 3, 45, arcSpeed + i * arcSpeed / 10, arcThickness));
}

let ball = new Ball(centerY + 40, centerX, ballRadius, deltaLimit, canvas, gravity, bounceFactor);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let arc of arcs) {
        arc.draw(ctx);
    }

    shadowBalls = shadowBalls.filter(ball => ball.opacity > 0);
    shadowBalls.forEach(ball => {
        ball.iterate();
        ball.draw(ctx);
    });

    ball.move(arcs);
    ball.draw(ctx);
    shadowBalls.push(new ShadowBall(ball.y, ball.x, ball.ballRadius, 0.8));

    requestAnimationFrame(animate);
}

animate();