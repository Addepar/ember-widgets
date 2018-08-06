import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('view:popover-container', 'Unit | View | popover container');

test('it exists', function(assert) {
  let SomeComponent = Ember.Component.extend();

  let view = this.subject({ viewClass: SomeComponent });

  assert.ok(view);
});
