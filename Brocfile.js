/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

var moduleExports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');
  app.import(app.bowerDirectory + '/google-code-prettify/bin/prettify.min.css');
  app.import(app.bowerDirectory + '/google-code-prettify/bin/prettify.min.js');
  app.import(app.bowerDirectory + '/jquery-ui/ui/jquery-ui.custom.js');
  app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');
  app.import(app.bowerDirectory + '/lodash/lodash.js');

  app.import(app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' });
  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};

module.exports = moduleExports();
