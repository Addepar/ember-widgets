/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
// TODO(igillis): This is deprecated
var pickFiles = require('broccoli-static-compiler');
// TODO(igillis): Deprecated, remove and use es6modules
var compileES6 = require('broccoli-es6-concatenator');
var es3Safe = require('broccoli-es3-safe-recast');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var less = require('broccoli-less-single');
var filterCoffeeScript = require('broccoli-coffee');
var wrap = require('./wrap');
var globals = require('./globals');

var addonTree = filterCoffeeScript(
  pickFiles('../app', {
    srcDir: '/',
    destDir: 'ember-widgets'
  }),
  // Do not remove. Without this the es6 modules transpiler has issues and
  // generates incorrect code.
  { bare: true }
);

var viewsTree = filterCoffeeScript(
  pickFiles('../app/views', {
    srcDir: '/',
    destDir: 'ember-widgets/views'
  }),
  // Do not remove. Without this the es6 modules transpiler has issues and
  // generates incorrect code.
  { bare: true }
);

// Compile templates
var templateTree = templateCompiler('../app/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'ember-widgets/templates'});

var sourceTree = mergeTrees([templateTree, viewsTree, addonTree], {overwrite: true});

// Does a few things:
//   - Generate global exports, like Ember.Widgets.ModalComponent
//   - Register all templates on Ember.TEMPLATES
//   - Register views and components with the container so they can be looked up
// Output goes into globals-output.js
var globalExports = globals(pickFiles(sourceTree, {
  srcDir: '/ember-widgets',
  destDir: '/'
}));

// Require.js module loader
var loader = pickFiles('../bower_components', {srcDir: '/loader.js', destDir: '/'});

var jsTree = mergeTrees([sourceTree, globalExports, loader]);

// Transpile modules
var compiled = compileES6(jsTree, {
  wrapInEval: false,
  loaderFile: 'loader.js',
  inputFiles: ['ember-widgets/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/js/ember-widgets.js',
  legacyFilesToAppend: ['globals-output.js']
});

// Wrap in a function which is executed
compiled = wrap(compiled);

// Compile LESS
var lessTree = pickFiles('../app/styles', {
  srcDir: '/',
  destDir: '/'
});
// FIXME(igillis): Rename to addon.less
var lessMain = 'ember-widgets.less';
var lessOutput = 'css/ember-widgets.css';
lessTree = less(lessTree, lessMain, lessOutput);

// Compile static files
var images = pickFiles('../public/images', {
  srcDir: '/',
  destDir: '/img'
});

module.exports = mergeTrees([es3Safe(compiled), lessTree, images]);
