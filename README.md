# webpack-treemap-plugin
Generate treemap charts of your webpack builds.

![Webpack Treemap Plugin Example](webpack-treemap-plugin.png?raw=true)

## Features
This webpack plugin generates an HTML file that displays a treemap chart of each bundle generated via your webpack configuration. Note that the charts are most useful as a tool to easily see what is taking up relative space in your bundles. Currently, it bases module percentages on pre-minified and ungzipped byte sizes. 

The chart is interactive and allows you to:

* load individual treemap charts of each bundle via a drop-down select;
* control tree depth using an interactive slider;
* see a clean separation between your source and your dependencies;
* drill down into specific modules;
* and view any duplicate packages (displayed in red).

## Installation:
```sh
# Using yarn
yarn add webpack-treemap-plugin --dev

# Using npm
npm install webpack-treemap-plugin --save-dev
```

## Usage:
To generate treemaps, require this package in your webpack config and add an instance of it to the plugins array. 

This plugin takes three options, see the comments in the example below:

```js
const WebpackTreemapPlugin = require('webpack-treemap-plugin');

module.exports = {
    // webpack config...,
    
    plugins: [
        // your plugins...,
        
        new WebpackTreemapPlugin({
            
            // If `noop` is true, the plugin won't run. This feature allows you to 
            // pass an environment variable when running webpack to ensure the plugin runs 
            // only when desired. Defaults to false.
            noop: process.env.RUN_TREEMAP !== 'true',

            // If `openFile` is true, the generated HTML file will open automatically 
            // in your default browser. It's recommended to use an enviroment variable 
            // to control this behavior. Defaults to false.
            openFile: process.env.OPEN_TREEMAP === 'true',

            // The `filename` options allows you to choose the name of the HTML file
            // that the plugin generates. Defaults to "webpack-treemap.html." 
            filename: `my-webpack-treemap.html`
        })
    ]
};
```

## Testing
Tests are executed by Jest.

```
yarn test
```

## Motivation
This package was heavily inspired by the [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer) package, which is excellent. However, it's encumbered by copyrighted software. We wanted an unencumbered solution. All parts of this software are licensed under the MIT license and come with no restrictions.

