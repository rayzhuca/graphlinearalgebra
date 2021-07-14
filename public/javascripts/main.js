import { Vector } from "/javascripts/vector.js";
new Vector(); // force load
import { Matrix } from "/javascripts/matrix.js";
new Matrix([0, 0], [0, 0]);
import { Graph } from "/javascripts/graph.js";

Pts.quickStart("#pt", "#fff");

let currBound = new Bound();
const graph = new Graph();

let previousMatrix = Matrix.IDENTITY;
let transformMatrix = Matrix.IDENTITY;
let offsetTime = 0;
let lastTime = 0;

let vectors = new Map();
let matrices = new Map();

const easeInOut = t => t > 1 ? 1 : (t<.5 ? 2*t*t : -1+(4-2*t)*t);

space.add({
    animate: (time, ftime) => {
        lastTime = time;
        form.strokeOnly("#000", 1);
        graph.draw(currBound, vectors.values(), previousMatrix.interpolateBounded(transformMatrix, easeInOut((time-offsetTime)/1000)));
    },
    
    resize: (bound, evt) => {
        currBound = bound;
    },
    
    action: (type, x, y, evt) => {
        if (type === "move")
        graph.onMove(x, y);
    }
});

space.bindCanvas('wheel', (e) => {
    let delta = e.deltaY;
    e.preventDefault();
    if (e.ctrlKey)
        delta *= 50;
    graph.scale(1 + delta/(100 * 30));
}, { passive: false });

space.bindMouse().bindTouch().play();

// document.body.ontouchend = (e) => {
//     e.preventDefault();
// };

export const IDENTITY_MATRIX = Matrix.IDENTITY;

export function transform(matrix) {
    if (!matrix.valid) return;
    offsetTime = lastTime;
    previousMatrix = transformMatrix;
    transformMatrix = matrix;
}

/* MATRIX */
export function addMatrix(name, c0, c1) {
    const matrix = new Matrix(c0, c1);
    matrices.set(name, matrix);
}

export function deleteMatrix(name) {
    matrices.delete(name);
}

export function getMatrix(name) {
    return matrices.get(name);
}

export function getMatrices() {
    return matrices;
}

/* VECTOR */
export function addVector(name, x, y, color) {
    const vector = new Vector([x, y]);
    vector.color = color || "#ff0000";
    vectors.set(name, vector);
}

export function getVector(name) {
    return vectors.get(name);
}

export function deleteVector(name) {
    vectors.delete(name);
}

export function getVectors() {
    return vectors;
}

export function enableUnitVectors(bool) {
    graph.includeUnitVectors(bool);
}

export function enableDeterminantDisplay(bool) {
    graph.includeDeterminantDisplay(bool);
}

export function enableEigenVectorDisplay(bool) {
    graph.includeEigenVectorDisplay(bool);
}







//////// zoom gesture
let evCache = new Array();
let prevDiff = -1;

function pointerdown_handler(ev) {
    evCache.push(ev);
}

function pointermove_handler(ev) {    
    for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId == evCache[i].pointerId) {
            evCache[i] = ev;
            break;
        }
    }

    if (evCache.length == 2) {
        const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
        document.getElementById('log').innerHTML = (Math.round((prevDiff - curDiff) * 100)/(100))/100;

        if (prevDiff - curDiff < 0) {
            graph.scale(.93);    
        } else {
            graph.scale(1.07);    
        }

        prevDiff = curDiff;
    }
}

window.onerror = function(e) {
    alert(e);
}

function pointerup_handler(ev) {
    remove_event(ev);    
    if (evCache.length < 2) prevDiff = -1;
}

function remove_event(ev) {
    for (let i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}

document.getElementById('log').innerHTML = "shit";

const graphEle = document.getElementById('graph');
graphEle.addEventListener('pointerdown', pointerdown_handler);
graphEle.addEventListener('pointermove', pointermove_handler);
graphEle.addEventListener('pointerup', pointerup_handler);
graphEle.addEventListener('pointercancel', pointerup_handler);
graphEle.addEventListener('pointerout', pointerup_handler);
graphEle.addEventListener('pointerleave', pointerup_handler);