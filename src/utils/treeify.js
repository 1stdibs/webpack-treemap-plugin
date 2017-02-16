import Node from './Node';
import Deduper from './Deduper';
import {hierarchy} from 'd3-hierarchy';


export default (asset, tm) => {
    const tree = asset.modules.reduce((tr, module) => {
        module.name.pop();
        tr.add(module);
        return tr;
    }, new Node('.'));
    const deduper = tree.findDeduper();
    const hier = hierarchy(tree.toJson());
    const vis = tm(hier.sum(item => item.size).sort((a, b) => b.size - a.size)).descendants();
    return {
        height: hier.height,
        fullValue: vis[0].value,
        tree: hier,
        fullTree: hier,
        vis: vis,
        fullVis: vis,
        name: asset.name,
        chunkName: `${asset.chunkNames[0]}.js`,
        dupeCount: deduper instanceof Deduper ? deduper.paths.__deduperDedupeCount : 0
    };
};
