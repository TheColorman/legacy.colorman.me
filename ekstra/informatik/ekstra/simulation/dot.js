'use strict'

class Dot {
    constructor(canvas, size, infected, dead, recovered) {
        this.pos = startLocation(canvas.x, canvas.y);
        this.speed = randCoordinate();
        this.direction = randCoordinate();
        this.color = infected ? color(255, 0, 0) : dead ? color(25, 25, 25) : recovered ? color(0, 255, 0) : color(255, 255, 255);
        this.canvas = canvas;
        this.size = size;
        this.infected = infected;
        this.life = -1;
        this.dead = dead;
        this.recovered = recovered;
    }

    move() {
        this.checkBoundaries();
        this.pos = new Coordinate(this.pos.x + this.speed.x * this.direction.x, this.pos.y + this.speed.y * this.direction.y);
    }

    checkBoundaries() {
        if (hitBoundarypos(this, 'x')) {
            this.pos.x -= this.size/2;
            this.direction.x *= -1;
        }
        if (hitBoundarypos(this, 'y')) {
            this.pos.y -= this.size/2;
            this.direction.y *= -1;
        }
        if (hitBoundaryneg(this, 'x')) {
            this.pos.x += this.size/2;
            this.direction.x *= -1;
        }
        if (hitBoundaryneg(this, 'y')) {
            this.pos.y += this.size/2;
            this.direction.y *= -1;
        }
    }

    render() {
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    infect() {
        this.infected = true;
        this.color = color(255, 0, 0);
        this.life = 240;
    }

    die() {
        if (Math.random()-0.5 > 0) {    //0.5 = 50% chance
            this.recovered = true;
            this.color = color(0, 255, 0);
        } else {
            this.dead = true;
            this.color = color(25, 25, 25);
            this.direction = new Coordinate(0, 0);
            this.speed = new Coordinate(0, 0);
        }
        this.infected = false;
    }

    decreaseLife() {
        this.life--;
    }
}

function hitBoundarypos(dot, axis) {
    return dot.pos[axis] > dot.canvas[axis] - dot.size;
}
function hitBoundaryneg(dot, axis) {
    return dot.pos[axis] < dot.size;
}

function startLocation(x, y) {
    return new Coordinate(randRange(x, 5), randRange(y, 5));
}

function randRange(max, min) {
    return Math.ceil(Math.random() * (max - min) + min);
}

function rand(constraint) {
    return Math.ceil(Math.random() * constraint);
}

function randCoordinate() {
    let x = rand(1);
    let y = rand(1);
    if (Math.random() < 0.5) x *= -1;
    if (Math.random() < 0.5) y *= -1;
    return new Coordinate(x, y);
}