import Ember from 'ember';

export default Ember.Route.extend({
  enter: function() {
    this.controllerFor('application').set('showLargeHero', true);
  },
  exit: function() {
    this.controllerFor('application').set('showLargeHero', false);
  }
});
