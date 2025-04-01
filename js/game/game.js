import { Arc } from './arc.js';
import { Ball } from './ball.js';
import { ShadowBall } from './shadowBall.js';
import {drawScore, hexToRGBA, playSound, sleep} from '../utils.js';

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
    arcSpeedDiff;

    //ball
    ballRadius;
    deltaLimit;
    bounceFactor;
    massMultiplier;

    arcs = [];
    shadowBalls = [];
    ball = null;
    isPaused = false;

    directionChange = false;
    twoSideSpin = false;
    spinOnPass = false;
    increaseBall = false;
    showArcsCount = false;

    shadowColor;
    backgroundColor;

    passSound = "../../assets/sounds/xylophone-hit.mp3";


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

    setColors(shadowColor, backgroundColor) {
        this.shadowColor = shadowColor;
        this.backgroundColor = backgroundColor;
    }

    setEffects(directionChange, twoSideSpin, spinOnPass, increaseBall, showArcsCount) {
        this.directionChange = directionChange;
        this.twoSideSpin = twoSideSpin;
        this.spinOnPass = spinOnPass;
        this.increaseBall = increaseBall;
        this.showArcsCount = showArcsCount;
    }

    newGame(numArcs, arcGap, arcThickness, gapAngle, arcSpeed, ballRadius, deltaLimit, bounceFactor, massMultiplier, arcSpeedDiff, startAngle) {
        //arcs
        this.numArcs = numArcs;
        this.arcGap = arcGap;
        this.arcThickness = arcThickness;
        this.gapAngle = gapAngle;
        this.arcSpeed = arcSpeed;
        this.arcSpeedDiff = arcSpeedDiff;
        this.startAngle = startAngle;

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
            this.rotationSpeed = this.arcSpeed + i * this.arcSpeed * arcSpeedDiff;
            if(this.twoSideSpin) {
                if(i % 2 === 1){
                    this.rotationSpeed = -this.rotationSpeed;
                }
            }
            this.newArc = new Arc(this.centerY, this.centerX, this.radius + i * (this.arcGap + this.arcThickness),
                this.gapAngle, this.rotationSpeed, this.arcThickness, this.startAngle);
            if(this.spinOnPass) {
                if(i !== 0) {
                    this.newArc.holdSpin();
                }
            }
            this.arcs.push(this.newArc);
        }
        //ball
        this.ball = new Ball(this.centerY + 10, this.centerX, this.ballRadius, this.deltaLimit,
            this.canvasElement, this.bounceFactor, this.massMultiplier);

        this.isPaused = false;
    }

    animate() {
        //console.log(this.arcSpeed);
        if (this.isPaused) {
            requestAnimationFrame(this.animate);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        this.ctx.fillStyle = hexToRGBA(this.backgroundColor);
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //shadowBall opacity decrease
        this.shadowBalls = this.shadowBalls.filter(ball => ball.opacity > 0);
        this.shadowBalls.forEach(ball => {
            ball.iterate();
        });

        //ball movement
        this.ball.move(this.arcs);

        //shadowBall adding
        this.shadowBalls.push(new ShadowBall(this.ball.y, this.ball.x, this.ball.ballRadius, 0.8, this.shadowColor));

        this.arcs = this.arcs.filter(arc => {
            if (arc.hasGoneThrough(this.ball.y, this.ball.x, this.ball.ballRadius)) {
                this.onArcPassed(arc);
                return false;
            }
            return true;
        });

        //arc, shadow, ball drawing
        this.arcs.forEach(arc => arc.draw(this.ctx));
        this.shadowBalls.forEach(ball => ball.draw(this.ctx));
        this.ball.draw(this.ctx);

        if(this.showArcsCount) drawScore(this.centerY, this.centerX, this.ctx, this.arcs.length);

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
        if(this.spinOnPass) {
            if (this.arcs.length > 1) {
                //1 because 0 isn't deleted yet
                this.arcs[1].startSpin();
            }
        }
        if(this.directionChange) {
            this.arcs.forEach(arc => {
                arc.reverseDirection();
            })
        }
        if(this.increaseBall) {
            this.ball.setRadius(2);
        }

        playSound(this.passSound, 0.5);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }
}