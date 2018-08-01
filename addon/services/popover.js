import Ember from "ember";

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this.popovers = Ember.A([]);
  },

  open(destinationElement, ComponentClass, options) {
    if (!this._popoverDidRender) {
      throw new Error(
        "{{render-popover}} must be included in a template for popovers to open. " +
          "Unit-integration tests don't include application.hbs; you must add {{render-popover}} to this.render()."
      );
    }

    let popoverSpec = {
      destinationElement,
      ComponentClass,
      options
    };

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };

    popoverSpec.options.closePopover = closePopover;

    this.popovers.pushObject(popoverSpec);

    return closePopover;
  },

  registerPopoverRendered() {
    this._popoverDidRender = true;
  }
});
