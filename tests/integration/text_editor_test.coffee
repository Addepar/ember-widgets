module "Text editor integration tests",
  teardown: -> App.reset()
  setup: ->
    Ember.run(App, App.advanceReadiness)
    visit('/ember-widgets/textEditor')

insertNonEditableButton = -> find '.insert-non-editable-btn'

insertNonEditable = ->
  selectInChosen(insertNonEditableButton(), "Today's Date")

selectedRange = ->
  iframe = @$('iframe.text-editor-frame')[0]
  idocument = iframe.contentDocument || iframe.contentWindow.document
  if idocument.getSelection().rangeCount > 0 then idocument.getSelection().getRangeAt(0) else null

getTextEditor = ->
  find('iframe.text-editor-frame').contents().find('.text-editor')

test 'Text editor appears', ->
  ok isPresent('.text-editor-frame'), 'Text editor frame not found'
  ok getTextEditor().length > 0, 'Text editor not found'

test "Insert non-editable pill in text editor", ->
  expect 3
  insertNonEditable().then ->
    textEditor = getTextEditor()
    pill = find('span.non-editable', textEditor)
    equal pill.attr('title'), "Today's Date"
    equal pill.attr('data-type'), "Ember.Widgets.TodaysDatePill"
    notEqual pill.attr('data-pill-id'), null

test "Left arrow selects non-editable pill", ->
  expect 3

  # Given a text editor with a non-editable pill inserted
  insertNonEditable().then ->
    textEditor = find '.text-editor'

    # When the left arrow is pressed immediately after
    keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keydown', 37).then ->
    keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keypress', 37).then ->
    keyEvent('.text-editor', $('iframe.text-editor-frame').contents(), 'keyup', 37).then ->
      # Then the non-editable is selected
      range = selectedRange()
      pill = getTextEditor().find('.non-editable')
      equal range.startOffset, 0, 'Range start is not at beginning of pill, is instead at ' + range.startOffset
      equal range.endOffset, pill.text().length, 'Range end is not at end of pill, is instead at ' + range.endOffset
      equal range.startContainer.parentElement, pill[0]
