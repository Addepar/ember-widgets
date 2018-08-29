import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PopoverComponent from 'ember-widgets/components/popover-component';
import ModalComponent from 'ember-widgets/components/modal-component';

function waitUntil(cb) {
  return new Promise(resolve => {
    function checkCb() {
      let result = cb();
      if (result) {
        resolve(result);
      } else {
        window.setTimeout(checkCb, 5);
      }
    }
    checkCb();
  });
}

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
    'The popover is not rendered yet'
  );

  let close = Ember.run(() => TestPopoverComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The popover is now rendered'
  );
});

test('it programatically closes popovers', function(assert) {
  let TestPopoverComponent = PopoverComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  let close = Ember.run(() => TestPopoverComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The popover is now rendered'
  );

  Ember.run(() => {
    close();
  });

  assert.ok(
    document.querySelector('[data-test-popover-content]') === null,
    'The popover is closed'
  );
});

test('it closes popovers from an event', function(assert) {
  let TestPopoverComponent = PopoverComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => TestPopoverComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The popover is now rendered'
  );

  return new Promise(resolve => {
    // The document event handlers are installed in a run.next, so
    // schedule this test/assertion for after that. Additionally,
    // wait for an animation.
    window.setTimeout(() => {
      $(document).trigger('popover:hide');
      resolve();
    }, 50);
  }).then(() => {
    // Wait for an animation
    return waitUntil(() => document.querySelector('[data-test-popover-content]') === null);
  }).then(() => {
    assert.ok(
      true,
      'The popover is closed'
    );
  });
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
    'Click event handled'
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

  let close = Ember.run(() => TestModalComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The modal is now rendered'
  );
});

test('it programatically closes modals', function(assert) {
  let TestModalComponent = ModalComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  let close = Ember.run(() => TestModalComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The modal is now rendered'
  );

  Ember.run(() => {
    close();
  });

  assert.ok(
    document.querySelector('[data-test-popover-content]') === null,
    'The modal is closed'
  );
});

test('it closes modals from an event', function(assert) {
  let TestModalComponent = ModalComponent.extend({
    // From the dummy app
    layoutName: 'ember-widgets/-test-popover-content'
  });

  this.render(hbs`{{render-popover}}`);

  Ember.run(() => TestModalComponent.popup({
    container: this.container
  }));

  assert.ok(
    document.querySelector('[data-test-popover-content]'),
    'The modal is now rendered'
  );

  return new Promise(resolve => {
    // The document event handlers are installed in a run.next, so
    // schedule this test/assertion for after that. Additionally,
    // wait for the background fade animation.
    window.setTimeout(() => {
      $(document).trigger('modal:hide');
      resolve();
    }, 50);
  }).then(() => {
    // Wait for an animation
    return waitUntil(() => document.querySelector('[data-test-popover-content]') === null);
  }).then(() => {
    assert.ok(
      true,
      'The modal is closed'
    );
  });
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
    'Click event handled'
  );
});
