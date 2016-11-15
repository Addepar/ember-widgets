import Ember from 'ember';
import TabbableModalMixin from 'ember-widgets/mixins/tabbable-modal';
import { module, test } from 'qunit';

module('Unit | Mixin | tabbable modal');

// Replace this with your real tests.
test('it works', function(assert) {
  var TabbableModalObject = Ember.Object.extend(TabbableModalMixin);
  var subject = TabbableModalObject.create();
  assert.ok(subject);
});
