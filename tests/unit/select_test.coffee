moduleForComponent 'select', '[Unit] Select component'

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

