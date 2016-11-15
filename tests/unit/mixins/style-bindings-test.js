import Ember from 'ember';
import StyleBindingsMixin from 'ember-widgets/mixins/style-bindings';
import { module, test } from 'qunit';

module('Unit | Mixin | style bindings');

// Replace this with your real tests.
test('it works', function(assert) {
  var StyleBindingsObject = Ember.Object.extend(StyleBindingsMixin);
  var subject = StyleBindingsObject.create();
  assert.ok(subject);
});
