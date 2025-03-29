import { Arc } from './arc.js';
import { Ball } from './ball.js';
import { ShadowBall } from './shadowBall.js';
import { drawScore, sleep } from '../utils.js';

export class Game {
    ctx;
    canvasElement;
    centerX;
    centerY;
    radius;

    //arcs
    numArcs;
    arcGap;
    arcThickness;
    gapAngle;
    arcSpeed;

    //ball
    ballRadius;
    deltaLimit;
    bounceFactor;
    massMultiplier;

    arcs = [];
    shadowBalls = [];
    ball = null;
    isPaused = false;

    constructor() {
        this.animate = this.animate.bind(this);
    }

    updateCtx(canvasElement, ctx) {
        this.ctx = ctx;
        this.canvasElement = canvasElement;

        this.centerX = canvasElement.width / 2;
        this.centerY = canvasElement.height / 2;
        this.radius = Math.min(canvasElement.width, canvasElement.height) / 20;
    }

    newGame(numArcs, arcGap, arcThickness, gapAngle, arcSpeed, ballRadius, deltaLimit, bounceFactor, massMultiplier) {
        //arcs
        this.numArcs = numArcs;
        this.arcGap = arcGap;
        this.arcThickness = arcThickness;
        this.gapAngle = gapAngle;
        this.arcSpeed = arcSpeed;

        //ball
        this.ballRadius = ballRadius;
        this.deltaLimit = deltaLimit;
        this.bounceFactor = bounceFactor;
        this.massMultiplier = massMultiplier;

        this.shadowBalls = [];
        this.arcs = [];
        this.ball = null;
        //arcs
        for (let i = 0; i < this.numArcs; i++) {
            this.arcs.push(new Arc(this.centerY, this.centerX, this.radius + i * (this.arcGap + this.arcThickness),
                this.gapAngle, this.arcSpeed + i * this.arcSpeed / 5, this.arcThickness));
        }
        //ball
        this.ball = new Ball(this.centerY + 10, this.centerX, this.ballRadius, this.deltaLimit,
            this.canvasElement, this.bounceFactor, this.massMultiplier);
    }

    animate() {
        //console.log(this.arcSpeed);
        if (this.isPaused) {
            requestAnimationFrame(this.animate);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        //shadowBall opacity decrease
        this.shadowBalls = this.shadowBalls.filter(ball => ball.opacity > 0);
        this.shadowBalls.forEach(ball => {
            ball.iterate();
        });

        //ball movement
        this.ball.move(this.arcs);

        //shadowBall adding
        this.shadowBalls.push(new ShadowBall(this.ball.y, this.ball.x, this.ball.ballRadius, 0.8));

        this.arcs = this.arcs.filter(arc => {
            if (arc.hasGoneThrough(this.ball.y, this.ball.x, this.ball.ballRadius)) {
                this.onArcPassed(arc);
                return false;
            }
            return true;
        });


        drawScore(this.centerY, this.centerX, this.ctx, this.arcs.length);

        //arc, shadow, ball drawing
        this.arcs.forEach(arc => arc.draw(this.ctx));
        this.shadowBalls.forEach(ball => ball.draw(this.ctx));
        this.ball.draw(this.ctx);

        requestAnimationFrame(this.animate);

        //pauseGame(5);
    }

    async pauseGame(ms) {
        this.isPaused = true;
        await sleep(ms);
        this.isPaused = false;
    }

    onArcPassed(arc) {
        //console.log("Arc is passed", arc);
        this.ball.setRadius(2);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }
}