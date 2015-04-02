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

test 'Test keyboard interaction', ->
  expect 6
  selectedText = null

  Ember.run ->
    append(multiSelect)

  Ember.run ->
    multiSelectComponent = multiSelect.$()
    highlightedComponent = find '.ember-select-multi', multiSelectComponent

    multiSelectComponent.focus()
    wait().then ->
      # test pressing ENTER key to open dropdown
      keyEvent(multiSelectComponent, 'keydown', 13)
    .then ->
      ok isVisible(find '.ember-select-results', multiSelectComponent, 'Dropdown list should appear')

    .then ->
      resultItems = find '.ember-select-result-item', multiSelectComponent
      ok $(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted'
      # test selecting option using ENTER key
      selectedText = $(resultItems[0]).text().trim()
      keyEvent(multiSelectComponent, 'keydown', 13)

    .then ->
      ok isHidden(find '.ember-select-results', multiSelectComponent, 'Dropdown list should be hidden')

      # test if selected Item is actually selected
      resultItems = find '.ember-select-search-choice', multiSelectComponent
      currentText = $(resultItems[resultItems.length - 1]).text().trim()
      # trim the special character "x" at the end of the select choice text
      equal(currentText.substring(0, currentText.length - 2), selectedText)

      # test if dropdown appears when we start typing letter ('a' is input here)
      keyEvent(multiSelectComponent, 'keydown', 97)

    .then ->
      ok isVisible(find '.ember-select-results', multiSelectComponent, 'Dropdown list should appear')

      keyEvent(multiSelectComponent, 'keydown', 27)

    .then ->
      ok isHidden(find '.ember-select-results', multiSelectComponent, 'Dropdown list should be hidden')
