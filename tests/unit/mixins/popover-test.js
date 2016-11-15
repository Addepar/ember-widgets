import Ember from 'ember';
import PopoverMixin from 'ember-widgets/mixins/popover';
import { module, test } from 'qunit';

module('Unit | Mixin | popover');

// Replace this with your real tests.
test('it works', function(assert) {
  var PopoverObject = Ember.Object.extend(PopoverMixin);
  var subject = PopoverObject.create();
  assert.ok(subject);
});
