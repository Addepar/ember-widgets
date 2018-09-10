import { moduleForComponent, test } from 'ember-qunit';

import runPopoverTests from '../shared/-popover-tests';
import startApp from '../../helpers/start-app';

function makeComponent(context, componentName, BaseClass, options={}) {
  return {
    klass: BaseClass.extend(options)
  };
}

function openPopover(context, componentSpec, options={}) {
  return openModal(context, componentSpec, options);
}

function openModal(context, componentSpec, options={}) {
  let { klass } = componentSpec;
  options.container = context.container;
  return Ember.run(() => {
    return klass.popup(options);
  });
}

moduleForComponent(
  'render-popover',
  'Integration | Component | render popover (deprecated API)',
  {
    integration: true,
    setup() {
      // Set up application to install app helpers like `fillIn`
      this.application = startApp();
    },
    teardown() {
      Ember.run(this.application, 'destroy');
    }
  }
);

runPopoverTests(test, {makeComponent, openPopover, openModal, skipDeprecatedAPIFailingTests: true});