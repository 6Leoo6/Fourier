const radius = 100;
const circleOffset = 200;
const distanceY = 150;
const dotSize = 20;
const waveAccuracy = 200;

const stretchX = 4;
const stretchY = 0.5;
const graphOffset = 100;

var circles = [1, 2, 3];
var waves = [];
var sumWave = Array(waveAccuracy);
var rotation = 0;

const sumYOffset = (circleOffset + radius + radius) * circles.length

function setup() {
    var canvas = createCanvas(windowWidth, 1500);
    background(0);
    fill(255);

    for (const i of circles) {
        waves.push(Array(waveAccuracy));
    }
}

function updateCircles() {
    noFill()
    stroke(255)

    let x = circleOffset;
    let y = sumYOffset;
    for (let freq of circles) {
        ellipse(x, y, radius * 2 *stretchY);

        x += cos(rotation * freq) * radius * stretchY;
        y += sin(rotation * freq) * radius * stretchY;
    }
    return [x, y];
}

function draw() {
    background(0);

    var endPoint = updateCircles();
    
    noFill();
    stroke(255, 0, 0);
    beginShape();
    vertex(...endPoint)
    for (const [x, y] of sumWave.entries()) {
        if (!y) break;
        
        vertex(x * stretchX + circleOffset + graphOffset + radius, y * stretchY+sumYOffset);
    }
    endShape();

    let sum = 0;
    for (const [i, hz] of circles.entries()) {
        noFill();
        stroke(255);
        strokeWeight(3);

        ellipse(circleOffset, distanceY + (circleOffset + radius) * i, radius * 2);

        fill(255, 0, 0);
        stroke(255, 0, 0);
        let cX = cos(rotation * hz) * radius + circleOffset;
        let cY = sin(rotation * hz) * radius + distanceY + (circleOffset + radius) * i;
        ellipse(cX, cY, dotSize);

        noFill();
        beginShape();
        vertex(cX, cY);
        for (const [x, y] of waves[i].entries()) {
            if (!y) break;

            vertex(x * stretchX + circleOffset + graphOffset + radius, y);
        }
        endShape();

        waves[i].pop();
        waves[i].unshift(cY);

        sum += sin(rotation * hz) * radius;
    }

    sumWave.pop();
    sumWave.unshift(sum);

    rotation += TWO_PI / (1000 / max(deltaTime, 1));
    rotation %= TWO_PI;
}
