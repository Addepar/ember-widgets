import Ember from 'ember';

// Formerly RadioButtonWrapper component, was renamed so that it matched its hbs
// helper, {{radio-button}}

// Clickable wrapper around the actual radio button which allows the text near the
// button to be clickable too.
export default Ember.Component.extend({
  layoutName: 'radio-button-layout',
  value: null,
  disabled: false,
  selectedValue: Ember.computed.alias('parentView.selectedValue'),
  classNames: ['radio-button'],

  // Sets the checked property on the element.
  checked: false,

  // Sets the disabled property on the element.
  _disabled: Ember.computed.or('parentView.disabled', 'disabled'),
  selectedValueChanged: Ember.on('init', Ember.observer(function() {
    var selectedValue;
    selectedValue = this.get('selectedValue');
    if (!Ember.isEmpty(selectedValue) && this.get('value') === selectedValue) {
      this.set('checked', true);
    } else {
      this.set('checked', false);
    }
  }, 'selectedValue')),
  click: function() {
    if (this.get('_disabled')) {
      return;
    }
    const value = this.get('value');
    const selectedValue = this.get('selectedValue');

    if (selectedValue !== value) {
      Ember.run(() => {
        this.set('checked', true);
        this.set('selectedValue', value);
      });
      this.sendAction('onchange', value);
    }
  }
});
