// Karma configuration
// Generated on Tue Jan 07 2014 15:51:17 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    // list of files / patterns to load in the browser
    files: [
      'dependencies/google-code-prettify/prettify.js',
      'dependencies/jquery/jquery.js',
      'dependencies/jquery-ui/jquery-ui-1.10.1.custom.min.js',
      'dependencies/handlebars/handlebars.js',
      'dependencies/lodash/lodash.js',
      'dependencies/ember/ember.js',
      'dependencies/list-view.js',
      'dependencies/rangy/rangy-core.js',
      'dependencies/rangy/rangy-selectionsaverestore.js',
      'gh_pages/app.js',
      'tests/*.js',  // order matters!
      'tests/unit/*.js',
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
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false,  // Continuous Integration mode
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
