modal = null
dispatcher = null

module "[Unit] Modal unit tests",
  setup: ->
    Ember.run ->
      dispatcher = Ember.EventDispatcher.create()
      dispatcher.setup()
      modal = Ember.Widgets.ModalComponent.popup()

  teardown: ->
    Ember.run ->
      dispatcher.destroy()
      modal.destroy()

test 'Test tab loop only inside modal', ->
  expect 3
  modalComponent = modal.$()
  modal.set('enforceModality', yes)
  buttonConfirm = find '.btn-confirm', modalComponent
  buttonCancel = find '.btn-cancel', modalComponent

  validateFocus = (element, messageFocus) ->
    ok isFocused(element, modalComponent), messageFocus

  validateFocus buttonConfirm, 'Button Confirm should be focused'

  # press Shift+TAB on the first tabbable element, the last one
  # should be focused
  jQueryKeyEvent(buttonConfirm, 'keydown', 9, true, false, false)
  validateFocus buttonCancel, 'Button Cancel should be focused'

  # press TAB on the last tabbable element, the first one should be focused
  keyEvent(buttonCancel, 'keydown',9)
  validateFocus buttonConfirm, 'Button Confirm should be focused'

test 'Test preserving the focus when clicking on non-focusable element', ->
  expect 2
  modalComponent = modal.$()
  buttonConfirm = find '.btn-confirm', modalComponent
  buttonCancel = find '.btn-cancel', modalComponent
  modalBody = find '.modal-body', modalComponent

  validateFocus = (element, messageFocus) ->
    ok isFocused(element, modalComponent), messageFocus

  validateFocus buttonConfirm, 'Button confirm should be focused'

  # click on a the body of the modal which is a non-focusable element,
  # the focus should stay on the cancel button
  click(modalBody)
  .then ->
    validateFocus buttonConfirm, 'The focus should stay on the Confirm button'
