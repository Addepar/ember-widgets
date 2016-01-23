multiSelect = null

moduleForComponent 'multi-select', '[Unit] Multi select component',
  needs: [
    'template:multi-select'
    'template:multi-select-item'
    'template:ember-widgets-select-item-layout'
    'template:ember-widgets-select-item'
  ]
  teardown: ->
    Ember.run ->
      multiSelect.destroy()
    multiSelect = null

test 'Test preparedContent after some options are already selected', ->
  expect 2
  multiSelect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiSelect.set 'selections', ['bar', 'baz']
  multiSelect.set 'query', 'ba'

  equal(multiSelect.get('preparedContent').length, 1)
  equal(multiSelect.get('preparedContent')[0], 'barca')

test 'Query should not be reset on select if resetQueryOnSelect is false', ->
  expect 1
  multiSelect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiSelect.set 'resetQueryOnSelect', false
  multiSelect.set 'query', 'ba'
  multiSelect.set 'selections', ['bar', 'baz']

  equal(multiSelect.get('query'), 'ba')

test 'Query should be reset on select if resetQueryOnSelect is true', ->
  expect 1
  multiSelect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiSelect.set 'resetQueryOnSelect', true
  multiSelect.set 'query', 'ba'
  multiSelect.set 'selections', ['bar', 'baz']

  equal(multiSelect.get('query'), '')

test 'Test keyboard and mouse interaction', ->
  expect 15
  selectedText = null

  multiSelect = @subject
    content: ['foo', 'bar', 'barca', 'baz']
  @append()

  multiSelectComponent = multiSelect.$()
  highlightedComponent = find '.ember-select-multi', multiSelectComponent
  textField = find '.ember-text-field', multiSelectComponent

  validateDropdownVisible = (messageVisible) ->
    ok isVisible(find '.ember-select-results', multiSelectComponent),
      messageVisible

  validateDropdownHidden = (messageHidden) ->
    ok isHidden(find '.ember-select-results', multiSelectComponent),
      messageHidden

  validateTextFieldFocus = (messageFocus) ->
    ok isFocused(textField,multiSelectComponent), messageFocus

  multiSelectComponent.focus()

  # test pressing ENTER key to open dropdown
  pressEnter(multiSelectComponent)
  andThen ->
    validateDropdownVisible('Dropdown list should appear after pressing
      Enter')
    resultItems = find '.ember-select-result-item', multiSelectComponent
    ok $(resultItems[0]).hasClass('highlighted'),
      'The first option should be highlighted'
    # test selecting option using ENTER key
    selectedText = $(resultItems[0]).text().trim()

  pressEnter(multiSelectComponent)
  andThen ->
    validateTextFieldFocus(
      'Text field should still be focused after selecting using Enter')
    # test if selected Item is actually selected
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    currentText = $(resultItems[resultItems.length - 1]).text().trim()
    # we are using character "x" to make it look like a close button so
    # here we need to trim this letter at the end of the select choice text
    # note that it has multiple lines, so we have to remove the `\n` characters
    currentText = currentText.replace(/\n/g,'').replace(/×$/, '')
    equal(currentText, selectedText,
      'The current highlighted option should be the last choice pill in
      the list')

  # open dropdown when clicking on the text field
  click(textField)
  andThen ->
    validateDropdownVisible(
      'Dropdown list should appear after clicking on the input field')

  # make one more selection
  pressEnter(multiSelectComponent)
  andThen ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 2, 'There should be 2 selected items')

  # test deleting using keyboard
  pressBackspace(textField)
  andThen ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 1,
      'There should be 1 selected item after deleting one')
    validateTextFieldFocus(
      'Dropdown list should still be shown after deleting using keyboard',
      'Text field should be focused after pressing delete')

  # test pressing Spacebar to open the dropdown
  pressSpacebar(multiSelectComponent)
  andThen ->
    validateDropdownVisible(
      'Dropdown list should appear after pressing Spacebar')

  # test adding using mouse
  click('.ember-select-result-item:eq(0)', multiSelectComponent)
  andThen ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 2, 'There should be 2 selected items after
      selecting one item using mouse')
    validateTextFieldFocus(
      'Text field should be focused after selecting using mouse')

  # test deleting one selected item using mouse
  click('.ember-select-search-choice-close:eq(0)', multiSelectComponent)
  andThen ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 1,
      'There should be 1 selected item after deleting one item using mouse')
    validateTextFieldFocus(
      'Text field should be focused after deleting using mouse')

  # test if dropdown appears when we start typing letter ('a' is input here)
  keyEvent(multiSelectComponent, 'keydown', 97)
  andThen ->
    validateDropdownVisible(
      'Dropdown list should appear after pressing a letter')

  # test hitting ESC will close the dropdown
  pressESC(multiSelectComponent)
  andThen ->
    validateDropdownHidden(
      'Dropdown list should be hidden after pressing ESC')
