import Ember from 'ember';

import PopoverMixin from '../mixins/popover';

var PopoverComponent = Ember.Component.extend(PopoverMixin);

PopoverComponent.reopenClass({
  rootElement: '.ember-application',
  hideAll() {
    return $(document).trigger('popover:hide');
  },
  /**
   * Shows a popup with options used for PopoverComponent.
   * @param {Object} options All options used for PopoverComponent.
   * @param {boolean} [hideOthers=true] Indicates if other popover should be hidden when a new one
   *    is shown. By default, it's set to true.
   */

  popup(options, hideOthers) {
    if (hideOthers == null) {
      hideOthers = true;
    }
    if (hideOthers) {
      this.hideAll();
    }

    let rootElement = options.rootElement || this.rootElement;
    let { container } = options;

    if (!container) {
      throw new Error(`<Subclass of PopoverComponent>.popup() expects an option of {container}`);
    }

    let destinationElement = document.querySelector(rootElement);

    if (!destinationElement) {
      throw new Error(
        '<Subclass of PopoverComponent>.popup() expected the selector provided as {rootElement} to return a node currently on the page'
      );
    }

    let popoverService = container.lookup('service:popover');

    return popoverService.open(destinationElement, this, options);
  }
});

export default PopoverComponent;
