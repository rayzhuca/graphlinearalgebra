export class Vector {
    
    constructor(p) {
        this.p = p;
        this.frozen = false;
    }

    get x() {
        return this.p[0];
    }

    get y() {
        return this.p[1];
    }

    static of(p) {
        return new Vector(p);
    }

    static ofFrozen(p) {
        return new Vector(p).freeze();
    }

    static getIHat(matrix) {
        if (matrix === undefined) return new Vector([1, 0]);
        return matrix.multiplyByVector(this.getIHat());
    }

    static getJHat(matrix) {
        if (matrix === undefined) return new Vector([0, 1]);
        return matrix.multiplyByVector(this.getJHat());
    }

    getPoint() {
        return this.p;
    }

    getRawVector() {
        return this.p;
    }

    clone() { 
        return new Vector(this.p[0], this.p[1]);
    }
    
    freeze() {
        this.frozen = true;
        return this;
    }

    unfreeze() {
        this.frozen = false;
        return this;
    }
    
    /**
    * Add `b` to vector `a`.
    * @returns vector `a`
    */
    add( b ) {
        if (this.frozen) {
            if (b.p) {
                return new Vector([this.x + b.p[0], this.y + b.p[1]]);
            } else {
                return new Vector([this.x + b[0], this.y + b[1]]);
            }
        }
        return new Vector(Vec.add(this.p, b.p || b));
    }
    
    /**
    * Subtract `b` from vector `a`.
    * @returns vector `a`
    */
    subtract( b ) {
        if (this.frozen) {
            return new Vector(Vec.subtract(this.clone(), b.p || b));
        }
        return new Vector(Vec.subtract(this.p, b.p || b));
    }
    
    /**
    * Multiply `b` with vector `a`.
    * @returns vector `a`
    */
    multiply( b ) {
        if (this.frozen) {
            return new Vector(Vec.multiply(this.clone(), b.p || b));
        }
        return new Vector(Vec.multiply(this.p, b.p || b));
    }
    
    
    /**
    * Divide `a` over `b`.
    * @returns vector `a`
    */
    divide( b ) {
        if (this.frozen) {
            return new Vector(Vec.divide(this.clone(), b.p || b));
        }
        return new Vector(Vec.divide(this.p, b.p || b));
    }
    
    
    /**
    * Dot product of `a` and `b`.
    */
    dot(  b ) {
        if (this.frozen) {
            return Vec.dot(this.clone(), b.p || b);
        }
        return Vec.dot(this.p, b.p || b);
    } 
    
    
    /**
    * 2D cross product of `a` and `b`.
    */
    cross( b ) {
        if (this.frozen) {
            return Vec.cross2D(this.clone(), b.p || b);
        }
        return Vec.cross2D(this.p, b.p || b);
    }
    
    
    /**
    * Magnitude of `a`.
    */
    magnitude( ) {
        if (this.frozen) {
            return Vec.magnitude(this.clone());
        }
        return Vec.magnitude(this.p);
    }
    
    
    /**
    * Unit vector of `a`. If magnitude of `a` is already known, pass it in the second paramter to optimize calculation.
    */
    unit( magnitude ) {
        if (this.frozen) {
            return new Vector(Vec.unit(this.clone()));
        }
        return new Vector(Vec.unit(magnitude));
    }
    
    
    /**
    * Set `a` to its absolute value in each dimension.
    * @returns vector `a`
    */
    abs( ) {
        if (this.frozen) {
            return new Vector(Vec.abs(this.clone()));
        }
        return new Vector(Vec.abs(this.p));
    }
    
    
    /**
    * Set `a` to its floor value in each dimension.
    * @returns vector `a`
    */
    floor( ) {
        if (this.frozen) {
            return new Vector(Vec.floor(this.clone()));
        }
        return new Vector(Vec.floor(this.p));
    }
    
    
    /**
    * Set `a` to its ceiling value in each dimension.
    * @returns vector `a`
    */
    ceil( ) {
        if (this.frozen) {
            return new Vector(Vec.ceil(this.clone()));
        }
        return new Vector(Vec.ceil(this.p));
    }
    
    
    /**
    * Set `a` to its rounded value in each dimension.
    * @returns vector `a`
    */
    round(  ) {
        if (this.frozen) {
            return new Vector(Vec.round(this.clone()));
        }
        return new Vector(Vec.round(this.p));
    }
    
    
    /**
    * Find the max value within a vector's dimensions.
    * @returns an object with `value` and `index` that specifies the max value and its corresponding dimension.
    */
    max(  ) {
        if (this.frozen) {
            return Vec.max(this.clone());
        }
        return Vec.max(this.p);
    }
    
    
    /**
    * Find the min value within a vector's dimensions.
    * @returns an object with `value` and `index` that specifies the min value and its corresponding dimension.
    */
    min(  ) {
        if (this.frozen) {
            return Vec.min(this.clone());
        }
        return Vec.min(this.p);
    }
    
    
    /**
    * Add up all the dimensions' values and returns a scalar of the sum.
    */
    sum(  ) {
        if (this.frozen) {
            return Vec.sum(this.clone());
        }
        return Vec.sum(this.p);
    }
    
    
    /**
    * Given a mapping function, update `a`'s value in each dimension.
    * @returns vector `a`
    */
    map( fn ) {
        if (this.frozen) {
            return new Vector(Vec.map(this.clone(), fn));
        }
        return new Vector(Vec.map(this.p, fn));
    }

    toString() {
        return `Vector (${this.p[0]}, ${this.p[1]}),${this.frozen ? '': ' not'} frozen`;
    }
}