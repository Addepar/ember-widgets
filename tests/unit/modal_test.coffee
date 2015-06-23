modal = null

moduleForComponent 'modal', '[Unit] Modal component',
  needs: [
    'template:modal'
    'template:modal_header'
    'template:modal-footer'
  ],
  
  teardown: ->
    Ember.Widgets.DISABLE_ANIMATIONS = no
    modal?.destroy()
    modal = null

test 'With DISABLE_ANIMATIONS=true, hide can be called several times', ->
  expect 1

  Ember.Widgets.DISABLE_ANIMATIONS = yes
  modal = @subject()

  @append()
  andThen ->
    modal.hide()
    modal.hide()
    ok yes, 'hide can be called multiple times when animations are disabled'
