`import Ember from 'ember'`

RadioButtonGroupComponent = Ember.Component.extend
  classNames: ['ember-radio-button-group']

  # Bound to the value of the selected radio button in this group
  selectedValue: null
  disabled: false

`export default RadioButtonGroupComponent`
