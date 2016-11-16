import Ember from 'ember';

import PopoverMixin from '../mixins/popover';

var PopoverComponent = Ember.Component.extend(PopoverMixin);

PopoverComponent.reopenClass({
  rootElement: '.ember-application',
  hideAll: function() {
    return $(document).trigger('popover:hide');
  },
  /**
   * Shows a popup with options used for PopoverComponent.
   * @param {Object} options All options used for PopoverComponent.
   * @param {boolean} [hideOthers=true] Indicates if other popover should be hidden when a new one
   *    is shown. By default, it's set to true.
  */

  popup: function(options, hideOthers) {
    var popover, rootElement;
    if (hideOthers == null) {
      hideOthers = true;
    }
    if (hideOthers) {
      this.hideAll();
    }
    rootElement = options.rootElement || this.rootElement;
    popover = this.create(options);
    if (popover.get('targetObject.container')) {
      popover.set('container', popover.get('targetObject.container'));
    }
    popover.appendTo(rootElement);
    return popover;
  }
});

export default PopoverComponent;
