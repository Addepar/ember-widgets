_find = (app, selector, context) ->
  context = context or Ember.get(app, 'rootElement')
  app.$(selector, context)

_mouseDown = (app, selector, context) ->
  $element = _find app, selector, context
  Ember.run ->
    $element.mousedown()
  wait app

_pressEnter = (app, element) ->
  keyEvent(element, 'keydown', 13)

_pressSpacebar = (app, element) ->
  keyEvent(element, 'keydown', 32)

_pressESC = (app, element) ->
  keyEvent(element, 'keydown', 27)

_pressUpArrow = (app, element) ->
  keyEvent(element, 'keydown', 38)

_pressDownArrow = (app, element) ->
  keyEvent(element, 'keydown', 40)

_pressBackspace = (app, element) ->
  keyEvent(element, 'keydown', 8)

_isPresent = (app, selector, context) ->
  $element = _find app, selector, context
  $element.length > 0

_isNotPresent = (app, selector, context) ->
  not _isPresent(app, selector, context)

_isVisible = (app, selector, context) ->
  $element = _find app, selector, context
  $element.is(':visible')

_isFocused = (app, selector, context) ->
  $element = _find app, selector, context
  $element.is(':focus')

_isHidden = (app, selector, context) ->
  not _isVisible(app, selector, context)

_openDropdown = (app, element) ->
  click '.dropdown-toggle', element

# find the first item with the exact matching itemText from a chosen
_findInChosen = (app, element, itemText) ->
  toggleButton = find '.dropdown-toggle', element
  searchBox = find '.ember-select-search input', element
  shouldOpenChosen = isHidden searchBox

  if shouldOpenChosen
    promise = click(toggleButton)
  else
    promise = wait()

  promise.then ->
    #Need to use filter to get an exact match
    $('li', element).filter -> $.text([this]).trim() is itemText

_findInMultiChosen = (app, element, itemText) ->
  searchBox = find 'input', element
  click searchBox
  fillIn(searchBox, itemText).then ->
    #Need to use filter to get an exact match
    $('.js-dropdown-menu li', element).filter -> $.text([this]).trim() is itemText

_selectInMultiChosen = (app, element, itemText) ->
  findInMultiChosen(element, itemText).then (item) ->
    click item

_selectFirstInMultiChosen = (app, element) ->
  searchBox = find 'input', element
  click searchBox
  click $('.ember-select-result-item', element)[0]

# select the first item with the given itemText from a chosen
_selectInChosen = (app, element, itemText) ->
  findInChosen(element, itemText).then (item) ->
    click item

_findInSelect = (app, element, itemText) ->
  toggleButton = find 'a', element
  mouseDown(toggleButton)
  .then ->
    #Need to use filter to get an exact match
    item = $('li', element).filter -> $.text([this]).trim() is itemText
    click item

_openColorChooser = (app, element = 'body') ->
  dropdown = find '.color-picker-button .dropdown', element
  if dropdown.hasClass 'open'
    wait()
  else
    dropdownButton = find '.color-picker-button', element
    click dropdownButton

_closeColorChooser = (app, element = 'body') ->
  dropdown = find '.color-picker-button .dropdown', element
  if dropdown.hasClass 'open'
    dropdownButton = find '.color-picker-button', element
    click dropdownButton

_getSelectedColor = (app) ->
  active = find '.color-picker-dropdown .active'
  if active.length
    rgbVal = active.css('background-color')
    [_, _, _, r, g, b, a, _] = /(.*?)rgb(a)?\((\d+), (\d+), (\d+)(, (\d+))?\)/.exec(rgbVal)
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  else
    find('.color-picker-dropdown .input-sm').val()

_selectColor = (app, colorInHex) ->
  _openColorChooser().then ->
    click '.color-picker-dropdown .color-picker-cell[style*=' + colorInHex + ']'

_fillInCustomColor = (app, value) ->
  textBox = find '.color-picker-dropdown .input-sm'
  fillIn textBox, value


Ember.Test.registerHelper 'find', _find
Ember.Test.registerHelper 'openDropdown', _openDropdown
Ember.Test.registerHelper 'findInChosen', _findInChosen
Ember.Test.registerHelper 'findInMultiChosen', _findInMultiChosen
Ember.Test.registerHelper 'selectInMultiChosen', _selectInMultiChosen
Ember.Test.registerHelper 'selectFirstInMultiChosen', _selectFirstInMultiChosen
Ember.Test.registerHelper 'selectInChosen', _selectInChosen
Ember.Test.registerHelper 'findInSelect', _findInSelect

Ember.Test.registerHelper 'mouseDown', _mouseDown
Ember.Test.registerAsyncHelper 'pressEnter', _pressEnter
Ember.Test.registerAsyncHelper 'pressSpacebar', _pressSpacebar
Ember.Test.registerAsyncHelper 'pressESC', _pressESC
Ember.Test.registerAsyncHelper 'pressUpArrow', _pressUpArrow
Ember.Test.registerAsyncHelper 'pressDownArrow', _pressDownArrow
Ember.Test.registerAsyncHelper 'pressBackspace', _pressBackspace
Ember.Test.registerHelper 'isPresent', _isPresent
Ember.Test.registerHelper 'isNotPresent', _isNotPresent
Ember.Test.registerHelper 'isVisible', _isVisible
Ember.Test.registerHelper 'isFocused', _isFocused
Ember.Test.registerHelper 'isHidden', _isHidden

Ember.Test.registerAsyncHelper 'openColorChooser', _openColorChooser
Ember.Test.registerAsyncHelper 'closeColorChooser', _closeColorChooser
Ember.Test.registerHelper 'getSelectedColor', _getSelectedColor
Ember.Test.registerAsyncHelper 'selectColor', _selectColor
Ember.Test.registerAsyncHelper 'fillInCustomColor', _fillInCustomColor

App.injectTestHelpers()

# Ember QUnit settings
emq.globalize()
setResolver(Ember.DefaultResolver.create({namespace: Ember.Widgets}));
