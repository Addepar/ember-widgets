module "Color picker unit tests"


test 'Color picker converts color to hex when color is undefined', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex(undefined), undefined
  equal colorPickerCell.colorToHex(null), null
  equal colorPickerCell.colorToHex(0), 0


test 'Color picker converts color to hex when color is capitalized hex', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("#AAAAAA"), "#aaaaaa"


test 'Color picker converts color to hex when color is transparent', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("transparent"), "transparent"


test 'Color picker converts color to hex when color is rgb', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("rgb(0, 0, 0)"), "#000000"


test 'Color picker converts color to hex when color is rgba', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("rgb(3, 2, 1, 1)"), "#030201"


test 'Color picker converts color to hex when color is rgba and transparent', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("rgb(3, 2, 1, 0)"), "transparent"
  equal colorPickerCell.colorToHex("rgb(0, 0, 0, 0)"), "transparent"


test 'Color picker converts color to hex when color is color name', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("aliceblue"), "#f0f8ff"


test 'Color picker converts color to hex when color is invalid', ->
  colorPickerCell = Ember.Widgets.ColorPickerCell.create()
  equal colorPickerCell.colorToHex("foo"), undefined
  equal colorPickerCell.colorToHex("rgb(a, b, c)"), undefined
  equal colorPickerCell.colorToHex("rgb(1,2,3)"), undefined
