import Ember from 'ember';
import ColorPickerMixin from '../mixins/color-picker';

export default Ember.Component.extend(ColorPickerMixin, {
  layoutName: 'color-picker',
  classNames: ['color-picker-button'],
  colorPickerPlacement: 'right',
  dropdownClass: null,
  /**
   * The color palette preset. It is passed in from the ColorPickerComponent.
   * @type {array} an array of two arrays of hex color strings. The two arrays
   * corresponding to the two color palettes displayed in the dropdown.
  */

  colorRows: Ember.computed(function() {
    return Ember.A([Ember.A(['#000000', '#111111', '#434343', '#666666', '#999999', '#AAAAAA', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF']), Ember.A(['#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144B', '#B10DC9', 'transparent'])]);
  }),
  /**
   * This is the partial template for the colorPicker button.
   * It allows developers to override/style this component differently
   * @type {string}
  */

  colorPickerButtonPartial: 'color-picker-button-partial',
  /**
   * This is a boolean to control if we should render the colorPicker dropdown
   * or not. Instead of hiding it using CSS, we use this flag to control the
   * rendering.
   * @type {boolean}
  */

  isDropdownOpen: false,
  selectedColor: '#0074D9',
  customColor: '',
  /**
   * The property indicates that we have a custom color selected or a color
   * from color palette selected.
   * @type {boolean}
  */

  isCustomColor: Ember.computed.notEmpty('customColor'),
  /**
   * Determines whether the color is transparent so the cell renders the
   * transparent style properly
   * @type {Boolean}
  */

  isColorTransparent: Ember.computed.equal('selectedColorRGB', 'transparent'),
  selectedColorRGB: Ember.computed(function() {
    var selectedColor;
    selectedColor = this.get('selectedColor');
    return this.colorToHex(selectedColor);
  }).property('selectedColor'),
  actions: {
    /**
     * This action is bound to the colorPicker button to hide/show the dropdown
     * when users click on it.
    */

    toggleDropdown: function() {
      return this.toggleProperty('isDropdownOpen');
    },
    /**
     * Send an action outside of the component to inform that a new
     * color is select and also to hide the dropdown.
     * @param {String} selection the selected color hex string
    */

    userSelected: function(selection) {
      this.sendAction('userSelected', selection);
      return this.set('isDropdownOpen', false);
    },
    /**
     * Hide the color picker dropdown
    */

    hideDropdown: function() {
      return this.set('isDropdownOpen', false);
    },
    /**
     * Set the selected color and update the custom color accordingly
     * @param {string}  color the selected color to be updated
     * @param {boolean} isCustomColor the flag to indicate if it is a custom
     *                  color
    */

    setSelectedColor: function(color, isCustomColor) {
      this.set('selectedColor', color);
      if (isCustomColor) {
        return this.set('customColor', color);
      } else {
        return this.set('customColor', '');
      }
    }
  }
});
