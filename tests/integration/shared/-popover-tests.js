import PopoverComponent from 'ember-widgets/components/popover-component';
import ModalComponent from 'ember-widgets/components/modal-component';
import PopoverModalBase from 'ember-widgets/components/popover-modal-base';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

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

export default function runPopoverTests(test, {makeComponent, openPopover, openModal, openPopoverModal, skipDeprecatedAPIFailingTests}) {
  test('it renders popovers', function(assert) {
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'ember-widgets/-test-popover-content'
    });

    this.render(hbs`{{render-popover}}`);

    assert.ok(
      document.querySelector('[data-test-popover-content]') === null,
      'The popover is not rendered yet'
    );

    openPopover(this, componentSpec);

    assert.ok(
      document.querySelector('[data-test-popover-content]'),
      'The popover is now rendered'
    );
  });

  test('properties can be passed to the popover', function(assert) {
    this.container.register('template:test-popover-1', hbs`
      <div data-test-popover-1><span data-test-popover-1-foo>{{foo}}</span></div>
    `);
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'test-popover-1'
    });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, componentSpec, { foo: 'BAR' });

    assert.ok(!!document.querySelector('[data-test-popover-1]'), 'renders popover');
    assert.ok(document.querySelector('[data-test-popover-1-foo]').innerHTML.includes('BAR'), 'renders foo property');
  });

  test('it programatically closes popovers', function(assert) {
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'ember-widgets/-test-popover-content'
    });

    this.render(hbs`{{render-popover}}`);

    let close =  openPopover(this, componentSpec);

    assert.ok(
      document.querySelector('[data-test-popover-content]'),
      'The popover is now rendered'
    );

    Ember.run(() => { close(); });

    assert.ok(
      document.querySelector('[data-test-popover-content]') === null,
      'The popover is closed'
    );
  });

  test('it closes popovers from an event', function(assert) {
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'ember-widgets/-test-popover-content'
    });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, componentSpec);

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

  test('it closes other popovers when hideAll is true', function(assert) {
    this.container.register('template:test-popover-1', hbs`<div data-test-popover-1>popover 1</div>`);
    this.container.register('template:test-popover-2', hbs`<div data-test-popover-2>popover 2</div>`);

    let component1 = makeComponent(this, 'test-popover-1', PopoverComponent, { layoutName: 'test-popover-1' });
    let component2 = makeComponent(this, 'test-popover-2', PopoverComponent, { layoutName: 'test-popover-2' });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, component1);

    return new Promise(resolve => {
      // Wait for document event listeners to be installed
      window.setTimeout(() => { resolve(); }, 50);
    }).then(() => {
      assert.ok(!!document.querySelector('[data-test-popover-1]'), 'renders popover 1');
      assert.ok(!document.querySelector('[data-test-popover-2]'), 'no render of popover 2');

      openPopover(this, component2, {}, true);
    }).then(() => {
      // Wait for an animation
      return waitUntil(() => document.querySelector('[data-test-popover-1]') === null);
    }).then(() => {
      assert.ok(!document.querySelector('[data-test-popover-1]'), 'no render of popover 1');
      assert.ok(!!document.querySelector('[data-test-popover-2]'), 'renders popover 2');
    });
  });

  test('it does not close other popovers when hideAll is false', function(assert) {
    this.container.register('template:test-popover-1', hbs`<div data-test-popover-1>popover 1</div>`);
    this.container.register('template:test-popover-2', hbs`<div data-test-popover-2>popover 2</div>`);

    let component1 = makeComponent(this, 'test-popover-1', PopoverComponent, { layoutName: 'test-popover-1' });
    let component2 = makeComponent(this, 'test-popover-2', PopoverComponent, { layoutName: 'test-popover-2' });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, component1);

    return new Promise(resolve => {
      // Wait for document event listeners to be installed
      window.setTimeout(() => { resolve(); }, 50);
    }).then(() => {
      assert.ok(!!document.querySelector('[data-test-popover-1]'), 'renders popover 1');
      assert.ok(!document.querySelector('[data-test-popover-2]'), 'no render of popover 2');

      openPopover(this, component2, {}, false);
    }).then(() => {
      // Give animation a chance to settle, if present
      return new Promise(resolve => window.setTimeout(resolve, 50));
    }).then(() => {
      assert.ok(!!document.querySelector('[data-test-popover-1]'), 'still renders popover 1');
      assert.ok(!!document.querySelector('[data-test-popover-2]'), 'renders popover 2');
    });
  });


  test('it handles actions in a popover', function(assert) {
    let hasActionFired = false;
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
      actions: {
        fire() {
          hasActionFired = true;
        }
      }
    });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, componentSpec);

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
    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
      click() {
        hasHandledClick = true;
      }
    });

    this.render(hbs`{{render-popover}}`);

    openPopover(this, componentSpec);

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
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
    });

    this.render(hbs`{{render-popover}}`);

    assert.ok(
      document.querySelector('[data-test-popover-content]') === null,
      'The modal is not rendered yet'
    );

    openModal(this, componentSpec);

    assert.ok(
      document.querySelector('[data-test-popover-content]'),
      'The modal is now rendered'
    );
  });

  test('it programatically closes modals', function(assert) {
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
    });

    this.render(hbs`{{render-popover}}`);

    let close = openModal(this, componentSpec);

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
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
    });

    this.render(hbs`{{render-popover}}`);

    openModal(this, componentSpec);

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

  test('it closes other modals when opening', function(assert) {
    this.container.register('template:test-modal-1', hbs`<h1 data-test-modal-1>modal 1</h1>`);
    this.container.register('template:test-modal-2', hbs`<h1 data-test-modal-2>modal 2</h1>`);
    let component1 = makeComponent(this, 'test-modal-1', ModalComponent, { layoutName: 'test-modal-1' });
    let component2 = makeComponent(this, 'test-modal-2', ModalComponent, { layoutName: 'test-modal-2' });

    this.render(hbs`{{render-popover}}`);

    openModal(this, component1);

    return new Promise(resolve => {
      // Wait for document event listeners to be installed
      window.setTimeout(() => { resolve(); }, 50);
    }).then(() => {
      assert.ok(!!document.querySelector('[data-test-modal-1]'), 'renders modal 1');
      assert.ok(!document.querySelector('[data-test-modal-2]'), 'no render of modal 2');

      openModal(this, component2);
    }).then(() => {
      // Wait for an animation
      return waitUntil(() => document.querySelector('[data-test-modal-1]') === null);
    }).then(() => {
      assert.ok(!document.querySelector('[data-test-modal-1]'), 'no render of modal 1');
      assert.ok(!!document.querySelector('[data-test-modal-2]'), 'renders modal 2');
    });
  });

  test('it handles actions in a modal', function(assert) {
    let hasActionFired = false;
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
      actions: {
        fire() {
          hasActionFired = true;
        }
      }
    });

    this.render(hbs`{{render-popover}}`);

    openModal(this, componentSpec);

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

  test('it handles actions in a modal\'s header/content/footer views', function(assert) {
    let actionsFired = {};

    let modalViewClasses = ['header','content','footer'];

    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      headerViewClass: Ember.View.extend({ templateName: 'test-modal-header' }),
      contentViewClass: Ember.View.extend({ templateName: 'test-modal-content' }),
      footerViewClass: Ember.View.extend({ templateName: 'test-modal-footer' }),
      actions: {
        modalHeaderAction() {
          actionsFired.header = true;
        },
        modalFooterAction() {
          actionsFired.footer = true;
        },
        modalContentAction() {
          actionsFired.content = true;
        }
      }
    });

    this.render(hbs`{{render-popover}}`);

    openModal(this, componentSpec);

    modalViewClasses.forEach(name => {
      assert.ok($(`[data-test-modal-${name}-button]`).length > 0,
                  `renders modal ${name} view`);
    });

    assert.ok(
      !actionsFired.header && !actionsFired.content && !actionsFired.footer,
      'precond - no action has fired'
    );

    modalViewClasses.forEach(name => {
      $(document.querySelector(`[data-test-modal-${name}-button]`)).click();
      assert.ok(actionsFired[name], `${name} action fired`);
    });
  });

  test('it handles event delegation in a modal', function(assert) {
    let hasHandledClick = false;

    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      layoutName: 'ember-widgets/-test-popover-content',
      click() {
        hasHandledClick = true;
      }
    });

    this.render(hbs`{{render-popover}}`);

    openModal(this, componentSpec);

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

  test('properties can be passed to the modal', function(assert) {
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
      footerText: 'foo',
      footerViewClass: Ember.View.extend({
        templateName: 'test-modal-footer'
      })
    })

    this.render(hbs`{{render-popover}}`);
    openModal(this, componentSpec);

    assert.ok(document.querySelector('[data-test-footer-text]'), 'footer text is rendered');
  });

  test('property bindings can be passed to the modal', function(assert) {
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent);

    this.render(hbs`{{render-popover}}`);
    openModal(this, componentSpec, {
      fooBindingTest: true,
      fooBinding: 'bar',
      bar: 'baz',
      footerViewClass: Ember.View.extend({
        templateName: 'test-modal-footer'
      })
    });

    return wait().then(() => {
      assert.equal(document.querySelector('[data-test-footer-foo-value]').innerHTML, 'baz');
      assert.equal(document.querySelector('[data-test-footer-bar-value]').innerHTML, 'baz');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz');

      Ember.run(() => fillIn('[data-test-footer-foo-input] input', 'baz-via-foo'));
      return wait();
    }).then(() => {
      assert.equal(document.querySelector('[data-test-footer-foo-value]').innerHTML, 'baz-via-foo');
      assert.equal(document.querySelector('[data-test-footer-bar-value]').innerHTML, 'baz-via-foo');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz-via-foo');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz-via-foo');

      Ember.run(() => fillIn('[data-test-footer-bar-input] input', 'baz-via-bar'));
      return wait();
    }).then(() => {
      assert.equal(document.querySelector('[data-test-footer-foo-value]').innerHTML, 'baz-via-bar');
      assert.equal(document.querySelector('[data-test-footer-bar-value]').innerHTML, 'baz-via-bar');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz-via-bar');
      assert.equal(document.querySelector('[data-test-footer-bar-input] input').value, 'baz-via-bar');
    });
  });

  test('classNames can be passed to the modal', function(assert) {
    let componentSpec = makeComponent(this, 'test-modal', ModalComponent, { classNames: ['foo'] });
    this.render(hbs`{{render-popover}}`);
    openModal(this, componentSpec);

    assert.ok(!!document.querySelector('.modal.foo'), 'renders "modal" class and "foo" class');
  });

  // The following tests fail when run through the old `ComponentClass.popup` method with Ember 1.13.
  // They should be skipped when run that way. They will only pass via the new API: `this.popoverService.openModal(...)`
  if (!skipDeprecatedAPIFailingTests) {
    // This exposes an issue in the old API where the view will re-render with the wrong action target.
    test('it handles actions when footer disabled button state changes', function(assert) {
      let actionsFired = {};

      let componentSpec = makeComponent(this, 'test-modal', ModalComponent, {
        headerViewClass: Ember.View.extend({ templateName: 'test-modal-header' }),
        contentViewClass: Ember.View.extend({ templateName: 'test-modal-content' }),
        footerViewClass: Ember.View.extend({ templateName: 'test-modal-footer' }),
        footerText: null, // When present, this is rendered in the test-modal-footer
        actions: {
          modalHeaderAction() {
            actionsFired.header = true;
            this.set('footerText','Some footer text');
          },
          modalFooterAction() {
            actionsFired.footer = true;
          },
        }
      });

      this.render(hbs`{{render-popover}}`);

      openModal(this, componentSpec);

      return wait().then(() => {
        assert.ok(!actionsFired.header, 'precond - no header action');
        assert.ok(!document.querySelector('[data-test-footer-text]'), 'precond - no footer text');

        $(document.querySelector('[data-test-modal-header-button]')).click();
        return wait();
      }).then(() => {

        assert.ok(actionsFired.header, 'clicked header button');
        assert.ok(!!document.querySelector('[data-test-footer-text]'), 'shows footer text');

        $(document.querySelector('[data-test-modal-footer-button]')).click();
        return wait();
      }).then(() => {
        assert.ok(actionsFired.footer, 'fired footer action');
      })
    });

    // This exposes an issue in the old API where the popover view will re-render and close itself when it should
    // stay open
    test('property bindings can be passed to the popover', function(assert) {
      this.container.register('template:test-popover-1', hbs`
        <div data-test-popover-1>
          <span data-test-popover-1-foo>{{foo}}</span>
          <span data-test-popover-1-bar>{{bar}}</span>
          <span data-test-popover-1-foo-input>{{input value=foo}}</span>
          <span data-test-popover-1-bar-input>{{input value=bar}}</span>

        </div>
      `);
      let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, { layoutName: 'test-popover-1' });

      this.render(hbs`{{render-popover}}`);

      openPopover(this, componentSpec, { fooBinding: 'bar', bar: 'baz' });


      return wait().then(() => {
        assert.ok(!!document.querySelector('[data-test-popover-1]'), 'renders popover');
        assert.equal(document.querySelector('[data-test-popover-1-foo]').innerHTML, 'baz', 'foo property');
        assert.equal(document.querySelector('[data-test-popover-1-bar]').innerHTML, 'baz', 'bar property');
        assert.equal(document.querySelector('[data-test-popover-1-foo-input] input').value, 'baz', 'foo input');
        assert.equal(document.querySelector('[data-test-popover-1-bar-input] input').value, 'baz', 'bar input');

        return fillIn('[data-test-popover-1-foo-input] input', 'baz-via-foo');
      }).then(() => {
        assert.equal(document.querySelector('[data-test-popover-1-foo]').innerHTML, 'baz-via-foo', 'foo property');
        assert.equal(document.querySelector('[data-test-popover-1-bar]').innerHTML, 'baz-via-foo', 'bar property');
        assert.equal(document.querySelector('[data-test-popover-1-foo-input] input').value, 'baz-via-foo', 'foo input');
        assert.equal(document.querySelector('[data-test-popover-1-bar-input] input').value, 'baz-via-foo', 'bar input');

        return fillIn('[data-test-popover-1-bar-input] input', 'baz-via-bar');
      }).then(() => {
        assert.equal(document.querySelector('[data-test-popover-1-foo]').innerHTML, 'baz-via-bar', 'foo property');
        assert.equal(document.querySelector('[data-test-popover-1-bar]').innerHTML, 'baz-via-bar', 'bar property');
        assert.equal(document.querySelector('[data-test-popover-1-foo-input] input').value, 'baz-via-bar', 'foo input');
        assert.equal(document.querySelector('[data-test-popover-1-bar-input] input').value, 'baz-via-bar', 'bar input');
      });
    });
  }

  test('The didRenderPopover hook is called once the popover is properly rendered and positioned', function(assert) {
    assert.expect(2);

    let componentSpec = makeComponent(this, 'test-popover', PopoverComponent, {
      didRenderPopover: () => {
        assert.ok(
          document.querySelector('[data-test-popover-content]'),
          'The popover is now rendered'
        );
      },
      layoutName: 'ember-widgets/-test-popover-content'
    });

    this.render(hbs`{{render-popover}}`);

    assert.ok(
      document.querySelector('[data-test-popover-content]') === null,
      'The popover is not rendered yet'
    );

    openPopover(this, componentSpec);
  });

  if (openPopoverModal) {

    test('properties can be passed the popover modal base', function(assert) {
      let message = 'Oh my, oh my, not good at all.';
      makeComponent(this, 'test-alert', PopoverModalBase, {
        layout: hbs`<span data-test-message>{{this.message}}</span>`
      })

      this.render(hbs`{{render-popover}}`);
      openPopoverModal(this, 'test-alert', {message});

      assert.equal(document.querySelector('[data-test-message]').textContent, message, 'message is rendered');
    });

  }
}
