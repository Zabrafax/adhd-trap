import { Arc } from './arc.js';
import { Ball } from './ball.js';
import { ShadowBall } from './shadowBall.js';
import {activeAudios, playSound, playSoundInDuration} from '../audio/sounds.js';
import {drawScore, hexToRGBA, sleep, random} from '../utils.js';
import {DropArc} from "./dropArc.js";

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
    ballStartAngle;
    ballStartSpeed;

    arcs = [];
    shadowBalls = [];
    dropArcs = [];
    ball = null;
    isPaused = false;

    directionChange = false;
    twoSideSpin = false;
    spinOnPass = false;
    increaseBall = false;
    showArcsCount = false;
    arcDestroyEffect = false;
    drawArcTick = false;
    arcsSizeDecrease = false;

    arcPassSound = false;
    ballBounceSound = false;
    arcPassSoundFile = null;
    ballBounceSoundFile = null;
    passSoundDuration;
    bounceSoundDuration;

    //colors
    shadowColor;
    backgroundColor;
    arcsColor;

    passSoundDefault = "../../assets/sounds/xylophone-hit.mp3";


    constructor() {
        this.animate = this.animate.bind(this);
        this.onGameEnd = null;
    }

    updateCtx(canvasElement, ctx) {
        this.ctx = ctx;
        this.canvasElement = canvasElement;

        this.centerX = canvasElement.width / 2;
        this.centerY = canvasElement.height / 2;
        this.radius = Math.min(canvasElement.width, canvasElement.height) / 20;
    }

    setSounds(arcPassSound, ballBounceSound, arcPassSoundFile, ballBounceSoundFile, passSoundDuration, bounceSoundDuration) {
        this.arcPassSound = arcPassSound;
        this.ballBounceSound = ballBounceSound;
        this.arcPassSoundFile = arcPassSoundFile;
        this.ballBounceSoundFile = ballBounceSoundFile;
        this.passSoundDuration = passSoundDuration;
        this.bounceSoundDuration = bounceSoundDuration;
    }

    setColors(shadowColor, backgroundColor, arcsColor) {
        this.shadowColor = shadowColor;
        this.backgroundColor = backgroundColor;
        this.arcsColor = arcsColor;
    }

    setEffects(directionChange, twoSideSpin, spinOnPass, increaseBall, showArcsCount, arcDestroyEffect, drawArcTick, arcsSizeDecrease) {
        this.directionChange = directionChange;
        this.twoSideSpin = twoSideSpin;
        this.spinOnPass = spinOnPass;
        this.increaseBall = increaseBall;
        this.showArcsCount = showArcsCount;
        this.arcDestroyEffect = arcDestroyEffect;
        this.drawArcTick = drawArcTick;
        this.arcsSizeDecrease = arcsSizeDecrease;
    }

    newGame(numArcs, arcGap, arcThickness, gapAngle, arcSpeed, ballRadius, deltaLimit, bounceFactor, massMultiplier,
            arcSpeedDiff, startAngle, ballStartAngle, ballStartSpeed) {
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
        this.ballStartAngle = ballStartAngle;
        this.ballStartSpeed = ballStartSpeed;

        this.shadowBalls = [];
        this.arcs = [];
        this.ball = null;

        //arcs init
        for (let i = 0; i < this.numArcs; i++) {
            this.rotationSpeed = this.arcSpeed + i * this.arcSpeed * arcSpeedDiff;
            if(this.twoSideSpin) {
                if(i % 2 === 1){
                    this.rotationSpeed = -this.rotationSpeed;
                }
            }
            this.newArc = new Arc(this.centerY, this.centerX, this.arcsColor, this.radius + i * (this.arcGap + this.arcThickness),
                this.gapAngle, this.rotationSpeed, this.arcThickness, this.startAngle, this.drawArcTick);
            if(this.spinOnPass) {
                if(i !== 0) {
                    this.newArc.holdSpin();
                }
            }
            this.arcs.push(this.newArc);
        }
        //ball
        this.ball = new Ball(this.centerY + 10, this.centerX, this.ballStartAngle, this.ballStartSpeed,
            this.ballRadius, this.deltaLimit, this.canvasElement, this.bounceFactor, this.massMultiplier,
            this.ballBounceSound, this.ballBounceSoundFile, this.bounceSoundDuration);

        this.isPaused = false;
    }

    animate() {
        //console.log('animate');
        //console.log(this.arcSpeed);
        if (this.isPaused) {
            requestAnimationFrame(this.animate);
            return;
        }

        if (this.isFinished) {
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

        //arcs and ball movement
        this.arcs.forEach(arc => arc.move(this.ctx));
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

        if(this.showArcsCount) drawScore(this.centerY, this.centerX, this.ctx, this.arcs.length);

        /*
            Arc, shadow and ball drawing.
         */
        this.arcs.forEach(arc => arc.draw(this.ctx));
        this.shadowBalls.forEach(ball => ball.draw(this.ctx));
        this.ball.draw(this.ctx);

        /*
            dropArcs drawing and deleting.
         */
        this.dropArcs.forEach((dropArc) => dropArc.draw(this.ctx));
        this.dropArcs = this.dropArcs.filter(dropArc => dropArc.isInBounds());
        //console.log(this.dropArcs.length);

        if (!this.ball.isInBounds() && this.dropArcs.length === 0 && activeAudios.size === 0 && this.arcs.length === 0) {
            this.isFinished = true;
            //console.log('Is finished');
            if (this.onGameEnd) {
                this.onGameEnd();
            }
        }

        requestAnimationFrame(this.animate);
        //console.log(activeAudios.size);
    }

    stop() {
        this.isFinished = true;
        //console.log('Is stopped');
        if (this.onGameEnd) {
            this.onGameEnd();
        }
    }

    setOnGameEndCallback(callback) {
        this.onGameEnd = callback;
    }

    async pauseGame(ms) {
        this.isPaused = true;
        await sleep(ms);
        this.isPaused = false;
    }

    onArcPassed(arc) {
        /*
            Arcs size decrease.
         */
        if (this.arcsSizeDecrease) {
            this.arcs.forEach(arc => {
                arc.updateRadius(arc.expectedRadius - (this.arcGap + this.arcThickness), 40);
                arc.setBall(this.ball);
            });
        }

        /*
            dropArcs creation.
         */
        if (this.arcDestroyEffect) {
            this.dropArcs.push(new DropArc(this.centerY, this.centerX, this.canvasElement, arc.arcColor,
                arc.radius, arc.gapAngle, this.arcThickness, arc.angle, 180));
        }

        if(this.spinOnPass) {
            if (this.arcs.length > 1) {
                //1 because 0 isn't deleted yet
                this.arcs[1].startSpin();
            }
        }

        if(this.directionChange) {
            this.arcs.forEach(arc => {
                //console.log('Changed');
                arc.reverseDirection();
            })
        }

        if(this.increaseBall) {
            this.ball.setRadius(2);
        }

        if(this.arcPassSound) {
            if(this.arcPassSoundFile != null) {
                playSoundInDuration(URL.createObjectURL(this.arcPassSoundFile), 0.7, this.passSoundDuration * 1000);
            }
            else {
                playSound(this.passSoundDefault, 0.5);
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }
}