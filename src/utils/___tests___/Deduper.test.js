import Deduper from '../Deduper';
import {List} from 'immutable';

describe('Deduper', () => {
    describe('contructor', () => {
        it('defaults paths to an object with a __deduperDedupeCount', () => {
            const deduper = new Deduper();
            expect(deduper.paths.__deduperDedupeCount).toEqual(0);
        });
        it('sets the path to an instance of a list', () => {
            const deduper = new Deduper();
            expect(List.isList(deduper.run)).toBeTruthy();
        });
    });
    describe('pushToRun', () => {
        it('pushes the current name to the run', () => {
            const deduper = new Deduper();
            deduper.pushToRun('dirName');
            deduper.pushToRun('fileName');
            expect(deduper.run.get(0)).toEqual('dirName');
            expect(deduper.run.get(1)).toEqual('fileName');
        });
    });
    describe('addDupe', () => {
        it('increments the dupeCount', () => {
            const path = 'a/path';
            const deduper = new Deduper({__deduperDedupeCount: 1, [path]: [{}]});
            const node = {};
            deduper.addDupe(node, path);
            expect(deduper.paths.__deduperDedupeCount).toEqual(2);
        });
        it('modifies the node with color and path', () => {
            const path = 'a/path';
            const deduper = new Deduper({__deduperDedupeCount: 1, [path]: [{}]});
            const node = {};
            deduper.addDupe(node, path);
            expect(node.color).toEqual("#a0000a");
            expect(node.dupeName).toEqual(path);
        });
        describe('when there is more than one dupe', () => {
            it('pushes the node to this.paths[path]', () => {
                const path = 'a/path';
                const deduper = new Deduper({__deduperDedupeCount: 2, [path]: [{}, {}]});
                const node = {};
                deduper.addDupe(node, path);
                expect(deduper.paths[path].length).toEqual(3);
            });
        });
        describe('when there is only one dupe', () => {
            it('updates the dupe already in place', () => {
                const path = 'a/path';
                const deduper = new Deduper({__deduperDedupeCount: 1, [path]: [{}]});
                const node = {};
                deduper.addDupe(node, path);
                expect(deduper.paths[path][0].color).toEqual('#a0000a');
                expect(deduper.paths[path][0].dupeName).toEqual(path);
            });
            it('pushes the node to this.paths[path]', () => {
                const path = 'a/path';
                const deduper = new Deduper({__deduperDedupeCount: 1, [path]: [{}]});
                const node = {};
                deduper.addDupe(node, path);
                expect(deduper.paths[path].length).toEqual(2);
            });
        });
    });
    describe('createPath', () => {
        it('calls addDupe if the path exists already', () => {
            const path = 'a/path';
            const deduper = new Deduper({[path]: [{}]}, List(['a', 'path']));
            const node = {};
            deduper.addDupe = jest.fn();
            deduper.createPath(node);
            expect(deduper.addDupe.mock.calls.length).toEqual(1);
            expect(deduper.addDupe.mock.calls[0][0]).toEqual(node);
            expect(deduper.addDupe.mock.calls[0][1]).toEqual(path);
        });
        it('creates a new entry if it does not exist', () => {
            const path = 'a/path';
            const deduper = new Deduper({}, List(['a', 'path']));
            const node = {};
            deduper.addDupe = jest.fn();
            deduper.createPath(node);
            expect(deduper.addDupe.mock.calls.length).toEqual(0);
            expect(deduper.paths[path][0]).toEqual(node);
        });
    });
});
