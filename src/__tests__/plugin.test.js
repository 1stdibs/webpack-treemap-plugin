jest.mock('opn');
jest.mock('fs');
jest.mock('lodash.template');

const WebpackTreemapPlugin = require('../../plugin');
const fs = require('fs');
const opn = require('opn');

let callback = null;
const mockStats = {
    toJson: jest.fn(() => ({})) // return empty object from toJson
};
const mockCompiler = function () {
    if (callback) {
        callback(mockStats);
    }
};
mockCompiler.plugin = jest.fn((event, cb) => {
    callback = cb;
});

describe('WebpackTreemapPlugin', () => {

    afterEach(() => {
        callback = null;
        fs.writeFile.mockClear();
        fs.readFileSync.mockClear();
    });

    it('applies defaults', () => {
        const plugin = new WebpackTreemapPlugin();
        plugin.apply(mockCompiler);
        mockCompiler();
        expect(fs.writeFile).toHaveBeenCalledWith(
            expect.stringMatching(/\/webpack-treemap.html$/),
            expect.stringMatching(/contents of .*page.template/),
            expect.any(Function)
        );
    });

    it('opens file if openFile is true', () => {
        const plugin = new WebpackTreemapPlugin({ openFile: true });
        plugin.apply(mockCompiler);
        mockCompiler();
        expect(opn).toHaveBeenCalled();
    });

    it('names the html file', () => {
        const plugin = new WebpackTreemapPlugin({ filename: 'foo.html' });
        plugin.apply(mockCompiler);
        mockCompiler();
        expect(fs.writeFile).toHaveBeenCalledWith(
            expect.stringMatching(/\/foo.html$/),
            expect.stringMatching(/contents of .*page.template/),
            expect.any(Function)
        );
    });

    it('is no-op when options.noop is true', () => {
        const plugin = new WebpackTreemapPlugin({ noop: true });
        plugin.apply(mockCompiler);
        mockCompiler();
        expect(fs.writeFile).not.toHaveBeenCalled();
    });
});
