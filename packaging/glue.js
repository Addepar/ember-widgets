/* global define, require */

define('ember', ["exports"], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.Ember.Widgets = {};
require('globals');
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: 'ember-widgets-standalone',
    initialize: function(container) {
      require('ember-widgets-shim').initialize(container);
    }
  });
});
