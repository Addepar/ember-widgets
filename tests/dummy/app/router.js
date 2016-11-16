import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('license');
  this.route('emberWidgets', {
    path: '/ember-widgets'
  }, function() {
    this.route('overview');
    this.route('documentation');
    this.route('carousel');
    this.route('modal');
    this.route('popover');
    this.route('select');
    this.route('colorPicker');
    this.route('radioButton');
  });
});

export default Router;
