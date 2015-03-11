colorPicker = undefined
dispatcher = undefined

module "Color picker unit tests",
  setup: ->
    dispatcher = Ember.EventDispatcher.create()
    dispatcher.setup()
    colorPicker = Ember.Widgets.ColorPicker.create()

  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      colorPicker.destroy()

testHexConversion = (color, hex) ->
  Ember.run ->
    colorPicker.set 'selectedColor', color
  equal colorPicker.get('selectedColorRGB'), hex

test 'Color picker converts color to hex when color is undefined', ->
  expect 3
  [undefined, null, 0].forEach (color) ->
    testHexConversion color, color


test 'Color picker converts color to hex when color is capitalized hex', ->
  testHexConversion "#AAAAAA", "#aaaaaa"


test 'Color picker converts color to hex when color is transparent', ->
  testHexConversion "transparent", "transparent"


test 'Color picker converts color to hex when color is rgb', ->
  testHexConversion "rgb(0, 0, 0)", "#000000"


test 'Color picker converts color to hex when color is rgba', ->
  testHexConversion "rgb(3, 2, 1, 1)", "#030201"


test 'Color picker converts color to hex when color is rgba and transparent', ->
  testHexConversion "rgb(3, 2, 1, 0)", "transparent"
  testHexConversion "rgb(0, 0, 0, 0)", "transparent"


test 'Color picker converts color to hex when color is color name', ->
  testHexConversion "aliceblue", "#f0f8ff"


test 'Color picker converts color to hex when color is invalid', ->
  testHexConversion "foo", undefined
  testHexConversion "rgb(a, b, c)", undefined
  testHexConversion "rgb(1,2,3)", undefined

test 'Custom color is set as selected color', ->
  customColor = '#addec0'
  append(colorPicker)

  openColorChooser().then ->
    fillInCustomColor customColor
  .then ->
    click '.input-group-addon'
  .then ->
    closeColorChooser()
  .then ->
    openColorChooser()
  .then ->
    equal getSelectedColor(), customColor, 'Custom color in dropdown should remain after reopening'
    equal colorPicker.get('customColor'), customColor, 'Custom color is set correctly'

test 'Selecting a color sends an action', ->
  customColor = '#addec0'
  color = '#01FF70'
  sinon.spy(colorPicker, 'userDidSelect')
  append(colorPicker)

  selectColor(color).then ->
    ok(colorPicker.userDidSelect.calledWithExactly(color), 'Clicking color picker cell sends action')
    fillInCustomColor customColor
  .then ->
    click '.input-group-addon'
  .then ->
    ok(colorPicker.userDidSelect.calledWithExactly(customColor), 'Clicking custom color sends action')
