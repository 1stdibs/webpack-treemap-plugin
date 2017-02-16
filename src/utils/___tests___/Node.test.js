import Node from '../Node';
import Deduper from '../Deduper';
import ColorCreator from '../ColorCreator';
import {vec3} from 'gl-matrix';
import {List} from 'immutable';

describe('Node', () => {
    describe('constructor', () => {
        it('sets the name', () => {
            const node = new Node('name');
            expect(node.name).toEqual('name');
        });
        it('instantiates children to an empty array', () => {
            const node = new Node('name');
            expect(node.children.length).toEqual(0);
        });
        it('sets the size to 0', () => {
            const node = new Node('name');
            expect(node.size).toEqual(0);
        });
        it('sets the base color and color', () => {
            const node = new Node('name');
            expect(node.color).toEqual('#08178c');
            expect(node.baseColor).toEqual('#1c2ba0');
        });
        describe('when a Deduper is passed in', () => {
            it('creates a new deduper and pushes the current node name to the run', () => {
                const paths = {};
                const run = List(['a', 'file']);
                const node = new Node('name', new Deduper(paths, run));
                expect(node.deduper.paths).toEqual(paths);
                expect(node.deduper.run.last()).toEqual('name');
            });
        });
        describe('when a color creator is passed in', () => {
            it('uses the passed in color creator', () => {
                const node = new Node('name', new Deduper(), new ColorCreator(vec3.fromValues(0, 0, 0)));
                expect(node.color).toEqual('#000000');
            });
        });
        describe('when a color creator is not passed in', () => {
            it('uses the default color', () => {
                const node = new Node('name', new Deduper());
                expect(node.color).toEqual('#08178c');
            });
        });
    });
    describe('handleLeafNode', () => {
        it('sets the size to of the node', () => {
            const node = new Node('name');
            node.handleLeafnode(50);
            expect(node.size).toEqual(50);
        });
        describe('when there is a deduper', () => {
            it('calls deduper.createPath on itself', () => {
                const deduper = new Deduper();
                const node = new Node('name', deduper);
                node.deduper.createPath = jest.fn();
                node.handleLeafnode(50);
                expect(node.deduper.createPath.mock.calls[0][0]).toEqual(node);
            });
        });
    });

    describe('createChild', () => {
        describe('when the current directory is ~', () => {
            it('starts a new deduper', () => {
                const node = new Node('.');
                node.createChild('~', {name: ['name']});
                expect(node.children[0].deduper).toEqual(jasmine.any(Deduper));
            });
            it('passes the current deduper paths object to the new one if it exists', () => {
                const deduper = new Deduper();
                const node = new Node('.', deduper);
                node.createChild('~', {name: ['name']});
                expect(node.children[0].deduper.paths).toEqual(deduper.paths);
            });
            it('sets the color the second start color', () => {
                const node = new Node('.');
                node.createChild('~', {name: ['name']});
                expect(node.children[0].color).toEqual('#319e5a');
            });
        });
        it('creates a new node with a lightened color', () => {
            const node = new Node('.');
            node.createChild('name', {name: []});
            expect(node.children[0].color).toEqual('#0f14a4');
        });
        it('calls add on that new node', () => {
            const node = new Node('.');
            node.createChild('first', {name: ['second']});
            expect(node.children[0].children[0].name).toEqual('second');
        });
        it('passes the new node to children', () => {
            const node = new Node('.');
            expect(node.children.length).toEqual(0);
            node.createChild('first', {name: ['second']});
            expect(node.children.length).toEqual(1);
        });
    });

    describe('handleTrunkNode', () => {
        describe('when it already has the directory in children', () => {
            it('passes the module to that child', () => {
                const node = new Node('name');
                const child = new Node('something');
                const module = {name: ['something else', 'something']};
                child.add = jest.fn();
                node.children = [child];
                node.handleTrunkNode(module);
                expect(child.add.mock.calls[0][0]).toEqual(module);
            });
        });
        describe('when it doesnt have a matching child', () => {
            it('calls createChild', () => {
                const node = new Node('name');
                const module = {name: ['something else', 'something']};
                node.createChild = jest.fn();
                node.handleTrunkNode(module);
                expect(node.createChild.mock.calls[0][0]).toEqual('something');
                expect(node.createChild.mock.calls[0][1]).toEqual(module);
            });
        });
    });
    describe('add', () => {
        it('returns the node', () => {
            const node = new Node('name');
            expect(node.add({name: []})).toEqual(node);
        });
        describe('when there are no names left', () => {
            it('calls handleLeafNode', () => {
                const node = new Node('.');
                node.handleLeafnode = jest.fn();
                node.add({name: [], size: 50});
                expect(node.handleLeafnode.mock.calls[0][0]).toEqual(50);
            });
        });
        describe('when there are names left', () => {
            it('calls handleTrunkNode', () => {
                const node = new Node('.');
                const module = {name: ['name'], size: 50};
                node.handleTrunkNode = jest.fn();
                node.add(module);
                expect(node.handleTrunkNode.mock.calls[0][0]).toEqual(module);
            });
        });
    });

    describe('findDeduper', () => {
        it('does depth first search to find the first deduper instance in the tree', () => {
            const node = new Node('.');
            node.add({name: ['path', 'some']});
            node.add({name: ['path', 'another']});
            node.add({name: ['path', 'different', 'some']});
            node.add({name: ['path', 'deduper', '~']});
            node.add({name: ['path', ' another', 'deduper', '~']});
            node.add({name: ['path', ' ~', 'deduper', '~']});
            expect(node.findDeduper()).toEqual(jasmine.any(Deduper));
        });
    });

    describe('toJson', () => {
        it('returns a json version of the tree', () => {
            const node = new Node('.');
            node.add({name: ['second', 'first'], size: 50});
            expect(node.toJson()).toEqual({
                dupeName: undefined,
                name: '.',
                size: 0,
                color: '#08178c',
                baseColor: "#1c2ba0",
                children: [
                    {
                        dupeName: undefined,
                        name: 'first',
                        size: 0,
                        color: '#0f14a4',
                        baseColor: '#2328b8',
                        children: [
                            {
                                dupeName: undefined,
                                name: 'second',
                                size: 50,
                                color: '#0127a7',
                                baseColor: '#133bbb',
                                children: []
                            }
                        ]
                    }
                ]
            });
        });
    });
});
