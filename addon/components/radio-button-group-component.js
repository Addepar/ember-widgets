import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-radio-button-group'],
  // Bound to the value of the selected radio button in this group
  selectedValue: null,
  disabled: false,
  selectedValueChanged: Ember.on('init', Ember.observer(function() {
   return this.sendAction('action', this.get('selectedValue'));
  }, 'selectedValue'))
});
