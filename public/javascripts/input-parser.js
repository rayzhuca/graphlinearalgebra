import { Matrix } from "/javascripts/matrix.js";

let parser = math.parser();

export function parseMatrix(input, matrices, vectors) {
    let result;
    parser = math.parser();
    addVars(matrices, vectors);
    try {
        result = parser.evaluate(input);
    } catch (err) {
        return {matrix: Matrix.IDENTITY, err};
    }
    let size;
    try {
        size = result.size();
    } catch {
        return {matrix: Matrix.IDENTITY, err: 'Output is not a 2x2 matrix'};
    }
    if (size[0] == 2 && size[1] == 2) {
        return {matrix: new Matrix(result._data[0], result._data[1])};
    }
    return {matrix: Matrix.IDENTITY};
}

function addVars(m=[], v=[]) {
    m.forEach((v, i) => {
        parser.evaluate(`${i} = [${v.c0r0}, ${v.c0r1}; ${v.c1r0}, ${v.c1r1}]`);
    });
    v.forEach((v, i) => {
        parser.evaluate(`${i} = [${v.x}, ${v.y}]`);
    })
}