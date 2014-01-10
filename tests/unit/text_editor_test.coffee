module "Text editor unit tests"

test 'Todays Date Pill has content', ->
  todaysDatePill = Ember.Widgets.TodaysDatePill.create()
  ok(todaysDatePill.result().length > 0, 'TodaysDatePill has no content')

test 'Text editor has default font size of 2', ->
  textEditor = Ember.Widgets.TextEditorComponent.create()
  equal(textEditor.get('selectedFontSize'), 2)
