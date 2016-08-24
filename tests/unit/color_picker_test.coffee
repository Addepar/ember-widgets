colorPicker = null
COLOR_PICKER =
  PREVIEW_CELL: '.color-picker-custom-preview'
  DROPDOWN: '.color-picker-dropdown'

getPreviewCellSelector = -> COLOR_PICKER.PREVIEW_CELL
getColorPickerDropdown = -> COLOR_PICKER.DROPDOWN

moduleForComponent 'color-picker', '[Unit] Color picker unit tests',
  needs: [
    'template:color-picker'
    'template:color-picker-cell'
    'template:color-picker-button-partial'
    'template:color-picker-dropdown'
    'component:color-picker-dropdown'
    'component:color-picker-cell'
  ]

  teardown: ->
    Ember.run ->
      colorPicker?.destroy()
    colorPicker = null


testHexConversion = (colorPicker, color, hex) ->
  Ember.run ->
    colorPicker.set 'selectedColor', color
  equal colorPicker.get('selectedColorRGB'), hex

test 'Color picker converts color to hex when color is undefined', ->
  expect 3
  colorPicker = @subject()
  [undefined, null, 0].forEach (color) ->
    testHexConversion colorPicker, color, color


test 'Color picker converts color to hex when color is capitalized hex', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "#AAAAAA", "#aaaaaa"


test 'Color picker converts color to hex when color is transparent', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "transparent", "transparent"


test 'Color picker converts color to hex when color is rgb', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "rgb(0, 0, 0)", "#000000"


test 'Color picker converts color to hex when color is rgba', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "rgb(3, 2, 1, 1)", "#030201"


test 'Color picker converts color to hex when color is rgba and transparent', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "rgb(3, 2, 1, 0)", "transparent"
  testHexConversion colorPicker, "rgb(0, 0, 0, 0)", "transparent"


test 'Color picker converts color to hex when color is color name', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "aliceblue", "#f0f8ff"


test 'Color picker converts color to hex when color is invalid', ->
  colorPicker = @subject()
  testHexConversion colorPicker, "foo", undefined
  testHexConversion colorPicker, "rgb(a, b, c)", undefined
  testHexConversion colorPicker, "rgb(1,2,3)", undefined

test 'Custom color is set as selected color', ->
  colorPicker = @subject()
  customColor = '#addec0'
  @append()

  openColorChooser()
  fillInCustomColor customColor
  click getPreviewCellSelector()
  openColorChooser()
  andThen ->
    equal getSelectedColor(), customColor,
      'Custom color in dropdown should remain after reopening'
    equal colorPicker.get('selectedColor'), customColor,
      'Custom color is set correctly when clicking on preview cell'
    # isCustomColor triggers active class on custom cell
    ok colorPicker.get('isCustomColor'),
      'Custom color cell is highlighted'

test 'Test accepting custom color without hashtag', ->
  colorPicker = @subject()
  customColor = 'addec0'
  formattedCustomColor = '#addec0'
  @append()

  openColorChooser()
  fillInCustomColor customColor
  click getPreviewCellSelector()
  openColorChooser()
  andThen ->
    equal colorPicker.get('selectedColor'), formattedCustomColor,
      'Custom color can be entered without hashtag'

test 'Selecting a color should send an action', ->
  colorPicker = @subject()
  customColor = '#addec0'
  color = '#01FF70'
  spy = sinon.spy(colorPicker, 'sendAction')
  @append()

  selectColor(color)
  andThen ->
    ok spy.calledWithExactly('userSelected', color),
      'Clicking color picker cell sends action'

  openColorChooser()
  fillInCustomColor customColor
  click getPreviewCellSelector()
  andThen ->
    ok spy.calledWithExactly('userSelected', customColor),
      'Clicking custom color sends action'

test 'Click outside of the component should close the dropdown', ->
  colorPicker = @subject()
  @append()

  openColorChooser()
  andThen ->
    # We have to use jquery click because the click helper is wrapped inside the
    # Ember component in unit test
    $('body').trigger('click')
    ok isNotPresent(getColorPickerDropdown()),
      'The dropdown should disappear when clicking outside'

test 'Submitting custom color form updates color and does not reload page', ->
  colorPicker = @subject()
  customColor = "#abc123"
  @append()

  openColorChooser()
  fillInCustomColor(customColor)
  andThen ->
    # We have to trigger form submit with jQuery instead of pressing enter,
    # because form submission by means of an 'enter' keypress is handled by
    # browser and not by the form. setCustomColor action is triggered on submit.
    $(".color-picker-custom-form").submit()
    equal colorPicker.get('selectedColor'), customColor, "Custom color gets
      set correctly and page doesn't refresh"

test 'Transparent color is set in preview cell', ->
  colorPicker = @subject()
  color = 'transparent'
  @append()

  selectColor(color)
  andThen ->
    # isColorTransparent toggles a class to make the cell show transparent icon
    ok colorPicker.get('isColorTransparent'),
      'Transparent color correctly identified in preview cell'

test 'Correct cell is highlighted within color palette', ->
  colorPicker = @subject()
  color = '#01FF70'
  @append()

  selectColor(color)
  openColorChooser()
  andThen ->
    # getSelectedColor checks for the cell with class .active,
    # which is what highlights the cell
    equal getSelectedColor(), color,
      'Correct color cell is highlighted'
