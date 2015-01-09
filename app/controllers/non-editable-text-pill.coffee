`import Ember from 'ember'`
`import BaseNonEditablePill from '../controllers/base-non-editable-pill'`
`import ModalComponent from '../components/modal-component'`

NonEditableTextPill = BaseNonEditablePill.extend
  name: "Custom Text"
  text: Ember.computed.alias 'params.text'

  result: ->
    @get('params.text')

  configurable: true
  configure: ->
    modal = ModalComponent.popup
      content: this
      targetObject: this
      confirm: "modalConfirm"
      cancel: "modalCancel"
      contentViewClass: Ember.View.extend
        templateName: 'non-editable-text-pill-configuration'
      headerText: @get('name')
      confirmText: "Insert"

`export default NonEditableTextPill`
