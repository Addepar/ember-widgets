import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this.popovers = Ember.A([]);
  },
  open(destinationElement, ComponentClass, options) {
    let popoverSpec = {
      destinationElement,
      ComponentClass,
      options
    };

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    }

    popoverSpec.options.closePopover = closePopover;

    this.popovers.pushObject(popoverSpec);

    return closePopover;
  }
});
