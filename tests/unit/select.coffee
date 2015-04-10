select = null
dispatcher = null

module "[Unit] Select unit tests",
  setup: ->
    Ember.run ->
      dispatcher = Ember.EventDispatcher.create()
      dispatcher.setup()
      select = Ember.Widgets.SelectComponent.create
        content: ['foo', 'bar', 'barca', 'baz']

  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      select.destroy()

test 'Test continuous queries in a row', ->
  expect 5

  select.set 'query', 'ba'
  equal(select.get('filteredContent')[0], 'bar')
  equal(select.get('filteredContent')[1], 'barca')
  equal(select.get('filteredContent')[2], 'baz')

  select.set 'query', 'bar'
  equal(select.get('filteredContent')[0],'bar')
  equal(select.get('filteredContent')[1],'barca')

test 'Test using array proxy', ->
  expect 2

  data = Ember.ArrayProxy.create({
    content: ['red', 'reddit', 'green', 'blue']
  });
  select.set 'content', data

  select.set 'query', 're'
  equal(select.get('filteredContent')[0], 'red')
  equal(select.get('filteredContent')[1], 'reddit')

test 'Test sorted filter', ->
  expect 3

  data = ['reddit', 'red', 'green', 'blue']
  select.set 'content', data

  select.set 'query', 'r'
  equal(select.get('sortedFilteredContent')[0], 'green')
  equal(select.get('sortedFilteredContent')[1], 'red')
  equal(select.get('sortedFilteredContent')[2], 'reddit')

test 'Test keyboard interaction', ->
  expect 10
  selectedText = null

  Ember.run ->
    append(select)

  Ember.run ->
    selectComponent = select.$()

    ok isHidden(find '.ember-select-results', selectComponent, 'Dropdown list should not exist at the beginning')
    selectComponent.focus()
    wait().then ->
      # test pressing ENTER key to open dropdown
      keyEvent(selectComponent, 'keydown', 13)
    .then ->
      ok isVisible(find '.ember-select-results', selectComponent, 'Dropdown list should appear after pressing Enter')

      # test pressing DOWN arrowkey to navigate selection down
      keyEvent(selectComponent, 'keydown', 40)

    .then ->
      resultItems = find '.ember-select-result-item', selectComponent
      ok $(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted'

      # test pressing UP arrowkey to navigate selection down
      keyEvent(selectComponent, 'keydown', 38)

    .then ->
      resultItems = find '.ember-select-result-item', selectComponent
      ok $(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted'

      # test selecting option using ENTER key
      selectedText = $(resultItems[0]).text()
      keyEvent(selectComponent, 'keydown', 13)

    .then ->
      ok isFocus(selectComponent,selectComponent, 'Select component should be focused after selecting one option')
      ok isHidden(find '.ember-select-results', selectComponent, 'Dropdown list should be hidden after selecting an option')

      # test if selected Item is actually selected
      resultItems = find '.ember-select-result-item', selectComponent
      currentText = $(resultItems[0]).text()
      equal(selectedText, currentText)

      # test if dropdown appears when we start typing letter ('a' is input here)
      keyEvent(selectComponent, 'keydown', 97)

    .then ->
      ok isVisible(find '.ember-select-results', selectComponent, 'Dropdown list should appear after pressing a letter')

      # test if dropdown disappears after pressing ESC
      keyEvent(selectComponent, 'keydown', 27)

    .then ->
      ok isHidden(find '.ember-select-results', selectComponent, 'Dropdown list should be hidden after pressing ESC')
      ok isFocus(selectComponent, selectComponent, 'Select component should be focused after pressing ESC')
