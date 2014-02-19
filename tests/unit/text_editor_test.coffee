module "Text editor unit tests"


test 'Todays Date Pill has content', ->
  todaysDatePill = Ember.Widgets.TodaysDatePill.create()
  ok(todaysDatePill.result().length > 0, 'TodaysDatePill has no content')


test 'Text editor has default font size of 2', ->
  textEditor = Ember.Widgets.TextEditorWithNonEditableComponent.create()
  equal(textEditor.get('selectedFontSize'), 2)


test 'DomHelper.wrapInDiv helper function works when the entire content is not in a div', ->
  domHelper = Ember.Object.createWithMixins(Ember.Widgets.DomHelper)
  startHTML = "s"
  endHTML = domHelper.wrapInDiv(startHTML)
  equal endHTML, "<div>s</div>", "The content was not wrapped in a div"


test 'DomHelper.wrapInDiv helper function works when the first line is not in a div', ->
  domHelper = Ember.Object.createWithMixins(Ember.Widgets.DomHelper)
  startHTML = 'aaaa<span style="font-weight: bold;">bbbb</span>cccc<div>s</div>'
  endHTML = domHelper.wrapInDiv(startHTML)
  equal endHTML, '<div>aaaa<span style="font-weight: bold;">bbbb</span>cccc</div><div>s</div>', "The content was not wrapped in a div"


test 'DomHelper.wrapInDiv helper function works when the second line is not in a div', ->
  domHelper = Ember.Object.createWithMixins(Ember.Widgets.DomHelper)
  startHTML = '<div>aaaa</div><span style="font-weight: bold;">bbbb</span>cccc'
  endHTML = domHelper.wrapInDiv(startHTML)
  equal endHTML, '<div>aaaa</div><div><span style="font-weight: bold;">bbbb</span>cccc</div>', "The content was not wrapped in a div"
