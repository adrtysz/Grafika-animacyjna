"use strict";

// This code is not optimized.
// It is used to teach vector math.

Array.prototype.dot = function (v) {
    return this[0] * v[0] + this[1] * v[1];
}

Array.prototype.minus = function (v) {
    return [this[0]-v[0], this[1]-v[1]];
}

Array.prototype.plus = function (v) {
    return [this[0]+v[0], this[1]+v[1]];
}

Array.prototype.times = function(s) {
    return [s*this[0], s*this[1]];
}

Array.prototype.normalize = function () {
    var length = Math.sqrt(this[0]*this[0] + this[1]*this[1]);
    return [this[0]/length, this[1]/length];
}

Array.prototype.distanceTo = function (q) {
    var dx = this[0] - q[0];
    var dy = this[1] - q[1]
    return Math.sqrt(dx*dx + dy*dy);
}

Array.prototype.reflect = function (n) {
    n = n.normalize();
    return this.minus(n.times(2*this.dot(n)));
}

var canvas = {
    element: document.getElementById('canvas'),
    width: 600,
    height: 400,
    initialize: function () {
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        document.body.appendChild(this.element);
    }
};

var Ball = {
    create: function (color, x, y, dx, dy) {
        var newBall = Object.create(this);
        newBall.pos = [x,y];
        newBall.dir = [dx,dy];
        newBall.width = 40;
        newBall.height = 40;
        newBall.element = document.createElement('div');
        newBall.element.style.backgroundColor = color;
        newBall.element.style.width = newBall.width + 'px';
        newBall.element.style.height = newBall.height + 'px';
        newBall.element.className += ' ball';
        newBall.width = parseInt(newBall.element.style.width);
        newBall.height = parseInt(newBall.element.style.height);
        canvas.element.appendChild(newBall.element);
        return newBall;
    },
    draw: function () {
        this.element.style.left = this.pos[0] + 'px';
        this.element.style.top = this.pos[1] + 'px';
    },
    center: function () {
        return this.pos.plus([this.width/2, this.height/2]);
    },
    collidesWith: function (other) {
        return this.center().distanceTo(other.center()) < this.width;
    }
};

canvas.initialize();
var balls = [
    Ball.create("rgb(218, 112, 214)", 70, 0, 4, 3),

    Ball.create("rgb(199, 21, 133)", 20, 200, 1, 5),
    Ball.create("rgb(255, 127, 80)", 300, 330, 2, 2)

];

function drawScene() {
    for (var ball of balls) {
        ball.newDir = ball.dir.slice();
        ball.draw();
        for (var otherBall of balls) {
            if (ball === otherBall) continue;
            if (ball.collidesWith(otherBall)) {
                ball.newDir = ball.dir.reflect(otherBall.dir);
            }
        }
        if (ball.pos[0] < 0) ball.newDir[0] = Math.abs(ball.newDir[0]);
        if (ball.pos[1] < 0) ball.newDir[1] = Math.abs(ball.newDir[1]);
        if (ball.pos[0] > canvas.width-ball.width) ball.newDir[0] = -Math.abs(ball.newDir[0]);
        if (ball.pos[1] > canvas.height-ball.height) ball.newDir[1] = -Math.abs(ball.newDir[1]);
    }
    for (var ball of balls) {
        ball.dir = ball.newDir;
        ball.pos = ball.pos.plus(ball.dir);
    }
    setTimeout(drawScene, 1000/60);
}

drawScene();

