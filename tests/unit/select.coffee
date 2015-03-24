select = null
dispatcher = null

module "[Unit] Select unit tests",
  setup: ->
    Ember.run ->
      dispatcher = Ember.EventDispatcher.create()
      dispatcher.setup()
      select = Ember.Widgets.SelectComponent.create
        content: ['foo', 'bar', 'baz']

  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      select.destroy()

test 'Testing using user interaction', ->
  expect 2

  Ember.run ->
    append(select)

  Ember.run ->
    searchBox = find '.ember-select-search input', select.$()
    click('.dropdown-toggle', select.$()).then ->
      click searchBox
    .then ->
      fillIn searchBox, 'ba'
    .then ->
      equal(select.get('filteredContent')[0], 'bar')
      equal(select.get('filteredContent')[1], 'baz')

