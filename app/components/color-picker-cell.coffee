`import Ember from 'ember'`
`import colorToHex from '../utils/color-utils'`
`import StyleBindingsMixin from '../mixins/style-bindings'`

ColorPickerCell = Ember.View.extend StyleBindingsMixin,
  templateName: 'color-picker-cell'
  classNames: ['pull-left', 'color-picker-cell']
  classNameBindings: Ember.A ['isActive:active:inactive']
  styleBindings:  'color:background-color'
  color: null

  isActive: Ember.computed ->
    colorToHex(@get('controller.selectedColor')) is colorToHex(@get('color'))
  .property 'controller.selectedColor', 'color'

  click: (event) ->
    @get('controller').send 'setColor', @get 'color'
    @get('controller').userDidSelect @get 'color'

`export default ColorPickerCell`
