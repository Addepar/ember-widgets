modal = null

moduleForComponent 'modal', "[Unit] Modal component",
  needs: [
    'template:modal'
    'template:modal_header'
    'template:modal-footer'
  ],

  teardown: ->
    Ember.Widgets.DISABLE_ANIMATIONS = no
    Ember.run ->
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

test 'Test tab loop only inside modal', ->
  expect 3

  modal = @subject()
  @append()

  modalComponent = modal.$()
  modal.set('enforceModality', yes)
  buttonConfirm = find '.btn-confirm', modalComponent
  buttonCancel = find '.btn-cancel', modalComponent

  validateFocus = (element, messageFocus) ->
    ok isFocused(element, modalComponent), messageFocus

  validateFocus buttonConfirm, 'Button Confirm should be focused'

  # press Shift+TAB on the first tabbable element, the last one
  # should be focused
  triggerEvent(buttonConfirm, null, 'keydown', {keyCode: 9, which: 9, shiftKey: true})
  andThen ->
    validateFocus buttonCancel, 'Button Cancel should be focused'

  # press TAB on the last tabbable element, the first one should be focused
  keyEvent(buttonCancel, 'keydown',9)
  andThen ->
    validateFocus buttonConfirm, 'Button Confirm should be focused'

test 'Test preserving the focus when clicking on non-focusable element', ->
  expect 1

  modal = @subject()
  @append()

  modalComponent = modal.$()
  buttonConfirm = find '.btn-confirm', modalComponent
  buttonCancel = find '.btn-cancel', modalComponent
  modalBody = find '.modal-body', modalComponent

  validateFocus = (element, messageFocus) ->
    ok isFocused(element, modalComponent), messageFocus

  keyEvent(buttonConfirm, 'keydown',9)
  .then ->
    buttonCancel.focus()
  # click on a the body of the modal which is a non-focusable element,
  # the focus should stay on the cancel button
  click(modalBody)
  .then ->
    validateFocus buttonCancel, 'The focus should stay on the Cancel button'
