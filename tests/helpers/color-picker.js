import Ember from 'ember';

var _openColorChooser, _getSelectedColor,
  _selectColor, _fillInCustomColor;

_openColorChooser = function(app, element) {
  if (element == null) {
    element = 'body';
  }
  return andThen(function() {
    var dropdown;
    dropdown = find('.color-picker-button .dropdown', element);
    if (!dropdown.hasClass('open')) {
      return click('.color-picker-dropdown-button', element);
    }
  });
};

_getSelectedColor = function(app) {
  var _, a, active, b, g, r, ref, rgbVal;
  active = find(app, '.color-picker-dropdown .active');
  if (active.length) {
    rgbVal = active.css('background-color');
    ref = /(.*?)rgb(a)?\((\d+), (\d+), (\d+)(, (\d+))?\)/.exec(rgbVal), _ = ref[0], _ = ref[1], _ = ref[2], r = ref[3], g = ref[4], b = ref[5], a = ref[6], _ = ref[7];
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } else {
    return find('.color-picker-dropdown .input-sm').val();
  }
};

_selectColor = function(app, colorInHex) {
  var colorCellSelector;
  _openColorChooser();
  colorCellSelector = ".color-picker-cell[style*=" + colorInHex + "]";
  return click(colorCellSelector, '.color-picker-dropdown');
};

_fillInCustomColor = function(app, value) {
  var textBox;
  textBox = find('.color-picker-dropdown .input-sm');
  return fillIn(textBox, value);
};

Ember.Test.registerAsyncHelper('openColorChooser', _openColorChooser);
Ember.Test.registerHelper('getSelectedColor', _getSelectedColor);
Ember.Test.registerAsyncHelper('selectColor', _selectColor);
Ember.Test.registerAsyncHelper('fillInCustomColor', _fillInCustomColor);
