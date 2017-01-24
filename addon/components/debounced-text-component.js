import Ember from 'ember';

/**
  A custom component that allows delay sending text to parent component by some amount of time.
  This is useful in case there is some request sent to server when value in this component changes.
  As we dont want to send too many request to server, we should only send request after user stops
  typing.

  @class
  @augments {Ember.TextField}
*/
export default Ember.TextField.extend({
  /**
    Ember debounced object that delays execution of the inner function.
    @type {Object}
  */
  textDebounce: null,

  /**
    Delay period between when an input change is triggered and when the change propagated to parent
    component. Parent controller can override this value.
    @type {number}
  */
  delayTime: 250,

  /**
    @override
  */
  didInsertElement: function() {
    this._super.apply(this, arguments);

    this.$().focus();
  },

  /**
    @override
  */
  willDestroy: function() {
    if (!Ember.isNone(this.textDebounce)) {
      Ember.run.cancel(this.textDebounce);
    }

    this._super.apply(this, arguments);
  },

  /**
    Propagates new text to parent component.
  */
  propagateNewText: function(newText) {
    this.sendAction('valueChanged', newText);
  },

  onValueChanged: function(newText) {
    if (!Ember.isNone(this.textDebounce)) {
      Ember.run.cancel(this.textDebounce);
    }

    this.textDebounce = Ember.run.debounce(this, this.propagateNewText, newText,
      this.get('delayTime'));
  },

  /**
    This is called when a browser event which changes the element's value, such as keyUp or paste,
    is triggered. It sets the component's value to the underlying input element's value. Override
    the parent class behavior to send the valueChanged action if the value has changed.

    @override
  */
  _elementValueDidChange: function() {
    var previousValue = this.get('value');
    this._super.apply(this, arguments);
    var newValue = this.get('value');
    if (previousValue !== newValue) {
      this.onValueChanged(newValue);
    }
  }
});
