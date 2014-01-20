Ember.Widgets.ColorPicker = Ember.Component.extend
  templateName: 'color_picker'
  classNames: ['color-picker-button']
  selectedColor: '#0074D9'
  colorPickerPlacement: 'right'

  dropdownClass: null
  customColor: null
  isCustomColor: no
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
        '#F012BE',
        '#B10DC9'
      ]
    ]

  customColorCSS: Ember.computed ->
    "background-color: #{@get('customColor')}"
  .property 'customColor'

  actions:
    setColor: (color) ->
      @set 'selectedColor', color

Ember.Widgets.ColorPickerCell = Ember.View.extend Ember.Widgets.StyleBindingsMixin,
  classNames: ['pull-left', 'color-picker-cell']
  classNameBindings: ['isActive:active:inactive']
  styleBindings:  'color:background-color'
  color: null

  isActive: Ember.computed ->
    @get('controller.selectedColor') is @get('color')
  .property 'controller.selectedColor', 'color'

  click: (event) ->
    this.get('controller').send 'setColor', @get('color')
