import {List} from 'immutable';
const DUPE_COLOR = "#a0000a";

export default class Deduper {
    constructor(paths, run) {
        this.paths = paths || {__deduperDedupeCount: 0}; // all descendant instances reference the same paths object
        this.run = run || List(); // all descendant instances get their own run list
    }
    pushToRun(name) {
        this.run = this.run.push(name);
    }
    addDupe(node, path) {
        this.paths.__deduperDedupeCount++;
        node.color = DUPE_COLOR;
        node.dupeName = path;
        if (this.paths[path].length > 1) {
            this.paths[path].push(node);
        } else {
            // if first dupe mark the node already found
            this.paths[path][0].color = DUPE_COLOR;
            this.paths[path][0].dupeName = path;
            this.paths[path].push(node);
        }
    }
    createPath(node) {
        const path = this.run.join('/');
        if (this.paths[path]) {
            this.addDupe(node, path);
        } else {
            this.paths[path] = [node];
        }
    }
}
