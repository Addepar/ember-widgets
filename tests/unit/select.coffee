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

test 'Test using just function calls (preferred)', ->
  expect 2

  select.set 'query', 'ba'
  equal(select.get('filteredContent')[0], 'bar')
  equal(select.get('filteredContent')[1], 'baz')

test 'Testing using user interaction', ->
  expect 2


  dropdownToggle = find '.dropdown-toggle', select
  searchBox = find '.ember-select-search input', select

  Ember.run ->
    # Could make this select stuff into a helper. See
    # tests/helpers/test_helpers.coffee.
    append(select).then ->
      click('.dropdown-toggle')
    .then ->
      click searchBox
    .then ->
      fillIn searchBox
    .then ->
      equal(select.get('filteredContent')[0], 'bar')
      equal(select.get('filteredContent')[1], 'baz')

