"use strict";
const templateFunc = require('lodash.template');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.resolve(__dirname, './page.template'), 'utf-8');
let notCompiled = true;

const opn = require('opn');
const apply = (compiler) => {
    compiler.plugin('done', (stats) => {
        if (notCompiled) {
            const stj = stats.toJson();
            const fileName = path.resolve(process.cwd(), 'wp-treemap.html');
            fs.writeFile(fileName, templateFunc(template)({
                stats: JSON.stringify(stj).replace(/</g, '\\u003c')
                                        .replace(/-->/g, '--\\>')
                                        .replace(/\u2028/g, '\\u2028')
                                        .replace(/\u2029/g, '\\u2029'),
                js: path.resolve(__dirname, './dist/bundle.js'),
                stylesheet: path.resolve(__dirname, './dist/styles.css')
            }), () => {
                opn(fileName, {wait: false});
                notCompiled = false;
            });
        }
    });
};

module.exports = (makeTreeMap) => {
    return {
        apply: makeTreeMap ? apply : () => {}
    };
};

