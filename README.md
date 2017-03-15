# webpack-treemap
Treemap plugin for webpack builds

## Installation:
```sh
// Using yarn
yarn add webpack-treemap --dev

// Using npm
npm install --save-dev webpack-treemap
```

## Usage:
to build a treemap just add this package to plugins in your webpackConfig and invoke it with a boolean. The boolean decides whether to make a treemap or pass a noop to webpack.  I recomend controlling this boolean with an environment variable. 

```js
webpackConfig.plugins.push();
module.exports = {
    // the rest of your webpack config

    plugins: [
        ... // the rest of your plugins
        require('webpack-treemap')(process.env.TREEMAP)
    ]
};

```

## Testing
tests are executed by jest
```
yarn test
```

