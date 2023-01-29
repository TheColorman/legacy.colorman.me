'use strict';
//      Jeg har ikke tænkt mig at kommentere denne kode, fordi
//      
//      1. Det er ikke mig der har skrevet det hele, jeg har kun skrevet omkring ~30%
//
//      2. Jeg har allerede opfyldt kravene med mit script.js dokument, 
//      dette er bare lidt ekstra jeg fik lyst til at prøve, men er ikke 
//      en egentlig del af min aflevering

let width = 500;
let height = 200;

let population = 200;

const dots = [];
const infected = [];
const dead = [];
const recovered = [];

var slider = 200;
var size2 = 12;

let washBox;
let wash = 0;
let coughBox;
let cough = 0;
let handBox;
let hand = 0;
let cleanBox;
let clean = 0;
let distanceBox;
let distance = 0;

function setup() {
    frameRate(60);
    width = document.getElementById("sketch").offsetWidth;
    height = document.getElementById("sketch").offsetHeight;
    var canvas = createCanvas(width, height);
    canvas.parent('sketch');

    slider = document.getElementById("popuslider").value;
    washBox = document.getElementById("wash");
    coughBox = document.getElementById("cough");
    handBox = document.getElementById("hand");
    cleanBox = document.getElementById("clean");
    distanceBox = document.getElementById("distance");
    
    resetSketch();
}


function resetSketch() {
    loop();
    dots.length = 0;
    infected.length = 0;
    dead.length = 0;
    recovered.length = 0;
    createPopulation();
    noLoop();
}

function draw() {
    background(51);
    checkComplete();
    moveDots();
    updateText();
    checkLife();
}

function updateExt() {
    slider = document.getElementById("popuslider").value;
    population = slider;
    updateText();
}

function checkLife() {
    for (const dot of dots) {
        if (dot.life == 0) {
            dot.die();
            if (dot.dead) {
                dead.push(dot.dead);
                infected.shift(dot.dead);
            } else {
                recovered.push(dot.recovered);
                infected.shift(dot.recovered);
            }
        }
    dot.decreaseLife();
    }
}

function updateCheckboxes() {
    if (washBox.checked == true) { 
        wash = 0.2;
    } else {
        wash = 0;
    }
    if (coughBox.checked == true) {
        cough = 0.2;
    } else {
        cough = 0;
    }
    if (handBox.checked == true) {
        hand = 0.2;
    } else {
        hand = 0;
    }
    if (cleanBox.checked == true) {
        clean = 0.2;
    } else {
        clean = 0;
    }
    if (distanceBox.checked == true) {
        distance = 1;
    } else {
        distance = 0;
    }
} 

function windowResized() {
    width = document.getElementById("sketch").offsetWidth;
    height = document.getElementById("sketch").offsetHeight;
    resizeCanvas(width, height);
    noLoop();
}

function updateText() {
    document.getElementById("total").innerHTML = `I alt: ${dots.length}`;
    document.getElementById("virus").innerHTML = `Inficerede: ${infected.length}`;
    document.getElementById("healthy").innerHTML = `Aldrig smittede: ${dots.length - infected.length - dead.length - recovered.length}`;
    document.getElementById("dead").innerHTML = `Døde: ${dead.length}`;
    document.getElementById("recover").innerHTML = `Helbredte: ${recovered.length}`
    document.getElementById("popul").innerHTML = `Population: ${slider}`;
}

function checkComplete() {
    if (infected.length == 0) {
        noLoop();
    }
}

function moveDots() {
    for (const dot of dots) {
        dot.move();
        fill(dot.color);
        dot.render();
        for (const dot2 of dots) {
            checkCollision(dot, dot2);
        }
    }
}

function checkCollision(dot, dot2) {
    if (dot.dead || dot2.dead) return;
    if (dot.pos.x != dot2.pos.x && dot.pos.y != dot2.pos.y) { 
        if (distance == 1 && dist(dot.pos.x, dot.pos.y, dot2.pos.x, dot2.pos.y) < dot.size*3) {
            if (dist(dot.pos.x + dot.speed.x * dot.direction.x, dot.pos.y + dot.speed.y * dot.direction.y, dot2.pos.x + dot2.speed.x * dot2.direction.x, dot2.pos.y + dot2.speed.y * dot2.direction.y) < dist(dot.pos.x, dot.pos.y, dot2.pos.x, dot2.pos.y)) {
                if (Math.sign(dot.direction.x) == -1) dot.direction.x += 0.025;
                if (Math.sign(dot.direction.x) == 1) dot.direction.x -= 0.025;
                if (Math.sign(dot.direction.y) == -1) dot.direction.y += 0.025;
                if (Math.sign(dot.direction.y) == 1) dot.direction.y -= 0.025;
                if (Math.sign(dot2.direction.x) == -1) dot2.direction.x += 0.025;
                if (Math.sign(dot2.direction.x) == 1) dot2.direction.x -= 0.025;
                if (Math.sign(dot2.direction.y) == -1) dot2.direction.y += 0.025;
                if (Math.sign(dot2.direction.y) == 1) dot2.direction.y -= 0.025;
            } else {
                if (Math.sign(dot.direction.x) == -1) dot.direction.x -= 0.025;
                if (Math.sign(dot.direction.y) == -1) dot.direction.y -= 0.025;
                if (Math.sign(dot.direction.x) == 1) dot.direction.x += 0.025;
                if (Math.sign(dot.direction.y) == 1) dot.direction.y += 0.025;
                if (Math.sign(dot2.direction.x) == -1) dot2.direction.x -= 0.025;
                if (Math.sign(dot2.direction.y) == -1) dot2.direction.y -= 0.025;
                if (Math.sign(dot2.direction.x) == 1) dot2.direction.x += 0.025;
                if (Math.sign(dot2.direction.y) == 1) dot2.direction.y += 0.025;
            }
        }
        if (dot.direction.x > 2) dot.direction.x = 2
        if (dot.direction.y > 2) dot.direction.y = 2
        if (dot.direction.x < -2) dot.direction.x = -2
        if (dot.direction.y < -2) dot.direction.y = -2
        if (dot2.direction.x > 2) dot2.direction.x = 2
        if (dot2.direction.y > 2) dot2.direction.y = 2
        if (dot2.direction.x < -2) dot2.direction.x = -2
        if (dot2.direction.y < -2) dot2.direction.y = -2

        if (dist(dot.pos.x, dot.pos.y, dot2.pos.x, dot2.pos.y) < dot.size) {
            //direction change or smthn
            let dotx = dot.direction.x;
            let doty = dot.direction.y;
            let dot2x = dot2.direction.x;
            let dot2y = dot2.direction.y;
            dot.direction.x = dot2x + (Math.random()-0.5)/2;
            dot.direction.y = dot2y + (Math.random()-0.5)/2;
            dot2.direction.x = dotx + (Math.random()-0.5)/2;
            dot2.direction.y = doty + (Math.random()-0.5)/2;

            if (isOneInfected(dot, dot2)) {
                if (!dot.infected && !dot.dead && !dot.recovered) {
                    if (Math.random()-0.1-wash-cough-hand-clean > 0) {
                        dot.infect();
                        infected.push(dot.infected);
                    }
                } if (!dot2.infected && !dot2.dead && !dot2.recovered) {
                    if (Math.random()-0.1-wash-cough-hand-clean > 0) {
                        dot2.infect();
                        infected.push(dot.infected);
                    }
                }
            }
        }
    }
}

function isOneInfected(dot, dot2) {
    return (dot.infected || dot2.infected) && !areBothInfected(dot, dot2);
}

function areBothInfected(dot, dot2) {
    return dot.infected && dot2.infected;
}

function createPopulation() {
    for (let i = 1; i < population; i++) {
        dots.push(new Dot(new Coordinate(width, height), size2, false, false, false));
    }
    createCarrier();
}

function createCarrier() {
    const carrier = new Dot(new Coordinate(width, height), size2, false, false, false);
    carrier.infect();
    dots.push(carrier);
    infected.push(carrier);
}