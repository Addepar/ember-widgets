import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PopoverComponent from 'ember-widgets/components/popover-component';
import ModalComponent from 'ember-widgets/components/modal-component';

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
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  assert.ok(
    document.querySelector('[data-test-popover-content]') === null,
    'The popup is not rendered yet'
  );

  Ember.run(() => {
    TestPopoverComponent.popup({
      container: this.container
    });
  });

  assert.ok(
    // Grab some random content from the template to make sure the popup was rendered
    document.querySelector('[data-test-popover-content]'),
    'The popup is now rendered'
  );
});

test('it handles actions in a popover', function(assert) {
  let hasActionFired = false;
  let TestPopoverComponent = PopoverComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content',
    actions: {
      fire() {
        hasActionFired = true;
      }
    }
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => {
    TestPopoverComponent.popup({
      container: this.container
    });
  });

  assert.notOk(
    hasActionFired,
    'precond - action has not fired'
  );

  $(document.querySelector('[data-test-fire-action]')).click();

  assert.ok(
    hasActionFired,
    'Action was fired'
  );
});

test('it handles event delegation in a popover', function(assert) {
  let hasHandledClick = false;
  let TestPopoverComponent = PopoverComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content',
    click() {
      hasHandledClick = true;
    }
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => {
    TestPopoverComponent.popup({
      container: this.container
    });
  });

  assert.notOk(
    hasHandledClick,
    'precond - click event had not been handled'
  );

  $(document.querySelector('[data-test-popover-content]')).click();

  assert.ok(
    hasHandledClick,
    'Clicke event handled'
  );
});

test('it renders modals', function(assert) {
  let TestModalComponent = ModalComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  assert.ok(
    document.querySelector('[data-test-popover-content]') === null,
    'The modal is not rendered yet'
  );

  Ember.run(() => {
    TestModalComponent.popup({
      container: this.container
    });
  });

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The modal is now rendered'
  );
});

test('it handles actions in a modal', function(assert) {
  let hasActionFired = false;
  let TestModalComponent = ModalComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content',
    actions: {
      fire() {
        hasActionFired = true;
      }
    }
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => {
    TestModalComponent.popup({
      container: this.container
    });
  });

  assert.notOk(
    hasActionFired,
    'precond - action has not fired'
  );

  $(document.querySelector('[data-test-fire-action]')).click();

  assert.ok(
    hasActionFired,
    'Action was fired'
  );
});

test('it handles event delegation in a popover', function(assert) {
  let hasHandledClick = false;
  let TestModalComponent = ModalComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content',
    click() {
      hasHandledClick = true;
    }
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => {
    TestModalComponent.popup({
      container: this.container
    });
  });

  assert.notOk(
    hasHandledClick,
    'precond - click event had not been handled'
  );

  $(document.querySelector('[data-test-popover-content]')).click();

  assert.ok(
    hasHandledClick,
    'Clicke event handled'
  );
});
