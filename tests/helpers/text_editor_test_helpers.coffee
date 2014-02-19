Ember.Widgets.TestHelpers = Ember.Widgets.TestHelpers || Ember.Namespace.create()
Ember.Widgets.TestHelpers.TextEditor = Ember.Widgets.TestHelpers.TextEditor || Ember.Namespace.create()


###############################################################################
# Object Helpers
###############################################################################

Ember.Widgets.TestHelpers.TextEditor.getInsertNonEditableButton = -> find '.insert-non-editable-btn'
Ember.Widgets.TestHelpers.TextEditor.getTextEditor = ->
  find('iframe.text-editor-frame').contents().find('.text-editor')
Ember.Widgets.TestHelpers.TextEditor.getTextEditorComponent = ->
  id = $('iframe.text-editor-frame').parent()[0].id
  Ember.View.views[id]


###############################################################################
# Actions
###############################################################################

Ember.Widgets.TestHelpers.TextEditor.insertNonEditableDatePill = ->
  selectInChosen(helpers.getInsertNonEditableButton(), "Today's Date")
