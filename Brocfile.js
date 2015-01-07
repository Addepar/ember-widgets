/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon({
  lessOptions: {
    paths: [
      'tests/dummy/app/styles/',
      'bower_components/bootstrap/less/',
      'bower_components/font-awesome/css/',
      'bower_components/font-awesome/less/',
      'bower_components/jquery-ui/themes/base/'
    ],
    outputFile: 'dummy.css'
  }
});

app.import(app.bowerDirectory + '/font-awesome/css/font-awesome.css');
app.import(app.bowerDirectory + '/font-awesome/fonts/fontawesome-webfont.ttf', {destDir: 'assets'});
app.import(app.bowerDirectory + '/font-awesome/fonts/fontawesome-webfont.woff', {destDir: 'assets'});
app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.min.js');
app.import(app.bowerDirectory + '/lodash/dist/lodash.min.js');
app.import(app.bowerDirectory + '/modernizr/modernizr.js');
app.import('vendor/list-view/list-view.js');
module.exports = app.toTree();
