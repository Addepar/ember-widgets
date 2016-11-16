import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: 'isActive:active',
  isActive: Ember.computed(function() {
    return this.get('contentIndex') === this.get('controller.activeIndex');
  }).property('contentIndex', 'controller.activeIndex'),
  click: function() {
    return this.get('controller').to(this.get('contentIndex'));
  }
});
