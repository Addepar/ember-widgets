import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this.popovers = Ember.A([]);
  },

  open(destinationElement, ComponentClass, options) {
    if (!this._popoverDidRender) {
      throw new Error(
        '{{render-popover}} must be included in a template for popovers to open. ' +
          "Unit-integration tests don't include application.hbs; you must add {{render-popover}} to this.render()."
      );
    }

    let popoverSpec = {
      destinationElement
    };

    options.closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };

    popoverSpec.childViews = [
      ComponentClass.create({
        ...options
      })
    ];

    this.popovers.pushObject(popoverSpec);
  },

  registerPopoverRendered() {
    this._popoverDidRender = true;
  }
});
