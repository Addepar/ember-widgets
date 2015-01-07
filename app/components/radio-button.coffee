`import Ember from 'ember'`

# Clickable wrapper around the actual radio button which allows the text near the
# button to be clickable too.
RadioButtonWrapperComponent = Ember.Component.extend
  layoutName: 'radio-button-layout'
  value: null
  disabled: false
  selectedValue: Ember.computed.alias 'parentView.selectedValue'
  classNames: ['radio-button']

  # Sets the checked property on the element.
  checked: false

  # Sets the disabled property on the element.
  _disabled: Ember.computed.or 'parentView.disabled', 'disabled'

  selectedValueChanged: Ember.on 'init', Ember.observer(->
    selectedValue = @get 'selectedValue'
    if not Ember.isEmpty(selectedValue) and @get('value') is selectedValue
      @set 'checked', true
    else
      @set 'checked', false
  , 'selectedValue')

  click: (event) ->
    return if @get('_disabled')
    @set 'checked', true
    @set 'selectedValue', @get 'value'

`export default RadioButtonWrapperComponent`
