import { Vector } from "/javascripts/vector.js";
import { Matrix } from "/javascripts/matrix.js";

export class Graph {
    constructor() {
        this.maxX = 10;
        this.maxY = 10;

        this.origin = new Pt(0, 0);
        this.hasUnitVectors = true;
        this.hasEigenVectorDisplay = false;
        this.hasDeterminantDisplay = false;
        this.lastCanvasBound = {
            height: -1,
            width: -1
        };
    }

    _drawText(text="", pos) {
        form.fill("#000").font(14, "normal").strokeOnly("#000", 1).text(pos, text, 100);
    }

    _getGraphBound() {
        const maxX = this.maxX;
        const maxY = this.maxY;
        return new Bound(new Pt(-maxX, maxY), new Pt(maxX, -maxY));
    }

    _getCanvasSquareBound(canvasBound) {
        if (canvasBound.height === this.lastCanvasBound.height && canvasBound.width === this.lastCanvasBound.width) {
            return this.lastCanvasSquareBound;
        }
        const bh = canvasBound.height;
        const bw = canvasBound.width;
        this.lastCanvasSquareBound = new Bound(new Pt(0, -(bw-bh)/2), new Pt(bw, bh + (bw-bh)/2));
        this.lastCanvasBound = canvasBound;
        return this.lastCanvasSquareBound;
    }

    _xCoordinateToPixel(x, bound) {
        const centerX = bound.center.x;
        return centerX + (x/this.maxX) * bound.width/2;
    }

    _yCoordinateToPixel(y, bound) {
        const centerY = bound.center.y;
        return centerY - (y/this.maxY) * bound.height/2;
    }

    _coordinateToPixel(p, bound) {
        return [this._xCoordinateToPixel(p[0], bound), this._yCoordinateToPixel(p[1], bound)];
    }

    _groupToPixel(g, bound) {
        let ret = [];
        for (const p of g) {
            ret.push(this._coordinateToPixel(p, bound))
        }
        return ret;
    }

    _drawHorizontalLine(y, bound, matrix) {
        const p = matrix.multiplyByVector(new Vector([0, y])).getRawVector(); 

        if (matrix.c0[1] !== 0 && matrix.c0[0] === 0) {
            const k = this._xCoordinateToPixel(y, bound);
            form.line([[k, 0], [k, bound.height]]);
            return;
        }

        const m = matrix.c0[1]/matrix.c0[0]; // ! TODO FIX!!!!!!
        const x1 = this.maxY;
        const p1 = [ -x1, p[1] - m * (p[0]+x1)];
        const p2 = [ x1, p[1] - m * (p[0]-x1)];
        form.line([this._coordinateToPixel(p1, bound), this._coordinateToPixel(p2, bound)]);
    }

    _drawVerticalLine(x, bound, matrix) {
        const p = matrix.multiplyByVector(new Vector([x, 0])).getRawVector();

        if (matrix.c1[1] !== 0 && matrix.c1[0] === 0) {
            
            const k = this._xCoordinateToPixel(p[0], bound);
            // form.stroke("black");
            form.line([[k, 0], [k, bound.height]]);
            return;
        }
        const m = matrix.c1[1]/matrix.c1[0];

        // y1=y-m(x-x1)
        const x1 = this.maxX;
        const p1 = [ -x1, p[1] - m * (p[0]+x1)];
        const p2 = [ x1, p[1] - m * (p[0]-x1)];
        form.line([this._coordinateToPixel(p1, bound), this._coordinateToPixel(p2, bound)]);
    }

    _drawLineFromP(p, bound) {
        if (p[1] !== 0 && p[0] === 0) {
            const k = this._xCoordinateToPixel(0, bound);
            form.line([[k, 0], [k, bound.height]]);
            return;
        }
        
        const m = p[1]/p[0];
        const x1 = this.maxX;
        const p1 = [-x1, p[1] - m * (p[0]+x1)];
        const p2 = [x1, p[1] - m * (p[0]-x1)];
        form.line([this._coordinateToPixel(p1, bound), this._coordinateToPixel(p2, bound)]);
    }

    _getLabelCoordStep(max) {
        let d = 0;
        if (max < 1) {
            while (max < 1) {
                max *= 10;
                d--;
            }
        } else {
            while (max > 10) {
                max /= 10;
                d++;
            }
        }
        max = Math.ceil(max);

        const c = [0.25, 0.25, 0.5, 0.5, 1, 1, 1, 2, 2, 2][max-1];
        return Math.pow(10, d) * c;
    }

    _drawGrids(matrix) {        
        // form.log(Math.round(this.maxX) + " " + Math.round(this.maxY));

        const squareCanvasBound = this._getCanvasSquareBound(this.canvasBound);

        const step = this._getLabelCoordStep(Math.max(this.maxX, this.maxY))/2;
        const useScientifcX = step >= 100_000;

        // background reference
        if (!matrix.equals(Matrix.IDENTITY)) {
            form.strokeOnly("#ddd", 1.2);
            this._drawHorizontalLine(0, squareCanvasBound, Matrix.IDENTITY);
            this._drawVerticalLine(0, squareCanvasBound, Matrix.IDENTITY);
        }
        this._drawWithCanvas(step, useScientifcX, squareCanvasBound, Matrix.IDENTITY, false, "#f5f5f5");

        // w/ matrix
        if (!matrix.equals(Matrix.IDENTITY)) {
            this._drawWithCanvas(step, useScientifcX, squareCanvasBound, matrix, true, "#DBEEFF");
        }
        form.strokeOnly("#389FFF", 1.2);
        this._drawHorizontalLine(0, squareCanvasBound, matrix);
        this._drawVerticalLine(0, squareCanvasBound, matrix);
    }

    _drawWithCanvas(step, useScientifcX, squareCanvasBound, matrix, noLabel, color) {
        const maxX = 2 * this.maxX; // TODO FIX
        const maxY = maxX * (this.maxY/this.maxX);

        form.alignText('center', 'middle');
        for (let i = step, k = 0; i <= maxX; i+=step, k++) {
            form.strokeOnly(color, 1);
            this._drawVerticalLine(i, squareCanvasBound, matrix);
            
            // x labels
            if (k % 2 == 0 || noLabel) continue;
            const p = matrix.multiplyByVector(new Vector([i, 0])).getRawVector();
            i = Math.round(i * 10000) / 10000;
            this._drawText(useScientifcX ? i.toExponential() : i, new Pt(this._xCoordinateToPixel(p[0], squareCanvasBound), this._yCoordinateToPixel(p[1], squareCanvasBound)+20));
        }

        for (let i = -step, k =0; i >= -maxX; i-=step, k++) {
            form.strokeOnly(color, 1);
            this._drawVerticalLine(i, squareCanvasBound, matrix);
            
            // x labels
            if (k % 2 == 0 || noLabel) continue;
            const p = matrix.multiplyByVector(new Vector([i, 0])).getRawVector();
            i = Math.round(i * 10000) / 10000;
            this._drawText(useScientifcX ? i.toExponential() : i, new Pt(this._xCoordinateToPixel(p[0], squareCanvasBound), this._yCoordinateToPixel(p[1], squareCanvasBound)+20));
        }

        for (let i = step, k =0 ; i <= maxY; i+=step, k++) {
            form.strokeOnly(color, 1);
            this._drawHorizontalLine(i, squareCanvasBound, matrix);

            // y labels
            if (k % 2 == 0 || noLabel) continue;
            const p = matrix.multiplyByVector(new Vector([0, i])).getRawVector();
            i = Math.round(i * 10000) / 10000;
            this._drawText(useScientifcX ? i.toExponential() : i, new Pt(this._xCoordinateToPixel(p[0], squareCanvasBound)-20, this._yCoordinateToPixel(p[1], squareCanvasBound)));
        }

        for (let i = -step, k = 0; i >= -maxY; i-=step, k++) {
            form.strokeOnly(color, 1);
            this._drawHorizontalLine(i, squareCanvasBound, matrix);

            // y labels
            if (k % 2 == 0 || noLabel) continue;
            const p = matrix.multiplyByVector(new Vector([0, i])).getRawVector();
            i = Math.round(i * 10000) / 10000;
            this._drawText(useScientifcX ? i.toExponential() : i, new Pt(this._xCoordinateToPixel(p[0], squareCanvasBound)-20, this._yCoordinateToPixel(p[1], squareCanvasBound)));
        }
    }

    includeUnitVectors(bool=true) {
        this.hasUnitVectors = bool;
    }

    includeDeterminantDisplay(bool=true) {
        this.hasDeterminantDisplay = bool;
    }

    includeEigenVectorDisplay(bool=true) {
        this.hasEigenVectorDisplay = bool;
    }



    _drawVector(v, color) {
        const squareCanvasBound = this._getCanvasSquareBound(this.canvasBound);
        const x = this._xCoordinateToPixel(v.x, squareCanvasBound);
        const y = this._yCoordinateToPixel(v.y, squareCanvasBound);

        const tip = new Pt(x, y);
        form.strokeOnly(color, 2);
        form.line([squareCanvasBound.center, tip]);

        form.fillOnly(color);
        let rotateAngle = Math.PI/2 - Math.atan(v.y/v.x);
        if (Number.isNaN(rotateAngle)) {
            rotateAngle = 0;
        } else if (v.x < 0) {
            rotateAngle += Math.PI;
        }
        form.polygon((Triangle.fromCenter(tip, 5)).rotate2D(rotateAngle, tip));
    }

    _drawVectors(vectors, matrix) {
        if (this.hasUnitVectors) {
            const iHat = Vector.getIHat(matrix)
            const jHat = Vector.getJHat(matrix)
            this._drawVector(iHat, "#00ff00");
            this._drawVector(jHat, "#0000ff");
            
        }
        for (let vector of vectors) {
            this._drawVector(matrix.multiplyByVector(vector), vector.color);
        }
    }

    _drawDeterminantDisplay(iHat, jHat) {
        const squareCanvasBound = this._getCanvasSquareBound(this.canvasBound);
        // form.stroke("#389FFF");
        form.fillOnly("rgba(38, 147, 255, 0.2)");
        form.polygon(
            Polygon.convexHull(
            this._groupToPixel([
                [0, 0], iHat.add(jHat).getPoint(), iHat.getPoint(), jHat.getPoint()
            ], squareCanvasBound))
        );
        // console.log((
        //     [
        //         [0, 0], iHat.getPoint(), jHat.getPoint(), iHat.add(jHat).getPoint()
        //     ]));
    }

    _drawEigenVectorDisplay(matrix) {
        const squareCanvasBound = this._getCanvasSquareBound(this.canvasBound);
        const eigs = math.eigs(matrix.get2DArray());

        // console.log(eigs);
        for (let i = 0; i < 2; i++) {
            const value = eigs.values[i];
            const vector = eigs.vectors[i];
            if (math.typeOf(vector[0]) === "Complex" || math.typeOf(vector[1]) === "Complex") {
                continue;
            }
            form.strokeOnly("#cc99ff");
            this._drawLineFromP(vector, squareCanvasBound);
        }
    }

    scaleX(factor) {
        this.maxX = this.maxX * factor;
    }

    scaleY(factor) {
        this.maxY = this.maxY * factor;
    }

    scale(factor) {
        this.scaleX(factor);
        this.scaleY(factor);
    }

    draw(canvasBound, vectors, matrix) {
        if (!canvasBound) error('form and bound not passed');
        if (matrix == undefined ) matrix = Matrix.IDENTITY;
        if (vectors == undefined) vectors = [];
        this.canvasBound = canvasBound;
        this._drawGrids(matrix);
        if (this.hasDeterminantDisplay) {
            this._drawDeterminantDisplay(Vector.getIHat().freeze(), Vector.getJHat().freeze());
            this._drawDeterminantDisplay(Vector.getIHat(matrix).freeze(), Vector.getJHat(matrix).freeze());
        }
        if (this.hasEigenVectorDisplay) {
            this._drawEigenVectorDisplay(matrix);
        }
        this._drawVectors(vectors, matrix);
    }
}