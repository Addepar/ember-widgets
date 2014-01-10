module "Text editor integration tests",
  teardown: -> App.reset()
  setup: ->
    Ember.run(App, App.advanceReadiness)
    visit('/ember-widgets/textEditor')

KEY_CODES =
  BACKSPACE: 8,
  DELETE: 46,
  DOWN: 40,
  ENTER: 13,
  LEFT: 37,
  RIGHT: 39,
  SPACEBAR: 32,
  TAB: 9,
  UP: 38,
  ESCAPE: 27

insertNonEditableButton = -> find '.insert-non-editable-btn'

insertNonEditable = ->
  selectInChosen(insertNonEditableButton(), "Today's Date")

insertNonEditableWithText = (text="foobar") ->
  selectInChosen(insertNonEditableButton(), "Custom Text").then ->
    fillIn(find('.modal input'), text).then ->
      click find("button:contains('Insert')")

selectedRange = ->
  iframe = @$('iframe.text-editor-frame')[0]
  idocument = iframe.contentDocument || iframe.contentWindow.document
  if idocument.getSelection().rangeCount > 0 then idocument.getSelection().getRangeAt(0) else null

getTextEditor = ->
  find('iframe.text-editor-frame').contents().find('.text-editor')

placeCursorInTextEditor = ->
  range = document.createRange()
  # Select the entire contents of the element with the range
  element = getTextEditor().find('.non-editable-caret')[0]
  range.selectNodeContents(element)
  range.collapse(true)
  selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  return range

typeKeyInTextEditor = (keyCode) ->
  keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keydown', keyCode).then ->
  keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keypress', keyCode).then ->
  keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keyup', keyCode)

test 'Text editor appears', ->
  ok isPresent('.text-editor-frame'), 'Text editor frame not found'
  ok getTextEditor().length > 0, 'Text editor not found'

test "Insert non-editable date pill in text editor", ->
  expect 3
  insertNonEditable().then ->
    textEditor = getTextEditor()
    pill = find('span.non-editable', textEditor)
    equal pill.attr('title'), "Today's Date"
    equal pill.attr('data-type'), "Ember.Widgets.TodaysDatePill"
    notEqual pill.attr('data-pill-id'), null

test "Insert custom text pill in text editor", ->
  expect 4
  insertNonEditableWithText('foobar').then ->
    textEditor = getTextEditor()
    pill = find('span.non-editable', textEditor)
    equal pill.attr('title'), "Custom Text"
    equal pill.attr('data-type'), "Ember.Widgets.NonEditableTextPill"
    equal pill.text(), 'foobar'
    notEqual pill.attr('data-pill-id'), null, 'Pill id is not set'

test "Left arrow selects non-editable pill", ->
  expect 3

  # Given a text editor with a non-editable pill inserted
  insertNonEditable()
  # When the left arrow is pressed immediately after
  .then ->
    typeKeyInTextEditor(KEY_CODES.LEFT)
  # Then the non-editable is selected
  .then ->
    range = selectedRange()
    pill = getTextEditor().find('.non-editable')
    equal range.startOffset, 0, 'Range start is not at beginning of pill, is instead at ' + range.startOffset
    equal range.endOffset, pill.text().length, 'Range end is not at end of pill, is instead at ' + range.endOffset
    equal range.startContainer.parentElement, pill[0]

test "Arrow behavior between factors", ->
  expect 4

  # Given a text editor with the following content
  text_editor_content = """
      <div><span class="non-editable-caret">﻿</span><span class="non-editable factor" data-pill-id="1">Factor 1</span>regular text<span class="non-editable factor" data-pill-id="2">Factor 2</span></div>
  """
  $textEditor = getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the cursor is placed in the text editor
  currentRange = placeCursorInTextEditor()
  ok(currentRange.startOffset is 0 and currentRange.endOffset is 0, "cursor is placed in beginning of text editor content")
  # And the right arrow is pressed
  typeKeyInTextEditor(KEY_CODES.RIGHT)
  # Then the first pill is selected
  .then ->
    range = selectedRange()
    equal range.startContainer.parentElement, find('span.non-editable[data-pill-id="1"]', $textEditor)[0]
    equal range.startOffset, 0
    equal range.endOffset, 8
