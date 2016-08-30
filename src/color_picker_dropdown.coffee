###*
 * ColorPickerDropdownComponent
 *
 * This is an internal-use component to control the logic of the dropdown of
 * the color picker. It contains the color palette and the custom color input
 * @class
 * @augments {Ember.Component, Ember.Widgets.BodyEventListener,
 *            Ember.Widgets.ColorPickerMixin}
###
Ember.Widgets.ColorPickerDropdownComponent =
Ember.Component.extend Ember.Widgets.BodyEventListener,
Ember.Widgets.ColorPickerMixin,
  layoutName: 'color-picker-dropdown'
  dropdownClass: null

  selectedColor: ''

  customColor: ''

  ###*
   * The color palette preset. It is passed in from the ColorPickerComponent.
   * @type {array}
  ###
  colorRows: Ember.computed -> Ember.A()

  setCustomColor: Ember.on 'init', Ember.observer ->
    selectedColor = @get 'selectedColor'
    selectedColor = @colorToHex(selectedColor)
    return @set('customColor', '') if @get('colorRows').find (row) ->
      selectedColor in row.invoke 'toLowerCase'
    @set 'customColor', selectedColor
  , 'selectedColor', 'colorRows'

  ###*
   * This is the formatted string of the input color, for which a hashtag "#"
   * is automatically added if it is not present.
   * @type {string}
  ###
  formattedCustomColor: Ember.computed ->
    customColor = @get('customColor').trim()
    if customColor.charAt(0) isnt '#'
      customColor = '#' + customColor
    return customColor
  .property 'customColor'

  isCustomColorValid: Ember.computed ->
    /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(@get('formattedCustomColor'))
  .property 'formattedCustomColor'

  customColorCSS: Ember.computed ->
    "background-color: #{@get('formattedCustomColor')}"
  .property 'formattedCustomColor'

  userDidSelect: (selection) ->
    @sendAction 'userSelected', selection

  ###*
   * Handle the body click event, i.e. click outside of the component. Here,
   * an action is sent up to inform the color picker component to close the
   * dropdown.
   * @override
   * @function
  ###
  bodyClick: ->
    @sendAction 'hideDropdown'

  actions:
    setColor: (color) ->
      @set 'customColor', ''
      @set 'selectedColor', color
      @sendAction 'setSelectedColor', color, false
      @userDidSelect(color)

    setCustomColor: ->
      if @get('isCustomColorValid')
        color = @get 'formattedCustomColor'
        @sendAction 'setSelectedColor', color, true
        @userDidSelect(color)
