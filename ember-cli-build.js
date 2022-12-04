'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*'],
    },

    'ember-composable-helpers': {
      only: ['sort-by'],
    },

    postcssOptions: {
      compile: {
        plugins: [
          require('postcss-import')({ path: ['node_modules'] }),
          require('tailwindcss')('app/tailwind.config.js'),
          require('autoprefixer'),
        ],
        cacheInclude: [/.*\.(css|hbs|html|js)$/, /.tailwind\.config\.js$/],
      },
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    // `ember-animated` blows up when this is turned on.
    // staticHelpers: true,
    staticModifiers: true,
    // `ember-modal-dialog` blows up when this is turned on.
    // staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
  });
};
