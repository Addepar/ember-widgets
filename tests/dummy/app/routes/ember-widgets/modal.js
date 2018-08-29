import Ember from 'ember';
import CustomModalContentView from 'dummy/views/custom-modal-content';
import ModalComponent from 'ember-widgets/components/modal-component';

export default Ember.Route.extend({
  actions: {
    showModal() {
      ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        content: "Isn't this one fine day?"
      });
    },
    showSmallModal() {
      ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        size: 'small',
        content: "This is quite small isn't it? You can also use 'large'."
      });
    },
    showModalWithCustomContent() {
      ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        content: {
          name: "Louis"
        },
        contentViewClass: CustomModalContentView
      });
    },
    modalConfirm() {
      console.log("Modal Confirm!");
    },
    modalCancel() {
      console.log("Modal Cancel!");
    }
  }
});
