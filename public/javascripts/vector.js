export class Vector {

    length = 2;
    
    constructor(p, y) {
        if (y !== undefined) {
            p = [p, y];
        }
        if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) console.error(`Invalid values x ${p[0]} y ${p[1]}`);
        [this.x, this.y] = p;
        this.p = [this.x, this.y];
        this[0] = this.x;
        this[1] = this.y;
    }

    static getIHat(matrix) {
        if (matrix === undefined) return Vector.IHAT;
        return matrix.multiplyByVector(Vector.IHAT);
    }

    static getJHat(matrix) {
        if (matrix === undefined) return Vector.JHAT;
        return matrix.multiplyByVector(Vector.JHAT);
    }

    clone() { 
        return new Vector(this.x, this.y);
    }
    
    add(b) {
        if (typeof b === 'number') {
            return new Vector(this.x + b, this.y + b);
        }
        return new Vector(this.x + b[0], this.y + b[1]);
    }
    
    subtract(b) {
        if (typeof b === 'number') {
            return new Vector(this.x - b, this.y - b);
        }
        return new Vector(this.x - b[0], this.y - b[1]);
    }
    
    multiply(b) {
        return new Vector(b * this.x, b * this.y);
    }
    
    divide(b) {
        return new Vector(this.x / b, this.y / b);
    }
    
    dot(b) {
        return this.x * b[0] + this.y * b[1];
    }

    cross(b) {
        return this.x * b[1] - b[0] * this.y;
    }
    
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    unit(magnitude) {
        return this.divide(this.magnitude()) * magnitude;
    }
    
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }
    
    max() {
        return Math.max(this.x, this.y);
    }
    
    min() {
        return Math.min(this.x, this.y);
    }
    
    sum() {
        return this.x + this.y;
    }
    
    map(f) {
        return new Vector(f(this.x), f(this.y));
    }

    forEach(f) {
        f(this.x);
        f(this.y);
    }

    toString() {
        return `Vector (${this.p[0]}, ${this.p[1]})`;
    }

    equals(b) {
        return this.x === b[0] && this.y === b[1];
    }
}

Vector.IHAT = new Vector(1, 0);
Vector.JHAT = new Vector(0, 1);
Object.freeze(Vector.IHAT);
Object.freeze(Vector.JHAT);