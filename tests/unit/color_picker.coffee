colorPicker = null

module "Color picker unit tests",
  setup: ->
    colorPicker = Ember.Widgets.ColorPicker.create()

  teardown: ->
    Ember.run ->
      colorPicker.destroy()

testHexConversion = (color, hex) ->
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
