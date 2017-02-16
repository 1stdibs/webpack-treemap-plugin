import {treemap} from 'd3-hierarchy';
import treeify from './treeify';

export const assetModules = (modules, asset) => {
    return modules.filter(item => {
        return item.chunks.some(chunk => {
            return asset.chunks.includes(chunk);
        }) && item.built;
    }).map(item => {
        return Object.assign({}, item, {
            name: item.name.split('/').reverse()
        });
    });
};

export const filterJsWithChunks = (assets) => {
    return assets.filter(item => {
        return /.js$/i.test(item.name) && item.chunks.length;
    });
};

export const reMap = (node, size, padding, paddingTop) => {
    const tm = treemap().size(size).padding(padding).paddingTop(paddingTop);
    return tm(node.sum(item => item.size).sort((a, b) => b.size - a.size)).descendants();
};

export const mapToTree = (stats, size, padding) => {
    const tm = treemap().size(size).padding(padding);
    return filterJsWithChunks(stats.assets).map(item => {
        return Object.assign({}, item, {
            modules: assetModules(stats.modules, item)
        });
    }).map((item) => {
        return treeify(item, tm);
    });
};


