import ColorCreator from '../ColorCreator';
import {vec3} from 'gl-matrix';

describe('ColorCreator', () => {
    describe('#createBase', () => {
        it('returns a lighter color than this.color', () => {
            const cc = new ColorCreator(vec3.fromValues(155, 55, 44));
            const baseColor = cc.createBase();
            const firstNum = parseInt(baseColor.slice(1, 3), 16);
            const secondNum = parseInt(baseColor.slice(3, 5), 16);
            const thirdNum = parseInt(baseColor.slice(5, 7), 16);

            expect(firstNum > 155).toBeTruthy();
            expect(secondNum > 55).toBeTruthy();
            expect(thirdNum > 44).toBeTruthy();
        });
    });
    describe('#getHash', () => {
        it('returns a hash of this.color', () => {
            const cc = new ColorCreator(vec3.fromValues(155, 55, 44));
            expect(cc.getHash()).toEqual("#9b372c");
        });
    });
    describe('#createHash', () => {
        it('returns a hash value for the passed in color verctor', () => {
            const cc = new ColorCreator(vec3.fromValues(0, 0, 0));
            expect(cc.createHash(vec3.fromValues(0, 0, 0))).toEqual('#000000');
            expect(cc.createHash(vec3.fromValues(255, 255, 255))).toEqual('#ffffff');
            expect(cc.createHash(vec3.fromValues(155, 55, 44))).toEqual("#9b372c");
        });
    });
    describe('#lighten', () => {
        it('incrememnts the number of children', () => {
            const cc = new ColorCreator(vec3.fromValues(155, 55, 44));
            expect(cc._children).toEqual(1);
            cc.lighten();
            expect(cc._children).toEqual(2);
        });
        it('fans the child colors out by alternating 15 degree incrememnts and returns new colorCreators', () => {
            const cc = new ColorCreator(vec3.fromValues(155, 55, 44));
            let newcc = cc.lighten();
            expect(vec3.str(newcc.color)).toEqual('vec3(175.44561767578125, 68.601806640625, 48.686920166015625)');
            newcc = cc.lighten();
            expect(vec3.str(newcc.color)).toEqual('vec3(176.18377685546875, 59.89104461669922, 56.342010498046875)');
            newcc = cc.lighten();
            expect(vec3.str(newcc.color)).toEqual('vec3(165.0853271484375, 71.03019714355469, 60.31928253173828)');
            newcc = cc.lighten();
            expect(vec3.str(newcc.color)).toEqual('vec3(162.9428253173828, 62.66842269897461, 66.43004608154297)');
            newcc = cc.lighten();
            expect(vec3.str(newcc.color)).toEqual('vec3(160.9080810546875, 50.46075439453125, 67.86398315429688)');
        });
    });
});
