import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var debouncedComponent, app;

moduleForComponent('debounced-text-component', '[Integration] Debounced Text Component', {
  setup: function() {
    app = startApp();
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = true;
  },
  teardown: function() {
    Ember.run(function() {
      debouncedComponent.destroy();
    });
    Ember.run(app, 'destroy');
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = false;
  }
});

test('Test debounced text', function() {
  var spy;

  expect(1);

  debouncedComponent = this.subject();
  spy = sinon.spy(debouncedComponent, "sendAction");

  debouncedComponent.onValueChanged('fo');
  debouncedComponent.onValueChanged('foo');
  wait();

  andThen(function() {
    ok(spy.calledWithExactly('valueChanged', 'foo'),
      'valueChanged action is fired when value changed');
  });
});
