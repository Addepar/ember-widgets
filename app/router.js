import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('license');

  this.route('overview');
  this.route('documentation');
  this.route('accordion');
  this.route('carousel');
  this.route('modal');
  this.route('popover');
  this.route('select');
  this.route('color-picker');
  this.route('radio-button');
});

export default Router;
