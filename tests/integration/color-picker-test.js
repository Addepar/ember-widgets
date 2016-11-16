import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';

import {
  fillInCustomColor,
  openColorChooser,
  getSelectedColor,
  selectColor
} from '../helpers/color-picker';

import {
  isNotPresent
} from '../helpers/assertions';

var COLOR_PICKER, colorPicker, getColorPickerDropdown, getPreviewCellSelector, testHexConversion, app;

COLOR_PICKER = {
  PREVIEW_CELL: '.color-picker-custom-preview',
  DROPDOWN: '.color-picker-dropdown'
};

getPreviewCellSelector = function() {
  return COLOR_PICKER.PREVIEW_CELL;
};

getColorPickerDropdown = function() {
  return COLOR_PICKER.DROPDOWN;
};

moduleForComponent('color-picker', '[Integration] Color picker unit tests', {
  needs: ['template:color-picker', 'template:color-picker-cell', 'template:color-picker-button-partial', 'template:color-picker-dropdown', 'component:color-picker-dropdown', 'component:color-picker-cell'],

  setup: function() {
    app = startApp();
  },

  teardown: function() {
    Ember.run(function() {
      return colorPicker != null ? colorPicker.destroy() : void 0;
    });
    Ember.run(app, 'destroy');
    return colorPicker = null;
  }
});

testHexConversion = function(colorPicker, color, hex) {
  Ember.run(function() {
    return colorPicker.set('selectedColor', color);
  });
  return equal(colorPicker.get('selectedColorRGB'), hex);
};

test('Color picker converts color to hex when color is undefined', function() {
  expect(3);
  colorPicker = this.subject();
  return [void 0, null, 0].forEach(function(color) {
    return testHexConversion(colorPicker, color, color);
  });
});

test('Color picker converts color to hex when color is capitalized hex', function() {
  colorPicker = this.subject();
  return testHexConversion(colorPicker, "#AAAAAA", "#aaaaaa");
});

test('Color picker converts color to hex when color is transparent', function() {
  colorPicker = this.subject();
  return testHexConversion(colorPicker, "transparent", "transparent");
});

test('Color picker converts color to hex when color is rgb', function() {
  colorPicker = this.subject();
  return testHexConversion(colorPicker, "rgb(0, 0, 0)", "#000000");
});

test('Color picker converts color to hex when color is rgba', function() {
  colorPicker = this.subject();
  return testHexConversion(colorPicker, "rgb(3, 2, 1, 1)", "#030201");
});

test('Color picker converts color to hex when color is rgba and transparent', function() {
  colorPicker = this.subject();
  testHexConversion(colorPicker, "rgb(3, 2, 1, 0)", "transparent");
  return testHexConversion(colorPicker, "rgb(0, 0, 0, 0)", "transparent");
});

test('Color picker converts color to hex when color is color name', function() {
  colorPicker = this.subject();
  return testHexConversion(colorPicker, "aliceblue", "#f0f8ff");
});

test('Color picker converts color to hex when color is invalid', function() {
  colorPicker = this.subject();
  testHexConversion(colorPicker, "foo", void 0);
  testHexConversion(colorPicker, "rgb(a, b, c)", void 0);
  return testHexConversion(colorPicker, "rgb(1,2,3)", void 0);
});

test('Custom color is set as selected color', function() {
  var customColor;
  colorPicker = this.subject();
  customColor = '#addec0';
  this.append();
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  openColorChooser();
  return andThen(function() {
    equal(getSelectedColor(), customColor, 'Custom color in dropdown should remain after reopening');
    equal(colorPicker.get('selectedColor'), customColor, 'Custom color is set correctly when clicking on preview cell');
    return ok(colorPicker.get('isCustomColor'), 'Custom color cell is highlighted');
  });
});

test('Test accepting custom color without hashtag', function() {
  var customColor, formattedCustomColor;
  colorPicker = this.subject();
  customColor = 'addec0';
  formattedCustomColor = '#addec0';
  this.append();
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  openColorChooser();
  return andThen(function() {
    return equal(colorPicker.get('selectedColor'), formattedCustomColor, 'Custom color can be entered without hashtag');
  });
});

test('Selecting a color should send an action', function() {
  var color, customColor, spy;
  colorPicker = this.subject();
  customColor = '#addec0';
  color = '#01FF70';
  spy = sinon.spy(colorPicker, 'sendAction');
  this.append();
  selectColor(color);
  andThen(function() {
    return ok(spy.calledWithExactly('userSelected', color), 'Clicking color picker cell sends action');
  });
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  return andThen(function() {
    return ok(spy.calledWithExactly('userSelected', customColor), 'Clicking custom color sends action');
  });
});

test('Click outside of the component should close the dropdown', function() {
  colorPicker = this.subject();
  this.append();
  openColorChooser();
  return andThen(function() {
    $('body').trigger('click');
    return ok(isNotPresent(getColorPickerDropdown()), 'The dropdown should disappear when clicking outside');
  });
});

test('Submitting custom color form updates color and does not reload page', function() {
  var customColor;
  colorPicker = this.subject();
  customColor = "#abc123";
  this.append();
  openColorChooser();
  fillInCustomColor(customColor);
  return andThen(function() {
    $(".color-picker-custom-form").submit();
    return equal(colorPicker.get('selectedColor'), customColor, "Custom color gets set correctly and page doesn't refresh");
  });
});

test('Transparent color is set in preview cell', function() {
  var color;
  colorPicker = this.subject();
  color = 'transparent';
  this.append();
  selectColor(color);
  return andThen(function() {
    return ok(colorPicker.get('isColorTransparent'), 'Transparent color correctly identified in preview cell');
  });
});

test('Correct cell is highlighted within color palette', function() {
  var color;
  colorPicker = this.subject();
  color = '#01FF70';
  this.append();
  selectColor(color);
  openColorChooser();
  return andThen(function() {
    return equal(getSelectedColor(), color, 'Correct color cell is highlighted');
  });
});
