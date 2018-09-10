import Ember from 'ember';
import { assert } from '@ember/debug';
import ModalComponent from 'ember-widgets/components/modal-component';
import $ from 'jquery';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this.popovers = Ember.A([]);
  },

  openModal(componentName, options={}) {
    let ComponentClass = this.container.lookupFactory(`component:${componentName}`);
    assert(!!ComponentClass,
           `[ember-widget#openModal] cannot find component class for name "${componentName}"`);
    assert(ModalComponent.prototype.isPrototypeOf(ComponentClass.prototype),
          `[ember-widgets#openModal] The Component Class for "${componentName}" does not extend ModalComponent`);

    let rootElementSelector = options.rootElement;
    delete options.rootElement;

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };
    let popoverSpec = {
      componentName,
      destinationElement: this._getDestinationElement(ComponentClass, rootElementSelector),
      propertyOptions: {
        ...options, closePopover
      }
    };

    this._hideAll();
    this.popovers.pushObject(popoverSpec);
    return closePopover;
  },

  _hideAll() {
    $(document).trigger('modal:hide');
  },

  _getDestinationElement(ComponentClass, rootElement) {
    let selector = ComponentClass.rootElement || rootElement;
    assert(!!selector, `[ember-widgets] No selector found when attempting to openModal`);
    let el = document.querySelector(selector);
    assert(!!el, `[ember-widgets] No rootElement found for selector "${selector}`);
    return el;
  },

  open(destinationElement, ComponentClass, options={}) {
    if (!this._popoverDidRender) {
      throw new Error(
        '{{render-popover}} must be included in a template for popovers to open. ' +
          "Unit-integration tests don't include application.hbs; you must add {{render-popover}} to this.render()."
      );
    }

    let popoverSpec = {
      destinationElement
    };

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };

    popoverSpec.childViews = [
      ComponentClass.create({
        ...options,
        closePopover
      })
    ];

    this.popovers.pushObject(popoverSpec);

    return closePopover;
  },

  registerPopoverRendered() {
    this._popoverDidRender = true;
  }
});
