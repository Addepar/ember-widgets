Ember.Widgets.RadioButtonComponent = Ember.Component.extend
  attributeBindings: ['type', 'checked', 'disabled']
  classNames: ['radio-input']
  tagName: 'input'
  type: 'radio'
  checked: Ember.computed.alias 'parentView.checked'
  disabled: Ember.computed.alias 'parentView._disabled'

# Clickable wrapper around the actual radio button which allows the text near the
# button to be clickable too.
Ember.Widgets.RadioButtonWrapperComponent = Ember.Component.extend
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

Ember.Widgets.RadioButtonGroupComponent = Ember.Component.extend
  classNames: ['ember-radio-button-group']

  # Bound to the value of the selected radio button in this group
  selectedValue: null
  disabled: false

Ember.Handlebars.helper('radio-button-group-component', Ember.Widgets.RadioButtonGroupComponent)
Ember.Handlebars.helper('radio-button', Ember.Widgets.RadioButtonWrapperComponent)
