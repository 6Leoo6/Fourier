const weight = 3;

var state = -1;
var lastPoint = new Complex(0, 0);
var points = [];
var fPoints;
var original;
var drawnPath = [];
var l = 0;
var time = 0;

var maxCircle = document.getElementById("maxf");
maxCircle.addEventListener("input", changeMaxCircle);
var maxCircleN = document.getElementById("maxfn");

var circleVis = document.getElementById('circlevis')
circleVis.addEventListener('input', changeCircleVisibility)
var isCircleVisible = circleVis.checked

var pathVis = document.getElementById('pathvis')
pathVis.addEventListener('input', changePathVisibility)
var isPathVisible = pathVis.checked

var originalVis = document.getElementById('original')
originalVis.addEventListener('input', changeOriginalPathVisibility)
var isOriginalVisible = originalVis.checked

var speedRange = document.getElementById("speed");
speedRange.addEventListener("input", changeSpeed);
var speed = speedRange.value

document.onkeydown = function (event) {
    switch (event.key) {
        case "ArrowLeft":
            maxCircle.value = Number(maxCircle.value) - 1
            changeMaxCircle()
            break;
        case "ArrowRight":
            maxCircle.value = Number(maxCircle.value) + 1
            changeMaxCircle()
            break;
    }
};

function changeMaxCircle() {
    fPoints = original.slice(0, maxCircle.value);

    drawnPath = [];
    time = 0;
}

function changeCircleVisibility() {
    isCircleVisible = circleVis.checked
}

function changePathVisibility() {
    isPathVisible = pathVis.checked
}

function changeOriginalPathVisibility() {
    console.log(originalVis)
    isOriginalVisible = originalVis.checked
}

function changeSpeed() {
    speed = speedRange.value
    console.log(speed)
}

function setup() {
    var canvas = createCanvas(windowWidth - 300, windowHeight);
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(64);
    text("Rajzolj!", width / 2, height / 2);

    canvas.mousePressed(lineStarted);
}

function lineStarted() {
    points = [];

    state = 0;
    lastPoint = new Complex(mouseX - width / 2, mouseY - height / 2);
    points.push(lastPoint);

    background(0);
}

function mouseDragged() {
    if (state) return;

    stroke(255);
    strokeWeight(weight);
    line(lastPoint.re + width / 2, lastPoint.im + height / 2, mouseX, mouseY);
    lastPoint = new Complex(mouseX - width / 2, mouseY - height / 2);
    points.push(lastPoint);
}

function mouseReleased() {
    if (state) return;

    state = 1;

    fPoints = dft(points);
    fPoints.sort((a, b) => b.rad - a.rad);
    original = fPoints.slice(0);

    l = fPoints.length;

    drawnPath = [];
    time = 0;

    maxCircle.max = l;
    maxCircle.value = l;
    maxCircleN.innerText = l;
}

function updateCircles() {
    let x = width / 2;
    let y = height / 2;
    for (let c of fPoints) {
        if(isCircleVisible) ellipse(x, y, c.rad * 2);

        x += cos(time * c.freq + c.offSet) * c.rad;
        y += sin(time * c.freq + c.offSet) * c.rad;
    }
    return [x, y];
}

function draw() {
    if (state === 1) {
        background(0);
        noFill();
        stroke(255);
        let end = updateCircles();
        drawnPath.push(end);

        if(isPathVisible) {
            beginShape();
            noFill();
            stroke(0, 0, 255);
            for (let p of drawnPath) {
                vertex(...p);
            }
            endShape();
        }

        if(isOriginalVisible) {
            beginShape();
            noFill();
            stroke(255, 0, 0);
            for (let p of points) {

                vertex(p.re+width/2, p.im+height/2);
            }
            endShape();
        }
        

        if (time > TWO_PI) {
            time = 0;
            drawnPath = [];
        }
        time += TWO_PI / l * speed;
    }
}
