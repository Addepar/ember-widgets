/* global define, require */

define('ember', ["exports"], function(__exports__) {
  __exports__['default'] = window.Ember;
});

// This is where we actually create Ember.Widgets and fill it with the stuff
// generated by globals.js
window.Ember.Widgets = {};
require('globals');

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: 'ember-widgets-standalone',
    initialize: function(container) {
      // Once the application is loaded, add an initializer to add stuff to
      // the container using the output from registry.js
      require('ember-widgets-shim').initialize(container);
    }
  });
});