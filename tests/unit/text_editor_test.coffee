module "Text editor unit tests",


test 'Todays Date Pill has content', ->
  todaysDatePill = Ember.Widgets.TodaysDatePill.create()
  ok(todaysDatePill.result().length > 0, 'TodaysDatePill has no content')


test 'Text editor has default font size of 2', ->
  textEditor = Ember.Widgets.TextEditorWithNonEditableComponent.create()
  equal(textEditor.get('selectedFontSize'), 2)

testDomHelperWrapInDiv = (startContents, expectedEndContents) ->
  startContents = "<div class=\"text-editor\">#{startContents}</div>"
  domHelper = Ember.Object.createWithMixins(Ember.Widgets.DomHelper)
  textEditor = domHelper.createElementsFromString(startContents)
  startElements = textEditor.contents()
  domHelper.wrapInDiv(startElements)
  equal textEditor.html(), expectedEndContents, "The content was not wrapped in a div"


test 'DomHelper.wrapInDiv helper function works when the entire content is not in a div', ->
  startContents = 's'
  expectedEndContents = '<div>s</div>'
  testDomHelperWrapInDiv(startContents, expectedEndContents)


test 'DomHelper.wrapInDiv helper function works when the first line is not in a div', ->
  startContents = 'aaaa<span style="font-weight: bold;">bbbb</span>cccc<div>s</div>'
  expectedEndContents = '<div>aaaa<span style="font-weight: bold;">bbbb</span>cccc</div><div>s</div>'
  testDomHelperWrapInDiv(startContents, expectedEndContents)


test 'DomHelper.wrapInDiv helper function works when the last line is not in a div', ->
  startContents = '<div>aaaa</div><span style="font-weight: bold;">bbbb</span>cccc'
  expectedEndContents = '<div>aaaa</div><div><span style="font-weight: bold;">bbbb</span>cccc</div>'
  testDomHelperWrapInDiv(startContents, expectedEndContents)


test 'DomHelper.wrapInDiv helper function works when the middle line is not in a div', ->
  startContents = '<div>aaaa</div><span style="font-weight: bold;">bbbb</span>cccc<div>ddddd</div>'
  expectedEndContents = '<div>aaaa</div><div><span style="font-weight: bold;">bbbb</span>cccc</div><div>ddddd</div>'
  testDomHelperWrapInDiv(startContents, expectedEndContents)
