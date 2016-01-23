select = null
emptyContentSelector = '.ember-select-empty-content'
noResultSelector = '.ember-select-no-results'

moduleForComponent 'select', '[Unit] Select component',
  needs: [
    'template:ember-widgets-select'
    'template:ember-widgets-select-item'
    'template:ember-widgets-select-item-layout'
  ]
  teardown: ->
    Ember.run ->
      select.destroy()
    select = null

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

test 'Test userSelected action', ->
  expect 3

  select = @subject
    content: ['bar', 'baz']
  spy = sinon.spy select, "sendAction"

  @append()

  selectElement = select.$()
  openDropdown(selectElement)
  andThen ->
    ok not spy.calledWith('userSelected'),
      'userSelected action should not be fired when first open the dropdown'
    spy.reset()
  click('li:eq(0)', '.ember-select-results')
  andThen ->
    ok spy.calledWithExactly('userSelected', 'bar'),
      'userSelected action is fired when select one item in the dropdown'
    spy.reset()
  click('.ember-select-result-item', '.dropdown-toggle')
  andThen ->
    ok not spy.calledWith('userSelected'),
      'userSelected action should not be fired when click on the dropdown
      containing highlighted item'

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
  expect 8

  select = @subject
    content: ['foo', 'bana$  na', 'bar ca', 'baz']

  select.set 'query', null
  equal(select.get('filteredContent').length, 4,
    'null queries should return the full list of options')

  select.set 'query', '   '
  equal(select.get('filteredContent').length, 4,
    'queries containing all spaces should return the full list of options')

  select.set 'query', ' a '
  equal(select.get('filteredContent').length, 3,
    'queries containing spaces at two ends should be trimmed')

  select.set 'query', 'bar  ca'
  equal(select.get('filteredContent').length, 1,
    'queries containing duplicated spaces should be removed')

  select.set 'query', 'barca'
  equal(select.get('filteredContent').length, 0,
    'correct spaces should be considered when matching')

  select.set 'query', 'bana$'
  equal(select.get('filteredContent').length, 1,
    'special characters should be considered when matching')

  select.set 'query', 'bana[  na'
  equal(select.get('filteredContent').length, 0,
    'special characters should be considered when matching')

  select.set 'query', 'bana$ n'
  equal(select.get('filteredContent').length, 1,
    'duplicated spaces in the source string should be removed before matching')

test "Show empty content view if content is empty", ->
  expect 5

  EmptyContentView = Ember.View.extend
    layout: Ember.Handlebars.compile(
      "<div class='empty-content-view'>No Content</div>"
    )

  select = @subject
    content: []
    optionLabelPath: 'name'
    optionValuePath: 'code'
    classNames: 'select-class-name'

  @append()

  selectElement = select.$()
  openDropdown(selectElement)
  andThen ->
    ok isPresent(emptyContentSelector, selectElement),
      'Empty content block displayed'
    ok isNotPresent('.empty-content-view', selectElement),
      'Empty content view not displayed before specified'
    ok isNotPresent(noResultSelector, selectElement),
      '"No result" message not displayed'
  andThen ->
    Ember.run ->
      select.set 'emptyContentView', EmptyContentView
  andThen ->
    ok isPresent('.empty-content-view', selectElement),
      'Empty content view displayed'
  andThen ->
    Ember.run ->
      select.set 'emptyContentView', null
  andThen ->
    ok isNotPresent('.empty-content-view', selectElement),
      'Empty content view no longer displayed'


test "Show no-result message if has content but filtered content is empty", ->
  expect 2

  data = [{name: 'reddit'}, {name: 'red'}]
  select = @subject
    content: data
    query: 'Non-existing Name'
    optionLabelPath: 'name'
    classNames: 'select-class-name'

  @append()

  selectElement = select.$()
  openDropdown(selectElement)
  andThen ->
    ok isNotPresent(emptyContentSelector, selectElement),
      'Empty content block not displayed'
    ok isPresent(noResultSelector, selectElement),
      '"No result" message displayed'
