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
