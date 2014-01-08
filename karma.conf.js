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
      'dependencies/rangy/rangy-core.js',
      'dependencies/rangy/rangy-selectionsaverestore.js',
      'dist/ember-widgets.js',
      'gh_pages/app.js',
      'tests/*.js',
    ],
    // list of files to exclude
    exclude: [],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    // browsers: ['PhantomJS', 'Chrome'],
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
