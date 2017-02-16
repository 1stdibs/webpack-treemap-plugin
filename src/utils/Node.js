import ColorCreator from './ColorCreator';
import Deduper from './Deduper';
import {vec3} from 'gl-matrix';

const START_COLORS = [
    vec3.fromValues(8, 23, 140),
    vec3.fromValues(49, 158, 90)
];

export default class Node {
    constructor(name, deduper, colorCreator) {
        if (deduper) {
            this.deduper = new Deduper(deduper.paths, deduper.run);
            this.deduper.pushToRun(name);
        }
        this.name = name;
        this.children = [];
        this.size = 0;
        this.colorCreator = colorCreator || new ColorCreator(START_COLORS[0]);
        this.baseColor = this.colorCreator.base;
        this.color = this.colorCreator.getHash();
    }

    handleLeafnode(size) {
        if (this.deduper) {
            this.deduper.createPath(this);
        }
        this.size += size;
    }

    createChild(addingName, module) {
        let deduper = this.deduper;
        let newColors;
        if (addingName === '~') {
            deduper = new Deduper(this.deduper ? this.deduper.paths : undefined); // start a new run at every node modules directory
            newColors = new ColorCreator(START_COLORS[1]);
        } else {
            newColors = this.colorCreator.lighten();
        }
        const newNode = new Node(addingName, deduper, newColors);
        newNode.add(module);
        this.children.push(newNode);
    }

    handleTrunkNode(module) {
        const addingName = module.name.pop();
        const child = this.children.find(item => item.name === addingName);
        if (child) {
            child.add(module);
        } else {
            this.createChild(addingName, module);
        }
    }

    add(module) {
        if (module.name.length) {
            this.handleTrunkNode(module);
        } else {
            this.handleLeafnode(module.size);
        }
        return this;
    }

    findDeduper() {
        if (!this.deduper) {
            return this.children.reduce((memo, item) => {
                return item.findDeduper();
            });
        }
        return this.deduper;
    }

    toJson() {
        return {
            dupeName: this.dupeName,
            name: this.name,
            size: this.size,
            color: this.color,
            baseColor: this.baseColor,
            children: this.children.map(child => child.toJson())
        };
    }
};
