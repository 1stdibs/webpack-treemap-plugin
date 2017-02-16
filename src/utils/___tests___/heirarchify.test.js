import * as heirarchify from '../heirarchify';
import {asset, modules, assets} from './fixtures/statsFixtures';

describe('assetModules', () => {
    it('splits and reverses the name', () => {
        const converted = heirarchify.assetModules(modules, asset);
        expect(converted[0].name).toEqual(['iim.jsx', 'src', '.']);
    });
    it('filters out assets not in the chunk', () => {
        const converted = heirarchify.assetModules(modules, asset);
        const chunk = asset.chunks[0];
        expect(converted.filter(item => item.chunks.includes(chunk)).length).toEqual(converted.length);
    });
    it('filters out assets not built', () => {
        const converted = heirarchify.assetModules(modules, asset);
        expect(modules.filter(item => !item.built).length).toEqual(1);
        expect(converted.filter(item => !item.built).length).toEqual(0);
    });
});

describe('filterJsWithChunks', () => {
    it('filters for js assets with more than one chunk', () => {
        expect(assets.length).toEqual(8);
        expect(heirarchify.filterJsWithChunks(assets).length).toEqual(2);
    });
});
