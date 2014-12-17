helpers = _.merge(Ember.Widgets.TestHelpers.TextEditor)
dispatcher = undefined
textEditor = undefined
textEditorConfig = undefined


module "Text editor with non editable pill component functional tests",
  setup: ->
    dispatcher = Ember.EventDispatcher.create()
    dispatcher.setup()
    textEditor = Ember.Widgets.TextEditorWithNonEditableComponent.create()
    textEditorConfig = Ember.Widgets.TextEditorWithNonEditableConfigComponent.create({textEditor:textEditor})
    append(textEditorConfig)
    append(textEditor)
  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      textEditorConfig.destroy()
      textEditor.destroy()


test 'Text editor appears', ->
  expect 2
  ok isPresent('.text-editor-frame'), 'Text editor frame not found'
  ok helpers.getTextEditor().length > 0, 'Text editor not found'


test "Insert non-editable date pill in text editor", ->
  expect 3
  helpers.insertNonEditableDatePill().then ->
    $textEditor = helpers.getTextEditor()
    $pill = find('span.non-editable', $textEditor)
    equal $pill.attr('title'), "Today's Date"
    equal $pill.attr('data-type'), "Ember.Widgets.TodaysDatePill"
    notEqual $pill.attr('data-pill-id'), null


test "Insert custom text pill in text editor", ->
  expect 4
  helpers.insertNonEditableTextPill('foobar').then ->
    $textEditor = helpers.getTextEditor()
    $pill = find('span.non-editable', $textEditor)
    equal $pill.attr('title'), "Custom Text"
    equal $pill.attr('data-type'), "Ember.Widgets.NonEditableTextPill"
    equal $pill.text(), 'foobar'
    notEqual $pill.attr('data-pill-id'), null, 'Pill id is not set'


test "Type in text editor works", ->
  expect 1
  helpers.placeCursorAtEndOfTextEditor()
  helpers.typeCharInTextEditor('s').then ->
    equal helpers.getTextEditor()[0].firstChild.innerHTML.toLowerCase(), 's', 'The character typed did not appear in the text editor'


test "Insert pill via keypress at beginning of text editor", ->
  expect 1

  # Given that the user has entered text to insert a non editable element
  text_editor_content = '<div>=dat</div>'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  helpers.placeCursorAtEndOfTextEditor()
  helpers.typeCharInTextEditor('e')
  .then ->
    # When enter is pressed
    helpers.typeKeyInTextEditor(KEY_CODES.ENTER)
  .then ->
    ok helpers.getTextEditor(), 'Text editor is still there'


test "Left arrow selects non-editable pill", ->
  expect 2

  # Given a text editor with a non-editable pill inserted
  helpers.insertNonEditableDatePill()
  # When the left arrow is pressed immediately after
  .then ->
    helpers.typeKeyInTextEditor(KEY_CODES.LEFT)
  # Then the non-editable is selected
  .then ->
    range = helpers.getCurrentRange()
    pill = helpers.getTextEditor().find('.non-editable')
    equal range.toString().length, pill.text().length, 'Range end is not at end of pill, is instead at ' + range.endOffset
    equal range.startContainer, pill[0]


test "Arrow behavior between pills", ->
  expect 4

  # Given a text editor with the following content
  text_editor_content = """
      <span class="non-editable-caret">﻿</span><span class="non-editable" data-pill-id="1">Factor 1</span>regular text<span class="non-editable" data-pill-id="2">Factor 2</span>
  """
  $textEditor = helpers.getTextEditor()
  $textEditor[0].firstChild.innerHTML = text_editor_content
  # When the cursor is placed in the text editor
  currentRange = helpers.placeCursorInTextEditor()
  ok(currentRange.startOffset is 0 and currentRange.endOffset is 0, "cursor is placed in beginning of text editor content")
  # And the right arrow is pressed
  helpers.typeKeyInTextEditor(KEY_CODES.RIGHT)
  # Then the first pill is selected
  .then ->
    range = helpers.getCurrentRange()
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
  currentRange = helpers.placeCursorInTextEditor()
  ok(currentRange.startOffset is 0 and currentRange.endOffset is 0, "cursor is placed in beginning of text editor content")
  # And the right arrow is pressed
  helpers.typeKeyInTextEditor(KEY_CODES.RIGHT)
  # Then the first pill is selected
  .then ->
    range = helpers.getCurrentRange()
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
  currentRange = helpers.selectIdInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    currentRange = helpers.getCurrentRange()
    equal( helpers.getTextEditor().find('#to-select')[0], currentRange.startContainer.parentElement, "the correct pill element is not selected")
    ok(currentRange.startOffset is 0 and currentRange.endOffset is 6, "the correct pill element is not entirely selected")
  .then ->
    # And then the delete key is pressed
    helpers.typeKeyInTextEditor(KEY_CODES.DELETE)
  .then ->
    # Then the pill is entirely deleted
    $textEditor = helpers.getTextEditor()[0]
    equal($textEditor.innerHTML.trim(), """
      <div><span class="non-editable" data-pill-id="1">Pill 1</span><span class="non-editable-caret">﻿</span></div>
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
  currentRange = helpers.selectIdInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    currentRange = helpers.getCurrentRange()
    equal( helpers.getTextEditor().find('#to-select')[0], currentRange.startContainer.parentElement, "the correct pill element is not selected")
    ok(currentRange.startOffset is 0 and currentRange.endOffset is 6, "the correct pill element is not entirely selected")
  .then ->
    # And then the delete key is pressed
    helpers.typeKeyInTextEditor(KEY_CODES.DELETE)
  .then ->
    # Then the pill is entirely deleted
    $textEditor = helpers.getTextEditor()[0]
    equal($textEditor.innerHTML.trim(), """
      <div><span class="non-editable-caret">﻿</span><span class="non-editable" data-pill-id="2">Pill 2</span></div>
    """.trim(), "Pill is entirely deleted from text editor")


test "Bolding text preserves selection", ->
  expect 2

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = helpers.selectMatchingTextInTextEditor("world")
  click(helpers.getTextEditor())
  .then ->
    # And then bold is clicked
    click($('button .fa-bold').parent())
  .then ->
    # Then the word "world" is bolded
    equal($textEditor[0].innerHTML.trim(), '<div>hello <span style="font-weight: bold;">world</span> goodbye</div>', "The word 'world' was not bolded")
    currentRange = helpers.getCurrentRange()
    # And it is still selected
    equal( currentRange.endOffset - currentRange.startOffset, 5, "The word 'world' is no longer selected")


test "Bolding text activates the bold button on the toolbar immediately", ->
  expect 1

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = helpers.selectMatchingTextInTextEditor("world")
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
  currentRange = helpers.placeCursorAfterElementInTextEditor("to-select")
  click(helpers.getTextEditor())
  .then ->
    # And then the backspace key is pressed
    helpers.sendKeyEventToTextEditor('keydown', KEY_CODES.BACKSPACE)
  .then ->
    # Then a non editable caret is inserted after the pill about to be deleted
    equal($textEditor[0].innerHTML.trim(), '<div><span class="non-editable" data-pill-id="2">and me</span></div><div><span class="non-editable" id="to-select" data-pill-id="4">Put cursor here and delete me--&gt;</span><span class="non-editable-caret">﻿</span></div><div>hello</div>', "The html content is incorrect")
    currentRange = helpers.getCurrentRange()
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
  currentRange = helpers.placeCursorInTextEditor()
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
  currentRange = helpers.placeCursorAtEndOfTextEditor()
  click(helpers.getTextEditor())
  .then ->
    helpers.typeCharInTextEditor('a')
  .then ->
    # When enter is pressed
    helpers.typeKeyInTextEditor(KEY_CODES.ENTER)
  .then ->
    editor = helpers.getTextEditorComponent()
    equal editor.serialize(), '<div><span class="non-editable" title="Custom Text" data-text="hello" data-pill-id="1" data-type="Ember.Widgets.NonEditableTextPill"></span></div><div><span class="non-editable" title="Today\'s Date" data-pill-id="1" data-type="Ember.Widgets.TodaysDatePill"></span><span class="non-editable-caret">﻿</span></div>'


test "First line is wrapped in div", ->
  expect 1

  text_editor_content = 'aaaa<span style="font-weight: bold;">bbbb</span>cccc'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the the text editor is clicked
  currentRange = helpers.placeCursorAtEndOfTextEditor()
  click(helpers.getTextEditor())
  .then ->
    editor = helpers.getTextEditorComponent()
    equal editor.serialize(), '<div>aaaa<span style="font-weight: bold;">bbbb</span>cccc</div>'


test "Bold button active state reflects style of text under cursor", ->
  expect 2

  text_editor_content = '<span id="regular-text">aaaa</span><span style="font-weight: bold;" id="bold-text">bbbb</span>cccc'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].innerHTML = text_editor_content
  # When the bolded text is selected
  currentRange = helpers.selectIdInTextEditor("bold-text", 1, 2)
  click(helpers.getTextEditor())
  .then ->
    ok find(".js-btn-bold").hasClass('active'), "Bold button should be active when bold text is selected"
    # When the unbolded text is selected
    currentRange = helpers.selectIdInTextEditor("regular-text", 1, 2)
    click(helpers.getTextEditor())
  .then ->
    ok !find(".js-btn-bold").hasClass('active'), "Bold button should not be active when regular text is selected"


test "After selecting font, text editor is focused", ->
  expect 1

  helpers.placeCursorAtEndOfTextEditor()
  helpers.typeCharInTextEditor('s').then ->
    # And then bold is clicked
    selectComponent = $('.js-ember-text-editor-font-family-select')
    selectInChosen(selectComponent, 'Arial')
  .then ->
    equal helpers.getTextEditor()[0].ownerDocument.activeElement.className, 'text-editor', "Text editor should be active"
