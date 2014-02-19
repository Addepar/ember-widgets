helpers = _.merge(Ember.Widgets.TestHelpers.TextEditor)
dispatcher = undefined
textEditor = undefined
textEditorConfig = undefined
view = undefined


module "Text editor unit tests"
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

test 'Todays Date Pill has content', ->
  todaysDatePill = Ember.Widgets.TodaysDatePill.create()
  ok(todaysDatePill.result().length > 0, 'TodaysDatePill has no content')

test 'Text editor has default font size of 2', ->
  equal(textEditor.get('selectedFontSize'), 2)

test 'Text editor appears', ->
  expect 2
  ok isPresent('.text-editor-frame'), 'Text editor frame not found'
  ok helpers.getTextEditor().length > 0, 'Text editor not found'

test "Insert non-editable date pill in text editor", ->
  expect 3
  helpers.insertNonEditableDatePill().then ->
    $textEditor = helpers.getTextEditor()
    pill = find('span.non-editable', $textEditor)
    equal pill.attr('title'), "Today's Date"
    equal pill.attr('data-type'), "Ember.Widgets.TodaysDatePill"
    notEqual pill.attr('data-pill-id'), null
