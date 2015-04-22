multiSelect = null
dispatcher = null

module "[Unit] Multi-Select Component unit tests",
  setup: ->
    Ember.run ->
      dispatcher = Ember.EventDispatcher.create()
      dispatcher.setup()
      multiSelect = Ember.Widgets.MultiSelectComponent.create
        content: ['foo', 'bar', 'barca', 'baz']

  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      multiSelect.destroy()

test 'Test preparedContent after some options are already selected', ->
  expect 2
  multiSelect.set 'selections', ['bar', 'baz']
  multiSelect.set 'query', 'ba'
  equal(multiSelect.get('preparedContent').length, 1)
  equal(multiSelect.get('preparedContent')[0], 'barca')

test 'Test keyboard and mouse interaction', ->
  expect 17
  selectedText = null

  Ember.run ->
    append(multiSelect)

  Ember.run ->
    multiSelectComponent = multiSelect.$()
    highlightedComponent = find '.ember-select-multi', multiSelectComponent
    textField = find '.ember-text-field', multiSelectComponent

    validateFocusAndDropdown = (messageVisible, messageFocus) ->
      ok isVisible find '.ember-select-results', multiSelectComponent,
        messageVisible
      ok isFocused(textField,multiSelectComponent, messageFocus)

    multiSelectComponent.focus()
    wait().then ->
      # test pressing ENTER key to open dropdown
      keyEvent(multiSelectComponent, 'keydown', 13)
    .then ->
      ok(isVisible(find '.ember-select-results', multiSelectComponent,
        'Dropdown list should appear after pressing Enter'))
      resultItems = find '.ember-select-result-item', multiSelectComponent
      ok($(resultItems[0]).hasClass('highlighted'),
        'The first option should be highlighted')
      # test selecting option using ENTER key
      selectedText = $(resultItems[0]).text().trim()

      keyEvent(multiSelectComponent, 'keydown', 13)
    .then ->
      validateFocusAndDropdown('Dropdown list should still be visible after
        selecting an option','Text field should still be focused after
        selecting using Enter')

      # test if selected Item is actually selected
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      currentText = $(resultItems[resultItems.length - 1]).text().trim()
      # trim the special character "x" at the end of the select choice text
      equal(currentText.substring(0, currentText.length - 2), selectedText,
        'The current highlighted option should be the last choice pill in
        the list')

      keyEvent(multiSelectComponent, 'keydown', 13)
    .then ->
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      equal(resultItems.length, 2, 'There should be 2 selected items')

      # test deleting using keyboard
      keyEvent(textField, 'keydown', 8)
    .then ->
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      equal(resultItems.length, 1,
        'There should be 1 selected item after deleting one')
      validateFocusAndDropdown('Dropdown list should still be shown after
        deleting using keyboard','Text field should be focused after
        pressing delete')

      # test adding using mouse
      resultItems = find '.ember-select-result-item', multiSelectComponent
      click(resultItems[0])
    .then ->
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      equal(resultItems.length, 2, 'There should be 2 selected items after
        selecting one item using mouse')
      validateFocusAndDropdown('Dropdown list should still be shown after
        selecting using mouse','Text field should be focused after selecting
        using mouse')

      closeButtons = find '.ember-select-search-choice-close', multiSelectComponent
      click(closeButtons[0])
    .then ->
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      equal(resultItems.length, 1,
        'There should be 1 selected item after deleting one item using mouse')
      validateFocusAndDropdown('Dropdown list should still be shown after
        deleting using mouse','Text field should be focused after deleting
        using mouse')

      # test if dropdown appears when we start typing letter ('a' is input here)
      keyEvent(multiSelectComponent, 'keydown', 97)
    .then ->
      ok(isVisible(find '.ember-select-results', multiSelectComponent,
        'Dropdown list should appear after pressing a letter'))

      # test hitting ESC will close the dropdown
      keyEvent(multiSelectComponent, 'keydown', 27)
    .then ->
      ok(isHidden(find '.ember-select-results', multiSelectComponent,
        'Dropdown list should be hidden after pressing ESC'))
