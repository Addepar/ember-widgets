import { moduleForComponent, test } from 'ember-qunit';
import runPopoverTests from '../shared/-popover-tests';
import startApp from '../../helpers/start-app';

function makeComponent(context, componentName, BaseClass, options={}) {
  context.register(`component:${componentName}`, BaseClass.extend(options));
  let componentSpec = { componentName };
  return componentSpec;
}

function openPopover(context, componentSpec, options={}, hideAll=true) {
  let { componentName } = componentSpec;
  return Ember.run(() => context.container.lookup('service:popover').openPopover(componentName, options, hideAll));
}

function openModal(context, componentSpec, options={}) {
  let { componentName } = componentSpec;
  return Ember.run(() => context.container.lookup('service:popover').openModal(componentName, options));
}

function openPopoverModal(context, componentName, options={}) {
  return Ember.run(() => {
    let popoverService = context.container.lookup('service:popover');
    let { popoverSpec, close } = popoverService.buildPopoverSpec(componentName, document.body, options);
    popoverService.openPopoverSpec(popoverSpec);
    return close;
  });
}

moduleForComponent(
  'render-popover',
  'Integration | Component | render popover (new API)',
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

runPopoverTests(test, {makeComponent, openPopover, openModal, openPopoverModal});
