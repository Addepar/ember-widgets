import Ember from 'ember';

import StyleBindingsMixin from '../mixins/style-bindings';
import TabbableModal from '../mixins/tabbable-modal';

var ModalComponent = Ember.Component.extend(
  StyleBindingsMixin,
  TabbableModal,
{
  layoutName: 'modal',
  classNames: ['modal'],
  classNameBindings: ['isShowing:in', 'hasCloseButton::has-no-close-button', 'fadeEnabled:fade'],
  modalPaneBackdrop: '<div class="modal-backdrop"></div>',
  bodyElementSelector: '.modal-backdrop',
  enforceModality: false,
  escToCancel: true,
  backdrop: true,
  isShowing: false,
  hasCloseButton: true,
  fade: true,
  headerText: "Modal Header",
  confirmText: "Confirm",
  cancelText: "Cancel",
  closeText: null,
  content: "",
  size: "normal",
  isValid: true,
  confirm: Ember.K,
  cancel: Ember.K,
  close: Ember.K,
  isDisabled: Ember.computed.not('isValid'),
  fadeEnabled: Ember.computed(function() {
    if (window.EMBER_WIDGETS_DISABLE_ANIMATIONS) {
      return false;
    }
    return this.get('fade');
  }).property('fade'),
  _runFocusTabbable: null,
  headerViewClass: Ember.View.extend({
    templateName: 'modal-header'
  }),
  contentViewClass: Ember.View.extend({
    templateName: 'modal-content'
  }),
  footerViewClass: Ember.View.extend({
    templateName: 'modal-footer'
  }),
  _headerViewClass: Ember.computed(function() {
    var headerViewClass;
    headerViewClass = this.get('headerViewClass');
    if (typeof headerViewClass === 'string') {
      return Ember.get(headerViewClass);
    } else {
      return headerViewClass;
    }
  }).property('headerViewClass'),
  _contentViewClass: Ember.computed(function() {
    var contentViewClass;
    contentViewClass = this.get('contentViewClass');
    if (typeof contentViewClass === 'string') {
      return Ember.get(contentViewClass);
    } else {
      return contentViewClass;
    }
  }).property('contentViewClass'),
  _footerViewClass: Ember.computed(function() {
    var footerViewClass;
    footerViewClass = this.get('footerViewClass');
    if (typeof footerViewClass === 'string') {
      return Ember.get(footerViewClass);
    } else {
      return footerViewClass;
    }
  }).property('footerViewClass'),
  sizeClass: Ember.computed(function() {
    switch (this.get('size')) {
      case 'large':
        return 'modal-lg';
      case 'small':
        return 'modal-sm';
      default:
        return '';
    }
  }).property('size'),
  actions: {
    // Important: we do not want to send cancel after modal is closed.
    // It turns out that this happens sometimes which leads to undesire
    // behaviors
    sendCancel: function() {
      var cancel;
      if (!this.get('isShowing')) {
        return;
      }
      // NOTE: we support callback for backward compatibility.
      cancel = this.get('cancel');
      if (typeof cancel === 'function') {
        this.cancel(this);
      } else {
        this.sendAction('cancel');
      }
      return this.hide();
    },
    sendConfirm: function() {
      var confirm;
      if (!this.get('isShowing')) {
        return;
      }
      // NOTE: we support callback for backward compatibility.
      confirm = this.get('confirm');
      if (typeof confirm === 'function') {
        this.confirm(this);
      } else {
        this.sendAction('confirm');
      }
      return this.hide();
    },
    sendClose: function() {
      var close;
      if (!this.get('isShowing')) {
        return;
      }
      // NOTE: we support callback for backward compatibility.
      close = this.get('close');
      if (typeof close === 'function') {
        this.close(this);
      } else {
        this.sendAction('close');
      }
      return this.hide();
    }
  },
  didInsertElement: function() {
    this._super();
    // Make sure that after the modal is rendered, set focus to the first
    // tabbable element
    this._runFocusTabbable = Ember.run.schedule('afterRender', this, function() {
      return this._focusTabbable();
    });
    // See force reflow at http://stackoverflow.com/questions/9016307/
    // force-reflow-in-css-transitions-in-bootstrap
    if (this.get('fade')) {
      this.$()[0].offsetWidth; // jshint ignore:line
    }
    // append backdrop
    if (this.get('backdrop')) {
      this._appendBackdrop();
    }
    // show modal in next run loop so that it will fade in instead of appearing
    // abruptly on the screen
    Ember.run.next(this, function() {
      if (this.isDestroying) {
        return;
      }
      return this.set('isShowing', true);
    });
    // bootstrap modal adds this class to the body when the modal opens to
    // transfer scroll behavior to the modal
    $(document.body).addClass('modal-open');
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    if (this._runFocusTabbable) {
      Ember.run.cancel(this._runFocusTabbable);
    }
    this._super();
    this._removeDocumentHandlers();
    if (this._backdrop) {
      return this._backdrop.remove();
    }
  },
  click: function(event) {
    this._super(event);
    // our modal component is a container. When we click on
    // the modal (currentTarget), inside the dialog,
    // some child element (target) will receive the event.
    // Instead, if we click outside the dialog, the event will stay
    // on the modal (currentTarget) because there is no child element there.
    if (event.target === event.currentTarget) {
      if (!this.get('enforceModality')) {
        return this.send('sendCancel');
      }
    }
  },
  hide: function() {
    if (this.isDestroying) {
      return;
    }
    this.set('isShowing', false);
    // bootstrap modal removes this class from the body when the modal closes
    // to transfer scroll behavior back to the app
    $(document.body).removeClass('modal-open');
    if (this._backdrop) {
      this._backdrop.removeClass('in');
    }
    if (this.get('fadeEnabled')) {
      // destroy modal after backdroop faded out. We need to wrap this in a
      // run-loop otherwise ember-testing will complain about auto run being
      // disabled when we are in testing mode.
      return this.$().one($.support.transition.end, (function(_this) {
        return function() {
          return Ember.run(_this, _this.destroy);
        };
      })(this));
    } else {
      return Ember.run(this, this.destroy);
    }
  },
  _appendBackdrop: function() {
    var modalPaneBackdrop, parentLayer;
    parentLayer = this.$().parent();
    modalPaneBackdrop = this.get('modalPaneBackdrop');
    this._backdrop = $(modalPaneBackdrop);
    if (this.get('fadeEnabled')) {
      this._backdrop.addClass('fade');
    }
    this._backdrop.appendTo(parentLayer);
    // show backdrop in next run loop so that it can fade in
    return Ember.run.next(this, function() {
      return this._backdrop.addClass('in');
    });
  },
  _setupDocumentHandlers: function() {
    this._super();
    if (!this._hideHandler) {
      this._hideHandler = (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this);
      return $(document).on('modal:hide', this._hideHandler);
    }
  },
  _removeDocumentHandlers: function() {
    this._super();
    $(document).off('modal:hide', this._hideHandler);
    this._hideHandler = null;
    $(document).off('keyup', this.get('keyHandler'));
    return this.$().off($.support.transition.end);
  }
});

ModalComponent.reopenClass({
  rootElement: '.ember-application',
  poppedModal: null,
  hideAll: function() {
    return $(document).trigger('modal:hide');
  },
  popup: function(options) {
    var modal, rootElement;
    if (options == null) {
      options = {};
    }
    this.hideAll();
    rootElement = options.rootElement || this.rootElement;
    modal = this.create(options);
    if (modal.get('targetObject.container')) {
      modal.set('container', modal.get('targetObject.container'));
    }
    modal.appendTo(rootElement);
    return modal;
  }
});

export default ModalComponent;
