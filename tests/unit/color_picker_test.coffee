moduleForComponent 'color-picker', '[Unit] Color picker unit tests',
  needs: [
    'template:color-picker'
    'template:color-picker-cell'
  ]

testHexConversion = (colorPicker, color, hex) ->
  Ember.run ->
    colorPicker.set 'selectedColor', color
  equal colorPicker.get('selectedColorRGB'), hex

test 'Color picker converts color to hex when color is undefined', ->
  expect 3
  [undefined, null, 0].forEach (color) =>
    testHexConversion @subject(), color, color


test 'Color picker converts color to hex when color is capitalized hex', ->
  testHexConversion @subject(), "#AAAAAA", "#aaaaaa"


test 'Color picker converts color to hex when color is transparent', ->
  testHexConversion @subject(), "transparent", "transparent"


test 'Color picker converts color to hex when color is rgb', ->
  testHexConversion @subject(), "rgb(0, 0, 0)", "#000000"


test 'Color picker converts color to hex when color is rgba', ->
  testHexConversion @subject(), "rgb(3, 2, 1, 1)", "#030201"


test 'Color picker converts color to hex when color is rgba and transparent', ->
  testHexConversion @subject(), "rgb(3, 2, 1, 0)", "transparent"
  testHexConversion @subject(), "rgb(0, 0, 0, 0)", "transparent"


test 'Color picker converts color to hex when color is color name', ->
  testHexConversion @subject(), "aliceblue", "#f0f8ff"


test 'Color picker converts color to hex when color is invalid', ->
  testHexConversion @subject(), "foo", undefined
  testHexConversion @subject(), "rgb(a, b, c)", undefined
  testHexConversion @subject(), "rgb(1,2,3)", undefined

test 'Custom color is set as selected color', ->
  customColor = '#addec0'
  @render()

  openColorChooser()
  fillInCustomColor customColor
  click '.input-group-addon'
  closeColorChooser()
  openColorChooser()
  andThen =>
    equal getSelectedColor(), customColor, 'Custom color in dropdown should remain after reopening'
    equal @subject().get('customColor'), customColor, 'Custom color is set correctly'

test 'Selecting a color sends an action', ->
  colorPicker = @subject()
  customColor = '#addec0'
  color = '#01FF70'
  sinon.spy(colorPicker, 'userDidSelect')
  @render()

  selectColor(color)
  andThen ->
    ok(colorPicker.userDidSelect.calledWithExactly(color), 'Clicking color picker cell sends action')

  fillInCustomColor customColor
  click '.input-group-addon'
  andThen ->
    ok(colorPicker.userDidSelect.calledWithExactly(customColor), 'Clicking custom color sends action')
