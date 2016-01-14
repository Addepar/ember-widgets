colorPicker = null
COLOR_PICKER =
  PREVIEW_CELL: '.color-picker-custom-preview'

getPreviewCellSelector = -> COLOR_PICKER.PREVIEW_CELL

moduleForComponent 'color-picker', '[Unit] Color picker unit tests',
  needs: [
    'template:color-picker'
    'template:color-picker-cell'
    'template:color-picker-button-partial'
    'component:color-picker-dropdown'
    'template:color-picker-dropdown'
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
  [undefined, null, 0].forEach (color) =>
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
  closeColorChooser()
  openColorChooser()
  andThen =>
    equal getSelectedColor(), customColor,
      'Custom color in dropdown should remain after reopening'
    equal colorPicker.get('customColor'), customColor,
      'Custom color is set correctly'

test 'Selecting a color sends an action', ->
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
  andThen ->
    fillInCustomColor customColor
  andThen ->
    click getPreviewCellSelector()
  andThen ->
    ok spy.calledWithExactly('userSelected', customColor),
      'Clicking custom color sends action'
