helpers = _.merge(Ember.Widgets.TestHelpers.TextEditor)
dispatcher = undefined
textEditor = undefined
textEditorConfig = undefined


module "Text editor component functional tests",
  setup: ->
    dispatcher = Ember.EventDispatcher.create()
    dispatcher.setup()
    textEditor = Ember.Widgets.TextEditorComponent.create()
    textEditorConfig = Ember.Widgets.TextEditorConfigComponent.create({textEditor:textEditor})
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
  $textEditor[0].firstChild.innerHTML = text_editor_content
  helpers.placeCursorAtEndOfTextEditor()
  helpers.typeCharInTextEditor('e')
  .then ->
    # When enter is pressed
    helpers.typeKeyInTextEditor(KEY_CODES.ENTER)
  .then ->
    ok helpers.getTextEditor(), 'Text editor is still there'


test "Bolding text preserves selection", ->
  expect 2

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].firstChild.innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = helpers.selectMatchingTextInTextEditor("world")
  click(helpers.getTextEditor())
  .then ->
    # And then bold is clicked
    click($('button .fa-bold').parent())
  .then ->
    # Then the word "world" is bolded
    equal($textEditor[0].firstChild.innerHTML.trim(), '<div>hello <b>world</b> goodbye</div>', "The word 'world' was not bolded")
    currentRange = helpers.getCurrentRange()
    # And it is still selected
    equal( currentRange.endOffset - currentRange.startOffset, 5, "The word 'world' is no longer selected")


test "Bolding text activates the bold button on the toolbar immediately", ->
  expect 1

  # Given a text editor with some text
  text_editor_content = "<div>hello world goodbye</div>"
  $textEditor = helpers.getTextEditor()
  $textEditor[0].firstChild.innerHTML = text_editor_content
  # When the word "world" is selected
  currentRange = helpers.selectMatchingTextInTextEditor("world")
  click(helpers.getTextEditor())
  .then ->
    # And then bold is clicked
    click($('button .fa-bold').parent())
  .then ->
    # Then the bold button is active
    ok $('button .fa-bold').parent().hasClass('active'), "The bold button is not active"


test "Bold button active state reflects style of text under cursor", ->
  expect 2

  text_editor_content = '<span id="regular-text">aaaa</span><b id="bold-text">bbbb</b>cccc'
  $textEditor = helpers.getTextEditor()
  $textEditor[0].firstChild.innerHTML = text_editor_content
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
