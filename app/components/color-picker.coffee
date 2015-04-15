`import Ember from 'ember'`
`import colorToHex from '../utils/color-utils'`

ColorPicker = Ember.Component.extend
  layoutName: 'color-picker'
  classNames: ['color-picker-button']
  colorPickerPlacement: 'right'
  dropdownClass: null

  INITIAL_COLOR: '#0074D9'

  selectedColor: '#0074D9'
  selectedColorRGB: Ember.computed ->
    colorToHex(@get('selectedColor'))
  .property 'selectedColor'
  customColor: ''

  isColorTransparent: Ember.computed.equal 'selectedColorRGB', 'transparent'

  colorRows:
    Ember.A([
      Ember.A([
        '#000000',
        '#111111',
        '#434343',
        '#666666',
        '#999999',
        '#AAAAAA',
        '#B7B7B7',
        '#CCCCCC',
        '#D9D9D9',
        '#EFEFEF',
        '#F3F3F3',
        '#FFFFFF'
      ])
      Ember.A([
        '#001F3F',
        '#0074D9',
        '#7FDBFF',
        '#39CCCC',
        '#2ECC40',
        '#01FF70',
        '#FFDC00',
        '#FF851B',
        '#FF4136',
        '#85144B',
        '#B10DC9',
        'transparent'
      ])
    ])

  setupCustomColor: Ember.observer(->
    selectedColor = colorToHex(@get('selectedColor'))
    return if @get('colorRows').find (row) ->
      selectedColor in row.invoke 'toLowerCase'
    @set 'customColor', @get('selectedColor')
  ).on 'init'

  setCustomColor: Ember.observer ->
    if @get('isCustomColorValid') is true
      @set 'selectedColor', expandHexColor(@get('customColor'))
  , 'customColor', 'isCustomColorValid'

  isCustomColorValid: Ember.computed ->
    /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("#{@get('customColor')}")
  .property 'customColor'

  customColorCSS: Ember.computed ->
    "background-color: #{@get('customColor')}"
  .property 'customColor'

  actions:
    setColor: (color) ->
      @set 'customColor', ''
      @set 'selectedColor', color

  userDidSelect: (selection) ->
    @sendAction 'userSelected', selection

`export default ColorPicker`
