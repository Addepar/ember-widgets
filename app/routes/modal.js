import Ember from 'ember';
import CustomModalContentView from '../views/custom-modal-content';

export default Ember.Route.extend({
  actions: {
    showModal: function() {
      Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        content: "Isn't this one fine day?"
      });
    },
    showSmallModal: function() {
      Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        size: 'small',
        content: "This is quite small isn't it? You can also use 'large'."
      });
    },
    showModalWithCustomContent: function() {
      Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "modalConfirm",
        cancel: "modalCancel",
        content: {
          name: "Louis"
        },
        contentViewClass: CustomModalContentView
      });
    },
    modalConfirm: function() {
      return console.log("Modal Confirm!");
    },
    modalCancel: function() {
      return console.log("Modal Cancel!");
    }
  }
});
