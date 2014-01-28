Ember.Widgets.ColorPicker = Ember.Component.extend
  templateName: 'color_picker'
  classNames: ['color-picker-button']
  colorPickerPlacement: 'right'
  dropdownClass: null

  INITIAL_COLOR: '#0074D9'

  selectedColor: '#0074D9'
  customColor: ''

  colorRows:
    [
      [ '#000000',
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
      ],
      [
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
      ]
    ]

  setCustomColor: Ember.observer ->
    if @get('isCustomColorValid') is true
      @set 'selectedColor', @get 'customColor'
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

Ember.Widgets.ColorPickerCell = Ember.View.extend Ember.Widgets.StyleBindingsMixin,
  templateName: 'color_picker_cell'
  classNames: ['pull-left', 'color-picker-cell']
  classNameBindings: ['isActive:active:inactive']
  styleBindings:  'color:background-color'
  color: null

  isActive: Ember.computed ->
    @get('controller.selectedColor') is @get('color')
  .property 'controller.selectedColor', 'color'

  click: (event) ->
    @get('controller').send 'setColor', @get 'color'
    @get('controller').userDidSelect @get 'color'
