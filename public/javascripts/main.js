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
});

space.bindCanvas('wheel', (e) => {
	graph.scale(1 + e.deltaY/(100 * 30));
}, false);

space.bindMouse().bindTouch().play();

document.body.ontouchend = (e) => {
    e.preventDefault();
};

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