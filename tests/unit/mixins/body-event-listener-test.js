import Ember from 'ember';
import BodyEventListenerMixin from 'ember-widgets/mixins/body-event-listener';
import { module, test } from 'qunit';

module('Unit | Mixin | body event listener');

// Replace this with your real tests.
test('it works', function(assert) {
  var BodyEventListenerObject = Ember.Object.extend(BodyEventListenerMixin);
  var subject = BodyEventListenerObject.create();
  assert.ok(subject);
});
