import Ember from 'ember';
import KeyboardHelper from './keyboard-helper';

export default Ember.Mixin.create(KeyboardHelper, {
  // these are variables from the modal component (modal.coffee) to enforce
  // the modality when clicking outside of the modal and to allow pressing ESC
  // to cancel the modal. Please check if this mixin is going to be used
  // outside of modal.coffee
  enforceModality: false,
  escToCancel: true,
  currentFocus: null,
  _focusTabbable: function() {
    // Set focus to the first match:
    // 1. The saved focused element
    // 2. First element inside the dialog matching [autofocus]
    // 3. Tabbable element inside the content element
    // 4. The close button (has class "close")
    var focusElement, hasFocus;
    hasFocus = [this.get('currentFocus')];
    if (!this.$().has(hasFocus[0]).length) {
      hasFocus = this.$('[autofocus]');
    }
    // if we have more than two tabbable objects, we do not want to tab
    // to close button
    // while if we do not have any choice, the close button is chosen
    if (hasFocus.length === 0) {
      hasFocus = this.$(':tabbable');
    }
    if (focusElement = hasFocus[0]) {
      if (focusElement.className.indexOf('close') > -1) {
        if (hasFocus.length > 1) {
          focusElement = hasFocus[1];
        }
      }
      focusElement.focus();
      return this.set('currentFocus', focusElement);
    }
  },
  _checkContainingElement: function(containers, element) {
    var containerItem, i, len;
    for (i = 0, len = containers.length; i < len; i++) {
      containerItem = containers[i];
      if (containerItem === element || $.contains(containerItem, element)) {
        return true;
      }
    }
    return false;
  },
  mouseDown: function(event) {
    this._super(event);
    if (this._checkContainingElement(this.$(':tabbable'), event.target)) {
      return this.set('currentFocus', event.target);
    } else {
      // if we click on a non-tabbable element, we should just set the focus back
      // to the modal and reset the tab loop
      this.set('currentFocus', null);
      return this.$().focus();
    }
  },
  // capture the TAB key and make a cycle tab loop among the tabbable elements
  // inside the modal. Remove the close button from the loop
  keyDown: function(event) {
    var _currentFocus, _index, first, last, tabbableObjects;
    this._super(event);
    if (event.isDefaultPrevented()) {
      return;
    }
    if (event.keyCode === this.KEY_CODES.ESCAPE && this.get('escToCancel')) {
      this.send('sendCancel');
      event.preventDefault();
    } else if (event.keyCode === this.KEY_CODES.ENTER && this.get('enterToConfirm')) {
      if (!this.get('isDisabled')) {
        this.send('sendConfirm');
        event.preventDefault();
      }
    } else if (event.keyCode === this.KEY_CODES.TAB) {
      // tabbable objects list without close button
      tabbableObjects = this.$(":tabbable").not('.close');
      _currentFocus = document.activeElement;
      _index = tabbableObjects.index(_currentFocus);
      // if the current target does not belong to tabbable objects
      // we need to guide the focus back to a tabbable element
      if (_index === -1) {
        this._focusTabbable();
        return false;
      }
      // process the tab loop by checking two ends to construct the loop
      if (tabbableObjects.length > 0) {
        first = tabbableObjects[0];
        last = tabbableObjects[tabbableObjects.length - 1];
        // check the two ends
        if (event.target === last && !event.shiftKey) {
          first.focus();
          this.set('currentFocus', first);
          event.preventDefault();
        } else if (event.target === first && event.shiftKey) {
          this.set('currentFocus', last);
          last.focus();
          event.preventDefault();
        } else {
          this.set('currentFocus', tabbableObjects[_index + 1]);
        }
      }
    }
    return true;
  }
});
