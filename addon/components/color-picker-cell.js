import Ember from 'ember';
import StyleBindingsMixin from '../mixins/style-bindings';
import ColorPickerMixin from '../mixins/color-picker';

/**
 * ColorPickerCell
 *
 * This is an internal-use view to control the logic of a color cell in
 * the color picker.
 * @class
 * @augments {Ember.View, Ember.Widgets.StyleBindingMixin,
 *            Ember.Widgets.ColorPickerMixin}
*/

export default Ember.Component.extend(StyleBindingsMixin, ColorPickerMixin, {
  layoutName: 'color-picker-cell',
  classNames: ['pull-left', 'color-picker-cell'],
  classNameBindings: 'isActive:active:inactive',
  styleBindings: 'color:background-color',
  /**
   * The color name of the cell, e.g. 'yellow'
   * @see  Ember.Widgets.ColorPickerMixin
   * @type { string }
  */

  color: null,
  /**
   * Determines whether the state of the cell is active if the picker selected
   * color matches this cell's color
   * @type {Boolean}
  */

  isActive: Ember.computed(function() {
    return this.get('selectedColor') === this.get('color');
  }).property('selectedColor', 'color'),
  click: function() {
    return this.sendAction('setColor', this.get('color'));
  }
});
