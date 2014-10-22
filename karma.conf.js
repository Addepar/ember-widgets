// Karma configuration
// Generated on Tue Jan 07 2014 15:51:17 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    // list of files / patterns to load in the browser
    files: [
      'dependencies/google-code-prettify/prettify.js',
      'vendor/jquery/jquery.js',
      'dependencies/jquery-ui/jquery-ui-1.10.1.custom.min.js',
      'vendor/handlebars/handlebars.js',
      'vendor/lodash/lodash.js',
      'vendor/ember/ember.js',
      'dependencies/list-view.js',
      'vendor/rangy/rangy-core.js',
      'vendor/rangy/rangy-selectionsaverestore.js',
      'vendor/sinonjs/sinon.js',
      'gh_pages/app.js',

      'http://fast.fonts.net/cssapi/cc61a2f8-3c32-45ef-9be7-fc0cc1fab22b.css',
      'gh_pages/css/app.css',
      'tests/*.js',  // order matters!
      'tests/helpers/*.js',
      'tests/unit/*.js',
      'tests/functional/*.js',
      'tests/integration/*.js',
    ],
    // list of files to exclude
    exclude: ['build/src/ember_widgets.js'],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    // browsers: ['PhantomJS', 'Chrome'],
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: true,  // Continuous Integration mode
    plugins: [
      'karma-qunit',
      'karma-ember-preprocessor',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-spec-reporter'
    ],
    preprocessors:{
      "**/*.hbs": "ember"
    }
  });
};
