"use strict";
const templateFunc = require('lodash.template');
const fs = require('fs');
const path = require('path');
const opn = require('opn');

const templateString = fs.readFileSync(path.resolve(__dirname, './page.template'), 'utf-8');
const js = fs.readFileSync(path.resolve(__dirname, './dist/bundle.js'), 'utf-8');
const css = fs.readFileSync(path.resolve(__dirname, './dist/styles.css'), 'utf-8');
const template = templateFunc(templateString);
const cleanJson = stats => {
    return JSON.stringify(stats)
        .replace(/</g, '\\u003c')
        .replace(/-->/g, '--\\>')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
};

class WebpackTreeMapPlugin {
    constructor({ filename = 'webpack-treemap.html', openFile = false, noop = false } = {}) {
        this.filename = path.resolve(process.cwd(), filename);
        this.openFile = openFile;
        this.noop = noop;
    }
    apply(compiler) {
        if (!this.noop) {
            compiler.plugin('done', rawStats => {
                const stats = cleanJson(rawStats.toJson());
                const html = template({ stats, js, css });
                fs.writeFile(this.filename, html, err => {
                    if (err) {
                        throw err;
                    }
                    if (this.openFile) {
                        opn(this.filename, { wait: false });
                    }
                });
            });
        }
    }
}

module.exports = WebpackTreeMapPlugin;
