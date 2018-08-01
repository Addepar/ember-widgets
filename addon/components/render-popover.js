import Ember from "ember";

export default Ember.Component.extend({
  popover: Ember.inject.service(),

  init() {
    this._super(...arguments);

    this.get("popover").registerPopoverRendered();
  }
});
