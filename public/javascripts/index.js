import { Vector } from "/javascripts/vector.js";
new Vector(0, 0); // force load
import { Matrix } from "/javascripts/matrix.js";
new Matrix([0, 0], [0, 0]);
import { Graph } from "/javascripts/graph.js";

Pts.quickStart("#pt", "#fff");

let currBound = new Bound();
const graph = new Graph();
graph.settings = {
    drawLabels: false
}

let previousMatrix = Matrix.IDENTITY;
let transformMatrix = Matrix.IDENTITY;
let offsetTime = 0;
let lastTime = 0;

const easeInOut = t => t > 1 ? 1 : (t<.5 ? 2*t*t : -1+(4-2*t)*t);
const vectors = [new Vector(2, 2)];
vectors[0].color = "#f00";

space.add({
    animate: (time, ftime) => {
        lastTime = time;
		form.strokeOnly("#000", 1);
    	graph.draw(currBound, vectors, previousMatrix.interpolateBounded(transformMatrix, easeInOut(((time-offsetTime)/1000)/2 )));
    },
    
    resize: (bound, evt) => {
        currBound = bound;
    },

    action: (type, x, y, evt) => {
        if (type === "move")
            graph.onMove(x, y);
    }
});

space.bindMouse().bindTouch().play();

// document.body.ontouchend = (e) => {
//     e.preventDefault();
// };

function animateRandomMatrix() {
    offsetTime = lastTime;
    previousMatrix = transformMatrix;
    transformMatrix = getRandomMatrice();
    console.log(transformMatrix);
}

setTimeout(() => {
    animateRandomMatrix();
    setInterval(animateRandomMatrix, 5000);
}, 1500);


function getRandomMatrice() {
    const r = 6;
    return new Matrix(
        [randomRange(-r, r), randomRange(-r, r)],
        [randomRange(-r, r), randomRange(-r, r)]
    );
}

function randomRange(a, b) {
    return Math.floor(Math.random() * (b-a+1)) + a;
}