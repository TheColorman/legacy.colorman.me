let circleValue = 100;
let forceValue = 100;
let showVelocity = false;
let hidden = false;

const circles = [];
let circleAmount = 100;
const force = 100;
let efficiency = 100;
const colors = [
  "#eb4034",
  "#eb7d34",
  "#ebb434",
  "#ebc934",
  "#bf5906",
  "#fa3807",
  "#fa9907",
  "#f5427b",
  "#bd0202",
  "#fc3200"
]

// Clamp value
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
// Random between 2 numbers
const randomIntFromInterval = (min, max) =>  Math.floor(Math.random() * (max - min + 1) + min);

function setup(){
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < circleAmount; i++) {
    const cl = colors[randomIntFromInterval(0, colors.length - 1)];
    const position = {
      x: randomIntFromInterval(0, width),
      y: randomIntFromInterval(0, height)
    }
    const direction = {
      a: randomIntFromInterval(-2, 2),
      b: randomIntFromInterval(-2, 2)
    }
    const radius = randomIntFromInterval(20, 60);
    const mass = radius / 10;
    circles.push(new Circle(cl, position, direction, radius, mass));  
    //circles.push(createBall());
  }
}

function draw(){
  updateSliderValues();
  background("black");
  stroke("black");

  circles.forEach(circle => {
    circle.a *= efficiency/100;
    circle.b *= efficiency/100;

    if (mouseIsPressed) {
      const mouseVect = mouseButton === LEFT ? createVector(mouseX - circle.x, mouseY - circle.y) : createVector(circle.x - mouseX, circle.y - mouseY);

      if (forceValue > 0) {
        const total = 10000/forceValue
        mouseVect.div(total);
        circle.a += mouseVect.x;
        circle.b += mouseVect.y;
      }
    }
    circle.render();
    circle.collisionCheck();
    circle.move();
    circles.forEach(circle2 => {
      if (circle === circle2) return;
      circle.ballCollide(circle2);
    })
  });
}

function updateSliderValues() {

  circleValue = document.getElementById("circleValue").innerHTML = document.getElementById("circleSlider").value;
  if (circleValue > circles.length) circles.push(createBall());
  if (circleValue < circles.length) circles.pop();

  forceValue = document.getElementById("forceValue").innerHTML = document.getElementById("forceSlider").value;
  efficiency = document.getElementById("efficiencyValue").innerHTML = document.getElementById("efficiencySlider").value;
  showVelocity = document.getElementById("showVelocity").checked;
}

function createBall() {
  const cl = colors[randomIntFromInterval(0, colors.length - 1)];
  const position = {
    x: randomIntFromInterval(0, width),
    y: randomIntFromInterval(0, height)
  }
  const direction = {
    a: randomIntFromInterval(-2, 2),
    b: randomIntFromInterval(-2, 2)
  }
  const radius = randomIntFromInterval(20, 60);
  const mass = radius / 10;
  return new Circle(cl, position, direction, radius, mass);
}

function keyPressed() {
  if (keyCode == 32) {
    hidden = !hidden;
  }
  if (hidden) {
    getElementsByClassName("sliders");

  }
}