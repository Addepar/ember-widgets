moduleForComponent 'multi-select', '[Unit] Multi select component'

test 'Test preparedContent after some options are already selected', ->
  expect 2
  multiselect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiselect.set 'selections', ['bar', 'baz']
  multiselect.set 'query', 'ba'

  equal(multiselect.get('preparedContent').length, 1)
  equal(multiselect.get('preparedContent')[0], 'barca')

test 'Query should not be reset on select if resetQueryOnSelect is false', ->
  expect 1
  multiselect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiselect.set 'resetQueryOnSelect', false
  multiselect.set 'query', 'ba'
  multiselect.set 'selections', ['bar', 'baz']

  equal(multiselect.get('query'), 'ba')

test 'Query should be reset on select if resetQueryOnSelect is true', ->
  expect 1
  multiselect = @subject
    content: ['foo', 'bar', 'barca', 'baz']

  multiselect.set 'resetQueryOnSelect', true
  multiselect.set 'query', 'ba'
  multiselect.set 'selections', ['bar', 'baz']

  equal(multiselect.get('query'), '')

test 'Test keyboard and mouse interaction', ->
  expect 15
  selectedText = null

  append(multiSelect)

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
  wait().then ->
    # test pressing ENTER key to open dropdown
    pressEnter(multiSelectComponent)
  .then ->
    validateDropdownVisible('Dropdown list should appear after pressing
      Enter')
    resultItems = find '.ember-select-result-item', multiSelectComponent
    ok $(resultItems[0]).hasClass('highlighted'),
      'The first option should be highlighted'
    # test selecting option using ENTER key
    selectedText = $(resultItems[0]).text().trim()

    pressEnter(multiSelectComponent)
  .then ->
    validateTextFieldFocus('Text field should still be focused after
      selecting using Enter')
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
  .then ->
    validateDropdownVisible('Dropdown list should appear after clicking
      on the input field')

    # make one more selection
    pressEnter(multiSelectComponent)
  .then ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 2, 'There should be 2 selected items')

    # test deleting using keyboard
    pressBackspace(textField)
  .then ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 1,
      'There should be 1 selected item after deleting one')
    validateTextFieldFocus('Dropdown list should still be shown after
      deleting using keyboard','Text field should be focused after
      pressing delete')

    # test pressing Spacebar to open the dropdown
    pressSpacebar(multiSelectComponent)
  .then ->
    validateDropdownVisible('Dropdown list should appear after pressing
      Spacebar')

    # test adding using mouse
    click('.ember-select-result-item:eq(0)', multiSelectComponent)
  .then ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 2, 'There should be 2 selected items after
      selecting one item using mouse')
    validateTextFieldFocus('Text field should be focused after selecting
      using mouse')

    # test deleting one selected item using mouse
    click('.ember-select-search-choice-close:eq(0)', multiSelectComponent)
  .then ->
    resultItems = find '.ember-select-search-choice', multiSelectComponent
    equal(resultItems.length, 1,
      'There should be 1 selected item after deleting one item using mouse')
    validateTextFieldFocus('Text field should be focused after deleting
      using mouse')

    # test if dropdown appears when we start typing letter ('a' is input here)
    keyEvent(multiSelectComponent, 'keydown', 97)
  .then ->
    validateDropdownVisible('Dropdown list should appear after pressing
      a letter')

    # test hitting ESC will close the dropdown
    pressESC(multiSelectComponent)
  .then ->
    validateDropdownHidden('Dropdown list should be hidden after pressing
      ESC')
>>>>>>> Improve usability of Select component
