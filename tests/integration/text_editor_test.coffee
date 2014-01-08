test 'Text editor shows up', ->
  App.reset()
  visit('/ember-widgets/textEditor').then ->
    ok(!!find('.text-editor-frame').length, 'Text editor frame not found')
