Ember.Widgets.RadioButtonComponent = Ember.Component.extend
  attributeBindings: ['type', 'checked']
  classNames: ['radio-input']
  tagName: 'input'
  type: 'radio'
  checked: Ember.computed.alias 'parentView.checked'

# Clickable wrapper around the actual radio button which allows the text near the
# button to be clickable too.
Ember.Widgets.RadioButtonWrapperComponent = Ember.Component.extend
  layoutName: 'radio_button_layout'
  value: null
  selectedValue: Ember.computed.alias 'parentView.selectedValue'
  classNames: ['radio-button']

  # Sets the checked property on the element.
  checked: false

  selectedValueChanged: Ember.on 'init', Ember.observer(->
    selectedValue = @get 'selectedValue'
    if not Ember.isEmpty(selectedValue) and @get('value') is selectedValue
      @set 'checked', true
    else
      @set 'checked', false
  , 'selectedValue')

  click: (event) ->
    @set 'checked', true
    @set 'selectedValue', @get 'value'

Ember.Widgets.RadioButtonGroupComponent = Ember.Component.extend
  classNames: ['ember-radio-button-group']

  # Bound to the value of the selected radio button in this group
  selectedValue: null

Ember.Handlebars.helper('radio-button-group-component', Ember.Widgets.RadioButtonGroupComponent)
Ember.Handlebars.helper('radio-button', Ember.Widgets.RadioButtonWrapperComponent)
