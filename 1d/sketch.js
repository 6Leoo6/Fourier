const drawWindowWidth = 800;
const drawWindowHeight = 400;
const arraySize = 200;
const sumOffsetY = 800;
const stretch = 4;

var state = 0;
var points = Array(arraySize).fill(drawWindowHeight / 2);
var fPoints;
var rotation;
var sumWave = Array(arraySize);

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    background(0);
    strokeWeight(3);

    fill(255);
    rect(0, 0, drawWindowWidth, drawWindowHeight);

    fill(0);
    textAlign(CENTER);
    textSize(64);
    text("Rajzolj!", drawWindowWidth / 2, drawWindowHeight / 2);
}

function mousePressed() {
    if (mouseX <= drawWindowWidth && mouseY <= drawWindowHeight) {
        state = 1;
        points[Math.floor(mouseX / (drawWindowWidth / arraySize))] = mouseY - drawWindowHeight / 2;
    }
}

function mouseDragged() {
    if (mouseX <= drawWindowWidth && mouseY <= drawWindowHeight) {
        points[Math.floor(mouseX / (drawWindowWidth / arraySize))] = mouseY - drawWindowHeight / 2;
    }
}

function mouseReleased() {
    state = 2;
    fPoints = dft(points);
    fPoints = fPoints.sort((a, b) => b.rad - a.rad);
    rotation = 0;
    sumWave = Array(arraySize);
}

function updateCircles() {
    let x = 300;
    let y = drawWindowHeight + 300;
    for (let c of fPoints) {
        if (!c) break;

        stroke(255);
        ellipse(x, y, c.rad * 2);

        x += cos(rotation * c.freq + c.offset) * c.rad;
        y += sin(rotation * c.freq + c.offset) * c.rad;
    }
    return [x, y];
}

function epiCycles(x, y, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].rad;
        let phase = fourier[i].offset;
        x += radius * cos(freq * rotation + phase);
        y += radius * sin(freq * rotation + phase);

        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255);
        line(prevx, prevy, x, y);
    }
    return [x, y];
}

function draw() {
    if (state > 0) {
        background(0);
        fill(255);
        noStroke();
        rect(0, 0, drawWindowWidth, drawWindowHeight);

        stroke(255, 0, 0);
        noFill();
        beginShape();
        for (const [x, y] of points.entries()) {
            vertex((drawWindowWidth / arraySize) * x, y + drawWindowHeight / 2);
        }
        endShape();

        if (state === 2) {
            //let pos = updateCircles();
            let pos = epiCycles(300, 800, fPoints);

            stroke(255, 0, 0);
            beginShape();
            vertex(...pos);
            for (const [x, y] of sumWave.entries()) {
                if (!y) break;
                vertex(x * 10 + 500, y);
            }
            endShape();

            sumWave.pop();
            sumWave.unshift(pos[1]);

            rotation += TWO_PI / fPoints.length;
            rotation %= TWO_PI;
        }
    }
}
