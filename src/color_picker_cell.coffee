###*
 * ColorPickerCell
 *
 * This is an internal-use view to control the logic of a color cell in
 * the color picker.
 * @class
 * @augments {Ember.View, Ember.Widgets.StyleBindingMixin,
 *            Ember.Widgets.ColorPickerMixin}
###
Ember.Widgets.ColorPickerCellComponent =
Ember.Component.extend Ember.Widgets.StyleBindingsMixin,
Ember.Widgets.ColorPickerMixin,
  layoutName: 'color-picker-cell'
  classNames: ['pull-left', 'color-picker-cell']
  classNameBindings: 'isActive:active:inactive'
  styleBindings:  'color:background-color'

  ###*
   * The color name of the cell, e.g. 'yellow'
   * @see  Ember.Widgets.ColorPickerMixin
   * @type { string }
  ###
  color: null

  isActive: Ember.computed ->
    @colorToHex(@get('controller.selectedColor')) is @colorToHex(@get('color'))
  .property 'controller.selectedColor', 'color'

  click: ->
    @sendAction 'setColor', @get 'color'
