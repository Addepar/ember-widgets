/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var pickFiles = require('broccoli-static-compiler');
var compileES6 = require('broccoli-es6-concatenator');
var es3Safe = require('broccoli-es3-safe-recast');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var less = require('broccoli-less-single');
var filterCoffeeScript = require('broccoli-coffee');
var registry = require('./registry');
var wrap = require('./wrap');
var globals = require('./globals');

// Compile coffeescript
var appTree = filterCoffeeScript(
  pickFiles('../app', {
    srcDir: '/',
    destDir: 'app'
  }),
  // Do not remove. Without this the es6 modules transpiler has issues and
  // generates incorrect code.
  {bare: true}
);

// compile templates
var templateTree = templateCompiler('../app/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app/templates'});

var precompiled = mergeTrees([templateTree, appTree], {overwrite: true});

// Register components, controllers, etc. on the application container.
// Output goes to registry-output.js
var registrations = registry(pickFiles(precompiled, {srcDir: '/app', destDir: '/'}));

// Generate global exports for components, mixins, etc. Output goes
// into globals-output.js
var globalExports = globals(pickFiles(precompiled, {srcDir: '/app', destDir: '/'}));

// Require.js module loader
var loader = pickFiles('../bower_components', {srcDir: '/loader.js', destDir: '/'});

// glue.js contains the code for the application initializer that requires the
// output from registry-output.js and the global statements that require
// globals.js
var glue = new Funnel('.', {
  include: [/^glue\.js$/]
});

// Order matters here. glue needs to come after globalExports and registrations
var jsTree = mergeTrees([
  glue,
  mergeTrees([precompiled, registrations, globalExports, loader])
]);

// Transpile modules
var compiled = compileES6(jsTree, {
  wrapInEval: false,
  loaderFile: 'loader.js',
  inputFiles: ['app/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/js/ember-widgets.js',
  legacyFilesToAppend: ['registry-output.js', 'globals-output.js', 'glue.js']
});
compiled = wrap(compiled);

// Compile LESS
var lessTree = pickFiles('../app/styles', {srcDir: '/', destDir: '/'});
var lessMain = 'ember-widgets.less';
var lessOutput = 'css/ember-widgets.css';
lessTree = less(lessTree, lessMain, lessOutput);

// Compile static files
var images = pickFiles('../public/images', {srcDir: '/', destDir: '/img'});

module.exports = mergeTrees([es3Safe(compiled), lessTree, images]);
