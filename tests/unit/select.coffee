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
