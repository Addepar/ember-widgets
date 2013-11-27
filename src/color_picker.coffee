Ember.Widgets.ColorPicker = Ember.Component.extend
  templateName: 'color_picker'
  classNames: ['color-picker']
  selectedColor: 'rgb(40, 90, 200)'
  colorPickerPlacement: 'right'

  colorRows:
    [
      [ 'rgb(0, 0, 0)',
        'rgb(67, 67, 67)',
        'rgb(102, 102, 102)',
        'rgb(183, 183, 183)',
        'rgb(204, 204, 204)',
        'rgb(217, 217, 217)',
        'rgb(239, 239, 239)',
        'rgb(243, 243, 243)'
      ],
      [
        'rgb(152, 0, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 153, 0)',
        'rgb(255, 255, 0)',
        'rgb(0, 255, 0)',
        'rgb(0, 255, 255)',
        'rgb(0, 0, 255)',
        'rgb(153, 0, 255)'
      ]
    ]

  actions:
    setColor: (color) ->
      @set 'selectedColor', color

Ember.Widgets.ColorPickerCell = Ember.View.extend Ember.Widgets.StyleBindingsMixin,
  attributeBindings: ['color']
  styleBindings:  'color:background-color'
  color: null

  click: (event) ->
    this.get('controller').send 'setColor', @get('color')
