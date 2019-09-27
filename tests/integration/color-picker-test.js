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

testHexConversion = function(assert, colorPicker, color, hex) {
  Ember.run(function() {
    return colorPicker.set('selectedColor', color);
  });
  return assert.equal(colorPicker.get('selectedColorRGB'), hex);
};

test('Color picker converts color to hex when color is undefined', function(assert) {
  assert.expect(3);
  colorPicker = this.subject();
  return [void 0, null, 0].forEach(function(color) {
    return testHexConversion(assert, colorPicker, color, color);
  });
});

test('Color picker converts color to hex when color is capitalized hex', function(assert) {
  colorPicker = this.subject();
  return testHexConversion(assert, colorPicker, "#AAAAAA", "#aaaaaa");
});

test('Color picker converts color to hex when color is transparent', function(assert) {
  colorPicker = this.subject();
  return testHexConversion(assert, colorPicker, "transparent", "transparent");
});

test('Color picker converts color to hex when color is rgb', function(assert) {
  colorPicker = this.subject();
  return testHexConversion(assert, colorPicker, "rgb(0, 0, 0)", "#000000");
});

test('Color picker converts color to hex when color is rgba', function(assert) {
  colorPicker = this.subject();
  return testHexConversion(assert, colorPicker, "rgb(3, 2, 1, 1)", "#030201");
});

test('Color picker converts color to hex when color is rgba and transparent', function(assert) {
  colorPicker = this.subject();
  testHexConversion(assert, colorPicker, "rgb(3, 2, 1, 0)", "transparent");
  return testHexConversion(assert, colorPicker, "rgb(0, 0, 0, 0)", "transparent");
});

test('Color picker converts color to hex when color is color name', function(assert) {
  colorPicker = this.subject();
  return testHexConversion(assert, colorPicker, "aliceblue", "#f0f8ff");
});

test('Color picker converts color to hex when color is invalid', function(assert) {
  colorPicker = this.subject();
  testHexConversion(assert, colorPicker, "foo", void 0);
  testHexConversion(assert, colorPicker, "rgb(a, b, c)", void 0);
  return testHexConversion(assert, colorPicker, "rgb(1,2,3)", void 0);
});

test('Custom color is set as selected color', function(assert) {
  var customColor;
  colorPicker = this.subject();
  customColor = '#addec0';
  this.render();
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  openColorChooser();
  return andThen(function() {
    assert.equal(getSelectedColor(), customColor, 'Custom color in dropdown should remain after reopening');
    assert.equal(colorPicker.get('selectedColor'), customColor, 'Custom color is set correctly when clicking on preview cell');
    return assert.ok(colorPicker.get('isCustomColor'), 'Custom color cell is highlighted');
  });
});

test('Test accepting custom color without hashtag', function(assert) {
  var customColor, formattedCustomColor;
  colorPicker = this.subject();
  customColor = 'addec0';
  formattedCustomColor = '#addec0';
  this.render();
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  openColorChooser();
  return andThen(function() {
    return assert.equal(colorPicker.get('selectedColor'), formattedCustomColor, 'Custom color can be entered without hashtag');
  });
});

test('Selecting a color should send an action', function(assert) {
  var color, customColor, spy;
  colorPicker = this.subject();
  customColor = '#addec0';
  color = '#01FF70';
  spy = sinon.spy(colorPicker, 'sendAction');
  this.render();
  selectColor(color);
  andThen(function() {
    return assert.ok(spy.calledWithExactly('userSelected', color), 'Clicking color picker cell sends action');
  });
  openColorChooser();
  fillInCustomColor(customColor);
  click(getPreviewCellSelector());
  return andThen(function() {
    return assert.ok(spy.calledWithExactly('userSelected', customColor), 'Clicking custom color sends action');
  });
});

test('Click outside of the component should close the dropdown', function(assert) {
  colorPicker = this.subject();
  this.render();
  openColorChooser();
  return andThen(function() {
    $('body').trigger('click');
    return assert.ok(isNotPresent(getColorPickerDropdown()), 'The dropdown should disappear when clicking outside');
  });
});

test('Submitting custom color form updates color and does not reload page', function(assert) {
  var customColor;
  colorPicker = this.subject();
  customColor = "#abc123";
  this.render();
  openColorChooser();
  fillInCustomColor(customColor);
  return andThen(function() {
    $(".color-picker-custom-form").submit();
    return assert.equal(colorPicker.get('selectedColor'), customColor, "Custom color gets set correctly and page doesn't refresh");
  });
});

test('Transparent color is set in preview cell', function(assert) {
  var color;
  colorPicker = this.subject();
  color = 'transparent';
  this.render();
  selectColor(color);
  return andThen(function() {
    return assert.ok(colorPicker.get('isColorTransparent'), 'Transparent color correctly identified in preview cell');
  });
});

test('Correct cell is highlighted within color palette', function(assert) {
  var color;
  colorPicker = this.subject();
  color = '#01FF70';
  this.render();
  selectColor(color);
  openColorChooser();
  return andThen(function() {
    return assert.equal(getSelectedColor(), color, 'Correct color cell is highlighted');
  });
});
