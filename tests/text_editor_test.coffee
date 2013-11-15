_find = (app, selector, context) ->
  context = context or Ember.get(app, 'rootElement')
  app.$(selector, context)

_mouseDown = (app, selector, context) ->
  $element = _find app, selector, context
  Ember.run ->
    $element.mousedown()
  wait app

_isPresent = (app, selector, context) ->
  $element = _find app, selector, context
  $element.length > 0

_isNotPresent = (app, selector, context) ->
  not _isPresent(app, selector, context)

_isVisible = (app, selector, context) ->
  $element = _find app, selector, context
  $element.is(':visible')

_isHidden = (app, selector, context) ->
  not _isVisible(app, selector, context)

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
    fillIn searchBox, itemText
  .then ->
    #Need to use filter to get an exact match
    $('li', element).filter -> $.text([this]).trim() is itemText

_findInMultiChosen = (app, element, itemText) ->
  searchBox = find 'input', element
  fillIn(searchBox, itemText).then ->
    #Need to use filter to get an exact match
    $('li', element).filter -> $.text([this]).trim() is itemText

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

Ember.Test.registerHelper 'findInChosen', _findInChosen
Ember.Test.registerHelper 'findInMultiChosen', _findInMultiChosen
Ember.Test.registerHelper 'selectInMultiChosen', _selectInMultiChosen
Ember.Test.registerHelper 'selectFirstInMultiChosen', _selectFirstInMultiChosen
Ember.Test.registerHelper 'selectInChosen', _selectInChosen
Ember.Test.registerHelper 'findInSelect', _findInSelect

Ember.Test.registerHelper 'mouseDown', _mouseDown
Ember.Test.registerHelper 'isPresent', _isPresent
Ember.Test.registerHelper 'isNotPresent', _isNotPresent
Ember.Test.registerHelper 'isVisible', _isVisible
Ember.Test.registerHelper 'isHidden', _isHidden
Ember.Test.registerHelper 'find', _find

App.rootElement = '#app'
App.setupForTesting()
App.injectTestHelpers()

module "Text Editor with Non Editable Test",
  teardown: -> App.reset()
  setup: ->
    Ember.run(App, App.advanceReadiness)
    visit('/ember-widgets/textEditor')


insertNonEditableButton = -> find '.insert-non-editable-btn'

insertNonEditable = -> selectInChosen(insertNonEditableButton(), "Today's Date")

selectedRange = -> window.getSelection().getRangeAt(0)

test "Text editor initialization", ->
  textEditor = find '.text-editor'
  equal textEditor.html().trim(), "<div>&nbsp;</div>"

test "Insert non-editable pill in text editor", ->
  expect 3
  insertNonEditable().then ->
    textEditor = find '.text-editor'
    pill = find('span.non-editable', textEditor)
    equal pill.attr('title'), "Today's Date"
    equal pill.attr('data-type'), "Ember.Widgets.TodaysDate"
    notEqual pill.attr('data-pill-id'), null

test "Left arrow selects non-editable pill", ->
  expect 3

  # Given a text editor with a non-editable pill inserted
  insertNonEditable().then ->
    textEditor = find '.text-editor'

    # When the left arrow is pressed immediately after
    e = $.Event('keydown', { keyCode: 37, which: 37 } )
    textEditor.trigger(e)

    # Then the non-editable is selected
    range = selectedRange()
    pill = $('.non-editable')
    equal range.startOffset, 0
    equal range.endOffset, pill.text().length
    equal range.startContainer.parentElement, pill[0]
