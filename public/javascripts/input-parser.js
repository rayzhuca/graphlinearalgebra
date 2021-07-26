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
    
    if (size.length === 2 && size[0] === 2 && size[1] === 2) {
        const matrix = new Matrix(  
            [result._data[0][0], result._data[1][0]],
            [result._data[0][1], result._data[1][1]]
        );

        let errFound = false;
        matrix.forEach(v => {
            if (math.typeOf(v) !== 'number') {
                errFound = {matrix: Matrix.IDENTITY, err: 'Output matrix values is not real'};
            }
        });

        if (errFound) return errFound;

        return {matrix};
    }
    return {matrix: Matrix.IDENTITY};
}

export function parseVector(input, matrices, vectors) {
    let result;
    parser = math.parser();
    addVars(matrices, vectors);
    try {
        result = parser.evaluate(input);
    } catch (err) {
        return undefined;
    }
    let size;
    try {
        size = result.size();
    } catch {
        return undefined;
    }

    if (size.length === 1) {
        return result._data; 
    }
    return undefined;
}

export function parseNumber(input, matrices, vectors) {
    let result;
    parser = math.parser();
    addVars(matrices, vectors);
    try {
        result = parser.evaluate(input);
    } catch (err) {
        return undefined;
    }

    if (math.typeOf(result) !== "number") {
        return undefined;
    }

    if (result < 0.000001 && result > 0) return 0;
    if (result < 0 && result > 0.000001) return 0;
    return result;
}

function addVars(m=[], v=[]) {
    m.forEach((v, i) => {
        parser.evaluate(`${i} = [${v.c0r0}, ${v.c1r0}; ${v.c0r1}, ${v.c1r1}]`);
    });
    v.forEach((v, i) => {
        parser.evaluate(`${i} = [${v.x}, ${v.y}]`);
    })
}