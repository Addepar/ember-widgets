// Karma configuration
// Generated on Tue Jan 07 2014 15:51:17 GMT-0800 (PST)

module.exports = function(config) {
  var configuration = {
    basePath: '',
    frameworks: ['qunit'],
    // list of files / patterns to load in the browser
    files: [
      'dependencies/google-code-prettify/prettify.js',
      'vendor/jquery/jquery.js',
      'vendor/jquery-ui/ui/jquery-ui.custom.js',
      'vendor/handlebars/handlebars.js',
      'vendor/lodash/lodash.js',
      'vendor/ember/ember.js',
      'vendor/ember-list-view/list-view.js',
      'vendor/bootstrap/js/transition.js',
      'vendor/rangy/currentrelease/rangy-core.js',
      'vendor/rangy/currentrelease/rangy-selectionsaverestore.js',
      'vendor/ember-qunit-builds/ember-qunit.js',
      'vendor/sinonjs/sinon.js',

      'dist/js/ember-widgets.js',
      'dist/css/ember-widgets.css',

      'build/tests/*.js',  // order matters!
      'build/tests/helpers/*.js',
      'build/tests/unit/*.js',
      'build/tests/functional/*.js',
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
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
    },
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
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
