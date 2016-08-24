###*
 * ColorPickerComponent
 *
 * This is the default color picker component. The color picker button showing
 * the selected color is split as a partial so that it can be customized
 * easily. The dropdown component containing the color palette will only be
 * rendered when needed.
 *
 * @class
 * @augments {Ember.Component, Ember.Widgets.ColorPickerMixin}
###
Ember.Widgets.ColorPickerComponent =
Ember.Component.extend Ember.Widgets.ColorPickerMixin,
  layoutName: 'color-picker'
  classNames: ['color-picker-button']
  colorPickerPlacement: 'right'
  dropdownClass: null

  ###*
   * The color palette preset. It is passed in from the ColorPickerComponent.
   * @type {array} an array of two arrays of hex color strings. The two arrays
   * corresponding to the two color palettes displayed in the dropdown.
  ###
  colorRows: Ember.computed ->
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

  ###*
   * This is the partial template for the colorPicker button.
   * It allows developers to override/style this component differently
   * @type {string}
  ###
  colorPickerButtonPartial: 'color-picker-button-partial'

  ###*
   * This is a boolean to control if we should render the colorPicker dropdown
   * or not. Instead of hiding it using CSS, we use this flag to control the
   * rendering.
   * @type {boolean}
  ###
  isDropdownOpen: false
  selectedColor: '#0074D9'
  customColor: ''

  ###*
   * The property indicates that we have a custom color selected or a color
   * from color palette selected.
   * @type {boolean}
  ###
  isCustomColor: Ember.computed.notEmpty 'customColor'

  ###*
   * Determines whether the color is transparent so the cell renders the
   * transparent style properly
   * @type {Boolean}
  ###
  isColorTransparent: Ember.computed.equal 'selectedColorRGB', 'transparent'

  selectedColorRGB: Ember.computed ->
    selectedColor = @get('selectedColor')
    return @colorToHex(selectedColor)
  .property 'selectedColor'

  actions:
    ###*
     * This action is bound to the colorPicker button to hide/show the dropdown
     * when users click on it.
    ###
    toggleDropdown: ->
      @toggleProperty('isDropdownOpen')

    ###*
     * Send an action outside of the component to inform that a new
     * color is select and also to hide the dropdown.
     * @param {String} selection the selected color hex string
    ###
    userSelected: (selection) ->
      @sendAction 'userSelected', selection
      # After user selects a color, the color picker dropdown will be hidden
      @set 'isDropdownOpen', false

    ###*
     * Hide the color picker dropdown
    ###
    hideDropdown: ->
      @set 'isDropdownOpen', false

    ###*
     * Set the selected color and update the custom color accordingly
     * @param {string}  color the selected color to be updated
     * @param {boolean} isCustomColor the flag to indicate if it is a custom
     *                  color
    ###
    setSelectedColor: (color, isCustomColor) ->
      @set 'selectedColor', color
      if isCustomColor
        @set 'customColor', color
      else
        @set 'customColor', ''

# To maintain compatibility
Ember.Widgets.ColorPicker = Ember.Widgets.ColorPickerComponent
