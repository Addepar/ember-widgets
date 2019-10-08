import Ember from 'ember';
import BodyEventListenerMixin from '../mixins/body-event-listener';
import ColorPickerMixin from '../mixins/color-picker';

/**
 * ColorPickerDropdownComponent
 *
 * This is an internal-use component to control the logic of the dropdown of
 * the color picker. It contains the color palette and the custom color input
 * @class
 * @augments {Ember.Component, Ember.Widgets.BodyEventListener,
 *            Ember.Widgets.ColorPickerMixin}
*/

var __indexOf = [].indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) {
      return i;
    }
  }

  return -1;
};

export default Ember.Component.extend(BodyEventListenerMixin, ColorPickerMixin, {
  layoutName: 'color-picker-dropdown',
  dropdownClass: null,
  selectedColor: '',
  customColor: '',
  /**
   * The color palette preset. It is passed in from the ColorPickerComponent.
   * @type {array}
  */

  colorRows: Ember.computed(function() {
    return Ember.A();
  }),
  setCustomColorObserver: Ember.on('init', Ember.observer('selectedColor', 'colorRows', function() {
    var selectedColor;
    selectedColor = this.get('selectedColor');
    selectedColor = this.colorToHex(selectedColor);
    if (this.get('colorRows').find(function(row) {
      return __indexOf.call(row.invoke('toLowerCase'), selectedColor) >= 0;
    })) {
      return this.set('customColor', '');
    }
    return this.set('customColor', selectedColor);
  })),
  /**
   * This is the formatted string of the input color, for which a hashtag "#"
   * is automatically added if it is not present.
   * @type {string}
  */

  formattedCustomColor: Ember.computed(function() {
    var customColor;
    customColor = this.get('customColor').trim();
    if (customColor.charAt(0) !== '#') {
      customColor = '#' + customColor;
    }
    return customColor;
  }).property('customColor'),
  isCustomColorValid: Ember.computed(function() {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.get('formattedCustomColor'));
  }).property('formattedCustomColor'),
  customColorCSS: Ember.computed(function() {
    return Ember.String.htmlSafe("background-color: " + (this.get('formattedCustomColor')));
  }).property('formattedCustomColor'),
  userDidSelect: function(selection) {
    return this.sendAction('userSelected', selection);
  },
  /**
   * Handle the body click event, i.e. click outside of the component. Here,
   * an action is sent up to inform the color picker component to close the
   * dropdown.
   * @override
   * @function
  */

  bodyClick: function() {
    return this.sendAction('hideDropdown');
  },
  actions: {
    setColor: function(color) {
      this.set('customColor', '');
      this.set('selectedColor', color);
      this.sendAction('setSelectedColor', color, false);
      return this.userDidSelect(color);
    },
    setCustomColor: function() {
      var color;
      if (this.get('isCustomColorValid')) {
        color = this.get('formattedCustomColor');
        this.sendAction('setSelectedColor', color, true);
        return this.userDidSelect(color);
      }
    }
  }
});
