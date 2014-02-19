helpers = _.merge(Ember.Widgets.TestHelpers.TextEditor)

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

last_event = null

###############################################################################
# Selection / Range Helpers
###############################################################################

getInnerDocument = ->
  iframe = @$('iframe.text-editor-frame')[0]
  iframe.contentDocument || iframe.contentWindow.document
getSelection = ->
  getInnerDocument().getSelection()  # TODO: check browser compatibility
getCurrentRange = ->
  currentSelection = getSelection()
  if currentSelection.rangeCount > 0 then currentSelection.getRangeAt(0) else null
createNewRange = -> document.createRange()  # TODO: browser compatability
activateRange = (range) ->
  selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  return range

###############################################################################
# Event Helpers
###############################################################################

newKeyEvent = (app, selector, context, type, keyCode) ->
  # Same as Ember's key event but saves the event for us to access later
  $el = undefined
  if typeof keyCode is "undefined"
    keyCode = type
    type = context
    context = null
  $el = findWithAssert(app, selector, context)
  event = Ember.$.Event(type,
    keyCode: keyCode
  )
  Ember.run $el, "trigger", event
  last_event = event  # Store event for access later
  return wait(app)

###############################################################################
# Actions
###############################################################################

insertNonEditableDatePill = ->
  selectInChosen(helpers.getInsertNonEditableButton(), "Today's Date")

insertNonEditableTextPill = (text="foobar") ->
  selectInChosen(helpers.getInsertNonEditableButton(), "Custom Text").then ->
    fillIn(find('.modal input'), text).then ->
      click find("button:contains('Insert')")

placeCursorAtEndOfTextEditor = ->
  range = createNewRange()
  editor = helpers.getTextEditor()[0]
  range.selectNodeContents(editor)
  range.collapse false  # collapse to end of range
  activateRange(range)

placeCursorInTextEditor = ->
  range = createNewRange()
  # Select the entire contents of the element with the range
  element = helpers.getTextEditor().find('.non-editable-caret')[0]
  range.selectNodeContents(element)
  range.collapse(true)
  activateRange(range)

selectNodeInTextEditor = (node, startOffset=0, endOffset=-1) ->
  range = createNewRange()
  if node.nodeType == 1  # element node
    node_length = node.childNodes.length
  else if node.nodeType == 3  # text node
    nodeLength = node.length
  else  # no support for other kinds of nodes, just collapse to beginning
    endOffset = 0
  endOffset = if endOffset >= 0 then endOffset else node.length
  range.selectNodeContents(node)
  range.setStart(node, startOffset)
  range.setEnd(node, endOffset)
  activateRange(range)

selectIdInTextEditor = (eid, startOffset, endOffset) ->
  element = helpers.getTextEditor().find('#' + eid)[0].childNodes[0]
  selectNodeInTextEditor(element)

placeCursorAfterElementInTextEditor = (eid, startOffset=0, endOffset=0) ->
  range = createNewRange()
  # Select the entire contents of the element with the range
  element = helpers.getTextEditor().find('#' + eid)[0].childNodes[0]
  range.selectNodeContents(element)
  range.collapse(false)
  activateRange(range)

selectMatchingTextInTextEditor = (text) ->
  innerSelect = (node, pat) ->
    pat = pat.toLowerCase()
    if node.nodeType is 3
      pos = node.data.toLowerCase().indexOf(pat)
      if pos >= 0
        range = createNewRange()
        range.setStart(node, pos)
        range.setEnd(node, pos + pat.length)
        return activateRange(range)
    else if node.nodeType is 1 and node.childNodes and not /(script|style)/i.test(node.tagName)
      i = 0
      while i < node.childNodes.length
        childNode = node.childNodes[i++]
        range = innerSelect(childNode, pat)
        return range if range isnt null
    return null
  innerSelect(helpers.getTextEditor()[0], text)

sendKeyEventToTextEditor = (eventType, keyCode) ->
  newKeyEvent('.text-editor', getInnerDocument(), eventType, keyCode)

typeKeyInTextEditor = (keyCode) ->
  char = String.fromCharCode(keyCode).toLowerCase()
  range = getCurrentRange()
  sendKeyEventToTextEditor('keydown', keyCode).then ->
    if not last_event.isDefaultPrevented()
      if keyCode is KEY_CODES.BACKSPACE
        getInnerDocument().execCommand('Delete', false, null)
      else if keyCode is KEY_CODES.DELETE
        getInnerDocument().execCommand('ForwardDelete', false, null)
      else if typeof (char) is "string"
        if range.startContainer.nodeType is 3 and range.collapsed
          range.startContainer.insertData range.startOffset, char
          range.setStart range.startContainer, range.startOffset + 1
          range.collapse true
          activateRange(range)
        else
          node = getInnerDocument().createTextNode(char)
          range.insertNode node
          range.setStart(node, 1)
          range.collapse true
          activateRange(range)
    sendKeyEventToTextEditor('keypress', keyCode)
  .then ->
    sendKeyEventToTextEditor('keyup', keyCode)

typeCharInTextEditor = (char) ->
  charCode = char.toUpperCase().charCodeAt(0)
  typeKeyInTextEditor(charCode)

test "Type in text editor works", ->
  expect 1
  placeCursorAtEndOfTextEditor()
  typeCharInTextEditor('s').then ->
    equal helpers.getTextEditor()[0].innerHTML.toLowerCase(), '<div>s</div>', 'The character typed did not appear in the text editor'

test "Insert pill via keypress at beginning of text editor", ->
  expect 1

  # Given that the user has entered text to insert a non editable element
  text_editor_content = '<div>=dat</div>'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  placeCursorAtEndOfTextEditor()
  typeCharInTextEditor('e')
  .then ->
    # When enter is pressed
    typeKeyInTextEditor(KEY_CODES.ENTER)
  .then ->
    ok helpers.getTextEditor(), 'Text editor is still there'

test "Left arrow selects non-editable pill", ->
  expect 3

  # Given a text editor with a non-editable pill inserted
  insertNonEditableDatePill()
  # When the left arrow is pressed immediately after
  .then ->
    typeKeyInTextEditor(KEY_CODES.LEFT)
  # Then the non-editable is selected
  .then ->
    range = getCurrentRange()
    pill = helpers.getTextEditor().find('.non-editable')
    equal range.startOffset, 0, 'Range start is not at beginning of pill, is instead at ' + range.startOffset
    equal range.endOffset, pill.text().length, 'Range end is not at end of pill, is instead at ' + range.endOffset
    equal range.startContainer.parentElement, pill[0]


test "Arrow behavior between pills", ->
  expect 4

  # Given a text editor with the following content
  text_editor_content = """
      <div><span class="non-editable-caret">﻿</span><span class="non-editable" data-pill-id="1">Factor 1</span>regular text<span class="non-editable" data-pill-id="2">Factor 2</span></div>
  """
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the cursor is placed in the text editor
  currentRange = placeCursorInTextEditor()
  ok(currentRange.startOffset is 0 and currentRange.endOffset is 0, "cursor is placed in beginning of text editor content")
  # And the right arrow is pressed
  typeKeyInTextEditor(KEY_CODES.RIGHT)
  # Then the first pill is selected
  .then ->
    range = getCurrentRange()
    equal range.startContainer.parentElement, find('span.non-editable[data-pill-id="1"]', $textEditor)[0]
    equal range.startOffset, 0
    equal range.endOffset, 8


test "Arrow behavior between pills on first line", ->
  expect 4

  # Given a text editor with the following content
  text_editor_content = """
      <span class="non-editable-caret">﻿</span><span class="non-editable" data-pill-id="1">Factor 1</span>regular text<span class="non-editable" data-pill-id="2">Factor 2</span>
  """
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the cursor is placed in the text editor
  currentRange = placeCursorInTextEditor()
  ok(currentRange.startOffset is 0 and currentRange.endOffset is 0, "cursor is placed in beginning of text editor content")
  # And the right arrow is pressed
  typeKeyInTextEditor(KEY_CODES.RIGHT)
  # Then the first pill is selected
  .then ->
    range = getCurrentRange()
    equal range.startContainer.parentElement, find('span.non-editable[data-pill-id="1"]', $textEditor)[0]
    equal range.startOffset, 0
    equal range.endOffset, 8


test "Select second pill and delete", ->
  expect 3

  # Given a text editor with two side by side pills
  text_editor_content = """
    <span class="non-editable" data-pill-id="1">Pill 1</span><span class="non-editable" data-pill-id="2" id="to-select">Pill 2</span>
  """
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the second pill is selected
  currentRange = selectIdInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    currentRange = getCurrentRange()
    equal( helpers.getTextEditor().find('#to-select')[0], currentRange.startContainer.parentElement, "the correct pill element is not selected")
    ok(currentRange.startOffset is 0 and currentRange.endOffset is 6, "the correct pill element is not entirely selected")
  .then ->
    # And then the delete key is pressed
    typeKeyInTextEditor(KEY_CODES.DELETE)
  .then ->
    # Then the pill is entirely deleted
    textEditor = helpers.getTextEditor()[0]
    equal(textEditor.innerHTML.trim(), """
      <span class="non-editable" data-pill-id="1">Pill 1</span><span class="non-editable-caret">﻿</span>
    """.trim(), "Pill is entirely deleted from text editor")


test "Select first pill and delete", ->
  expect 3

  # Given a text editor with two side by side pills
  text_editor_content = """
    <span class="non-editable" data-pill-id="1"id="to-select">Pill 1</span><span class="non-editable" data-pill-id="2">Pill 2</span>
  """
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the first pill is selected
  currentRange = selectIdInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    currentRange = getCurrentRange()
    equal( helpers.getTextEditor().find('#to-select')[0], currentRange.startContainer.parentElement, "the correct pill element is not selected")
    ok(currentRange.startOffset is 0 and currentRange.endOffset is 6, "the correct pill element is not entirely selected")
  .then ->
    # And then the delete key is pressed
    typeKeyInTextEditor(KEY_CODES.DELETE)
  .then ->
    # Then the pill is entirely deleted
    textEditor = helpers.getTextEditor()[0]
    equal(textEditor.innerHTML.trim(), """
      <span class="non-editable-caret">﻿</span><span class="non-editable" data-pill-id="2">Pill 2</span>
    """.trim(), "Pill is entirely deleted from text editor")


test "Bolding text preserves selection", ->
  expect 2

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = selectMatchingTextInTextEditor("world")
  click(helpers.getTextEditor())
  .then ->
    # And then bold is clicked
    click($('button .fa-bold').parent())
  .then ->
    # Then the word "world" is bolded
    equal($textEditor[0].innerHTML.trim(), '<div>hello <span style="font-weight: bold;">world</span> goodbye</div>', "The word 'world' was not bolded")
    currentRange = getCurrentRange()
    # And it is still selected
    equal( currentRange.endOffset - currentRange.startOffset, 5, "The word 'world' is no longer selected")


test "Bolding text activates the bold button on the toolbar immediately", ->
  expect 1

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = selectMatchingTextInTextEditor("world")
  click(helpers.getTextEditor())
  .then ->
    # And then bold is clicked
    click($('button .fa-bold').parent())
  .then ->
    # Then the bold button is active
    ok $('button .fa-bold').parent().hasClass('active'), "The bold button is not active"


test "Backspace with pills on many lines", ->
  expect 2

  # Given a text editor with some text
  text_editor_content = '<div><span class="non-editable" data-pill-id="2">and me</span></div><div><span class="non-editable" id="to-select" data-pill-id="4">Put cursor here and delete me--&gt;</span></div><div>hello</div>'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the pill is selected
  currentRange = placeCursorAfterElementInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    # And then the backspace key is pressed
    sendKeyEventToTextEditor('keydown', KEY_CODES.BACKSPACE)
  .then ->
    # Then a non editable caret is inserted after the pill about to be deleted
    equal($textEditor[0].innerHTML.trim(), '<div><span class="non-editable" data-pill-id="2">and me</span></div><div><span class="non-editable" id="to-select" data-pill-id="4">Put cursor here and delete me--&gt;</span><span class="non-editable-caret">﻿</span></div><div>hello</div>', "The html content is incorrect")
    currentRange = getCurrentRange()
    # And the pill is selected
    equal(currentRange.endOffset - currentRange.startOffset, 32, "The pill is not selected")
    # At this point, the browser would finish the backspace event, though we can't test it

test "Non editable caret on it's own line is replaced with a break", ->
  # This test only applies to chrome...
  expect 1

  # Given a text editor with some text
  text_editor_content = '<div><span class="non-editable" data-pill-id="1">A pill</span></div><div><span class="non-editable-caret">﻿</span></div><div>hello</div>'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the the text editor is clicked
  currentRange = placeCursorInTextEditor()
  click(helpers.getTextEditor())
  .then ->
    # Then the caret is replaced with a break
    equal($textEditor[0].innerHTML.trim(), '<div><span class="non-editable" data-pill-id="1">A pill</span></div><div><br></div><div>hello</div>', "The html content is incorrect")


test "Insert non-editable on new line stays on new line", ->
  expect 1

  text_editor_content = '<div><span class="non-editable" title="Custom Text" data-text="hello" data-pill-id="1" data-type="Ember.Widgets.NonEditableTextPill">hello</span></div><div>=tod</div>'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the the text editor is clicked
  currentRange = placeCursorAtEndOfTextEditor()
  click(helpers.getTextEditor())
  .then ->
    typeCharInTextEditor('a')
  .then ->
    # When enter is pressed
    typeKeyInTextEditor(KEY_CODES.ENTER)
  .then ->
    editor = helpers.getTextEditorComponent()
    equal editor.serialize(), '<div><span class="non-editable" title="Custom Text" data-text="hello" data-pill-id="1" data-type="Ember.Widgets.NonEditableTextPill"></span></div><div><span class="non-editable" title="Today\'s Date" data-pill-id="1" data-type="Ember.Widgets.TodaysDatePill"></span><span class="non-editable-caret">﻿</span></div>'
