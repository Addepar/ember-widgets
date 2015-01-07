`import Ember from 'ember'`
`import ModalComponent from '../../components/modal-component'`
`import CustomModalContentView from '../../views/custom-modal-content'`

EmberWidgetsModalRoute = Ember.Route.extend
  actions:
    showModal: ->
      ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        content: "Isn't this one fine day?"

    showSmallModal: ->
      ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        size: 'small'
        content: "This is quite small isn't it? You can also use 'large'."

    showModalWithCustomContent: ->
      ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        content: { name: "Louis" }
        contentViewClass: CustomModalContentView

    modalConfirm: -> console.log("Modal Confirm!")

    modalCancel: -> console.log("Modal Cancel!")

`export default EmberWidgetsModalRoute`
