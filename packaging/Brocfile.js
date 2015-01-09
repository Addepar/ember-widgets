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
var instrument = require('broccoli-debug').instrument;

var appTree = filterCoffeeScript(
  pickFiles('../app', {
    srcDir: '/',
    destDir: 'app'
  }),
  {bare: true}
);

var templateTree = templateCompiler('../app/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app/templates'});

var precompiled = mergeTrees([templateTree, appTree], {overwrite: true});
var registrations = registry(pickFiles(precompiled, {srcDir: '/app', destDir: '/'}));
var globalExports = globals(pickFiles(precompiled, {srcDir: '/app', destDir: '/'}));
instrument.print(globalExports);
var loader = pickFiles('../bower_components', {srcDir: '/loader.js', destDir: '/'});
var glue = new Funnel('.', {
  include: [/^glue\.js$/]
});
// var globals = new Funnel('.', {
//   include: [/^globals\.js$/]
// });

var jsTree = mergeTrees([glue, mergeTrees([precompiled, registrations, globalExports, loader])]);
var compiled = compileES6(jsTree, {
  wrapInEval: false,
  loaderFile: 'loader.js',
  inputFiles: ['app/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/js/ember-widgets.js',
  legacyFilesToAppend: ['registry-output.js', 'globals-output.js', 'glue.js']
});
compiled = wrap(compiled);

var lessTree = pickFiles('../app/styles', {srcDir: '/', destDir: '/'});
var lessMain = 'ember-widgets.less';
var lessOutput = 'css/ember-widgets.css';
lessTree = less(lessTree, lessMain, lessOutput);

var images = pickFiles('../public/images', {srcDir: '/', destDir: '/img'});

module.exports = mergeTrees([es3Safe(compiled), lessTree, images]);
