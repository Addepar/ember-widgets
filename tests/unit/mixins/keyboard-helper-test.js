import Ember from 'ember';
import KeyboardHelperMixin from 'ember-widgets/mixins/keyboard-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | keyboard helper');

// Replace this with your real tests.
test('it works', function(assert) {
  var KeyboardHelperObject = Ember.Object.extend(KeyboardHelperMixin);
  var subject = KeyboardHelperObject.create();
  assert.ok(subject);
});
