import {vec3} from 'gl-matrix';

const zeroPad = hex => {
    return hex.length === 1 ? `0${hex}` : hex;
};

const borderVector = vec3.fromValues(20, 20, 20);

export default class ColorCreator {
    constructor(colorVec, origin) {
        this.color = colorVec;
        this.base = this.createBase();
        this.origin = origin || vec3.fromValues(0, 0, 0);
        this.colorNormal = vec3.normalize(vec3.create(), this.color);
        this._children = 1;
        this.angle = 0.296706; // 17 degrees
    }
    createBase() {
        return this.createHash(vec3.add(vec3.create(), this.color, borderVector));
    }
    getHash() {
        return this.createHash(this.color);
    }
    createHash(color) {
        let colors = color.map(item => {
            const rounded = Math.abs(Math.round(item));
            return Math.max(Math.min(255, rounded), 0);
        }); // ensure valid color number
        colors = [colors[0], colors[1], colors[2]]; // because typed array
        return `#${colors.map(item => zeroPad(item.toString(16))).join('')}`; // create a hash from vector values bound between 0 and 255
    }
    lighten() {
        const clockWise = this._children % 2 === 0 ? -(this._children - 1) : this._children;
        let rotated = vec3.rotateZ(vec3.create(), this.colorNormal, this.origin, clockWise * this.angle); // rotate 15 degrees along z from previous point
        rotated = vec3.rotateY(vec3.create(), rotated, this.origin, clockWise * this.angle); // rotate 15 degrees along x from previous point
        rotated = vec3.rotateX(vec3.create(), rotated, this.origin, clockWise * this.angle); // rotate 15 degrees along y from previous point
        let vec = vec3.normalize(vec3.create(), rotated);
        vec = vec3.scale(vec3.create(), vec, 25);
        this._children++;
        return new ColorCreator(vec3.add(vec3.create(), this.color, vec), this.color); // add 5 unit vector to previous create new creator
    }
};
