import Ember from 'ember';

export default Ember.ContainerView.extend({
  childViews: Ember.computed('viewClass', 'options', function() {
    return [this.get('viewClass').create({
      ...(this.get('options')),
      container: this.container
    })];
  }),
});
