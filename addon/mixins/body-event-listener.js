import Ember from 'ember';

export default Ember.Mixin.create({
  bodyElementSelector: 'html',
  bodyClick: Ember.K,
  didInsertElement: function() {
    this._super();

    // It is important to setup document handlers in the next run loop.
    // Otherwise we run in to situation whenre the click that causes a popover
    // to appears will be handled right away when we attach a click handler.
    // This very same click will trigger the bodyClick to fire and thus
    // causing us to hide the popover right away
    return Ember.run.next(this, this._setupDocumentHandlers);
  },
  willDestroyElement: function() {
    this._removeDocumentHandlers();
    this._super();
  },
  _setupDocumentHandlers: function() {
    var _this = this;
    if (this._clickHandler || this.isDestroying) {
      return;
    }

    this._clickHandler = function(event) {
      return Ember.run(function() {
        if ((_this.get('_state') || _this.get('state')) === 'inDOM' && Ember.isEmpty(_this.$().has($(event.target)))) {
          // check if event.target still exists in DOM
          var checkContain = $.contains(document.body, event.target);
          var isBodyElement = event.target === document.body;
          if (checkContain || isBodyElement) {
            // bodyClick starts taking parameter "event" to make room to control
            // some special cases where there is a component added to the body
            // instead of the app (such as bootstrap date-picker).
            // If it is the case, we can check for the event target to prevent
            // the popover from being closed.
            return _this.bodyClick(event);
          }
        }
      });
    };

    $(this.get('bodyElementSelector')).on("mousedown", this._clickHandler);
  },
  _removeDocumentHandlers: function() {
    if (this._clickHandler) {
      $(this.get('bodyElementSelector')).off("mousedown", this._clickHandler);
    }
    return this._clickHandler = null;
  }
});
