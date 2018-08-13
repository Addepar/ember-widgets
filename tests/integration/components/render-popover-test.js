import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PopoverComponent from 'ember-widgets/components/popover-component';

moduleForComponent(
  'render-popover',
  'Integration | Component | render popover',
  {
    integration: true
  }
);

test('it renders popovers', function(assert) {
  let TestPopoverComponent = PopoverComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/popover'
  });

  this.render(hbs`{{render-popover}}`);

  assert.ok(
    document.querySelector('div.main-content-container') === null,
    'The popup is not rendered yet'
  );

  Ember.run(() => {
    TestPopoverComponent.popup({
      container: this.container
    });
  });

  assert.ok(
    // Grab some random content from the template to make sure the popup was rendered
    document.querySelector('div.main-content-container'),
    'The popup is now rendered'
  );
});
