moduleForComponent 'select', '[Unit] Select component',
  needs: [
    'template:select'
    'template:select-item'
    'template:select-item-layout'
    'template:select-item'
  ]

test 'Test continuous queries in a row', ->
  expect 5

  select = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  select.set 'query', 'ba'
  equal(select.get('filteredContent')[0], 'bar')
  equal(select.get('filteredContent')[1], 'barca')
  equal(select.get('filteredContent')[2], 'baz')

  select.set 'query', 'bar'
  equal(select.get('filteredContent')[0],'bar')
  equal(select.get('filteredContent')[1],'barca')

test 'Test using array proxy', ->
  expect 2

  data = Ember.ArrayProxy.create
    content: ['red', 'reddit', 'green', 'blue']
  select = @subject
    content: data

  select.set 'query', 're'
  equal(select.get('filteredContent')[0], 'red')
  equal(select.get('filteredContent')[1], 'reddit')

test 'Test sorted filter', ->
  expect 3

  select = @subject
    content: ['reddit', 'red', 'green', 'blue']

  select.set 'query', 'r'
  equal(select.get('sortedFilteredContent')[0], 'green')
  equal(select.get('sortedFilteredContent')[1], 'red')
  equal(select.get('sortedFilteredContent')[2], 'reddit')

test 'Test keyboard interaction', ->
  expect 10
  selectedText = null

  select = @subject
    content: ['foo', 'bar', 'barca', 'baz']
  @append()

  selectComponent = select.$()

  validateDropdownVisible = (messageVisible) ->
    ok isVisible(find '.ember-select-results', selectComponent),
      messageVisible

  validateDropdownHidden = (messageHidden) ->
    ok isHidden(find '.ember-select-results', selectComponent),
      messageHidden

  validateFocus = (messageFocus) ->
    ok isFocused(selectComponent,selectComponent), messageFocus

  validateDropdownHidden('Dropdown list should not exist at the beginning')
  selectComponent.focus()

  # test pressing ENTER key to open dropdown
  pressEnter(selectComponent)
  andThen ->
    validateDropdownVisible('Dropdown list should appear after pressing Enter')

    # test pressing DOWN arrowkey to navigate selection down
  pressDownArrow(selectComponent)
  andThen ->
    resultItems = find '.ember-select-result-item', selectComponent
    ok $(resultItems[1]).hasClass('highlighted'),
      'The second option should be highlighted'

    # test pressing UP arrowkey to navigate selection up
  pressUpArrow(selectComponent)
  andThen ->
    resultItems = find '.ember-select-result-item', selectComponent
    ok $(resultItems[0]).hasClass('highlighted'),
      'The first option should be highlighted'

    # test selecting option using ENTER key
    selectedText = $(resultItems[0]).text()
  pressEnter(selectComponent)
  andThen ->
    validateFocus('Select component should be focused after selecting
      one option')
    validateDropdownHidden('Dropdown list should be hidden after selecting
      an option')

    # test if selected Item is actually selected
    resultItems = find '.ember-select-result-item', selectComponent
    currentText = $(resultItems[0]).text()
    equal(selectedText,
      find('.ember-select-result-item:eq(0)',selectComponent).text(),
      'The selected item is not the one was Enter pressed')

    # test if dropdown appears when we start typing letter ('a' is input here)
  keyEvent(selectComponent, 'keydown', 97)
  andThen ->
    validateDropdownVisible('Dropdown list should appear after pressing
     a letter')

    # test if dropdown disappears after pressing ESC
  pressESC(selectComponent)
  andThen ->
    validateDropdownHidden('Dropdown list should be hidden after
      pressing ESC')
    validateFocus('Select component should be focused after pressing ESC')

test 'Test selection label', ->
  expect 2

  data = [{name: 'reddit'}, {name: 'red'}]
  select = @subject
    content: data
    selection: data[0]
    optionLabelPath: 'name'

  equal(select.get('selectedLabel'), 'reddit')
  select.set 'selection.name', 'blues'
  equal(select.get('selectedLabel'), 'blues')

test 'Test query matching', ->
  expect 6

  select = @subject
    content: ['foo', 'bana$ na', 'bar ca', 'baz']

  select.set 'query', '   '
  equal(select.get('filteredContent').length, 4)

  select.set 'query', ' a '
  equal(select.get('filteredContent').length, 3)

  select.set 'query', 'bar  ca'
  equal(select.get('filteredContent').length, 1)

  select.set 'query', 'barca'
  equal(select.get('filteredContent').length, 0)

  select.set 'query', 'bana$'
  equal(select.get('filteredContent').length, 1)

  select.set 'query', 'bana[ na'
  equal(select.get('filteredContent').length, 0)
