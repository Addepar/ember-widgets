import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    var controller;
    controller = this.controllerFor('emberWidgets');
    controller.set('showLargeHero', true);
  },
  deactivate: function() {
    var controller;
    controller = this.controllerFor('emberWidgets');
    controller.set('showLargeHero', false);
  }
});
