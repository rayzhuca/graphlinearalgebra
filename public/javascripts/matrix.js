import { Vector } from "/javascripts/vector.js";

export class Matrix {

    constructor(c0, c1) {
        if (c0 === undefined || c1 === undefined || c0.length !== 2 || c0.length !== c1.length) console.error(`Invalid matrix c1 ${c0} c2 ${c1}`);
        this.c0 = c0;
        this.c1 = c1;
        this.c0r0 = c0[0];
        this.c0r1 = c0[1];
        this.c1r0 = c1[0];
        this.c1r1 = c1[1];
    }

    get valid() {
        return typeof this.c0r0 === "number" && typeof this.c0r1 === "number" && typeof this.c1r0 === "number" && typeof this.c1r1 === "number"
        && !Number.isNaN(this.c0r0 + this.c0r1 + this.c1r0 + this.c1r1);
    }

    get2DArray() {
        return [this.c0, this.c1];
    }

    multiplyByScalar(a) {
        return new Matrix([this.c0r0 * a, this.c1r0 * a], [this.c0r1 * a, this.c1r1 * a]);
    }

    multiplyByVector(v) { 
        return new Vector(
            [v.x*this.c0r0 + v.y*this.c1r0, v.x*this.c0r1 + v.y*this.c1r1]
        );
    }

    multiplyByMatrix(m) {
        // [c0r0 c1r0]
        // [c0r1 c1r1]
        // [a, b][e f] = [a*e+b*g, a*f+b*h  ]
        // [c, d][g h]   [c*e+d*g, c*f+d*h ]
        // const a = this.c0r0;
        // const b = this.c1r0;
        // const c = this.c0r1;
        // const d = this.c1r1;

        // const e = m.c0r0;
        // const f = m.c1r0;
        // const g = m.c0r1;
        // const h = m.c1r1;
        return new Matrix(
            [
                this.c0r0*m.c0r0+this.c1r0*m.c0r1, this.c0r0*m.c1r0+this.c1r0*m.c1r1
            ],
            [
                this.c0r1*m.c0r0+this.c1r1*m.c0r1, this.c0r1*m.c1r0+this.c1r1*m.c1r1
            ]
        );
    }

    interpolate(m, t) {
        // from a to b in t
        // (b-a)t + a
        return new Matrix(
            [
                (m.c0r0 - this.c0r0)*t + this.c0r0,
                (m.c0r1 - this.c0r1)*t + this.c0r1,
            ],
            [
                (m.c1r0 - this.c1r0)*t + this.c1r0,
                (m.c1r1 - this.c1r1)*t + this.c1r1,
            ]
        );
    }

    /**
     * interpolate but when t is > 1 = m and when t < 0 = this
     * 
     * 
     * @param {*} m matrix
     * @param {*} t time from [0, 1]
     * @returns 
     */
    interpolateBounded(m, t) {
        // from a to b in t
        // (b-a)t + a
        // [c0r0 c1r0]
        // [c0r1 c1r1]
        if (t < 0) return this;
        if (t > 1) return m;
        return new Matrix(
            [
                (m.c0r0 - this.c0r0)*t + this.c0r0,
                (m.c0r1 - this.c0r1)*t + this.c0r1,
            ],
            [
                (m.c1r0 - this.c1r0)*t + this.c1r0,
                (m.c1r1 - this.c1r1)*t + this.c1r1,
            ]
        );
    }

    getDeterminant() {
        return this.c0r0*this.c1r1 - this.c0r1*this.c1r0
    }

    toString() {
        // [a d]
        // [b c]
        return `[${this.c0r0} ${this.c0r1}]\n[${this.c1r0} ${this.c1r1}]`;
    }

    equals(m) {
        return this.c0r0 == m.c0r0 && this.c0r1 == m.c0r1 && this.c1r0 == m.c1r0 && this.c1r1 == m.c1r1;
    }
}

Matrix.IDENTITY = new Matrix([1, 0], [0, 1]);
Object.freeze(Matrix.IDENTITY);