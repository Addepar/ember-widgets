import Ember from 'ember';
import { assert } from '@ember/debug';
import ModalComponent from 'ember-widgets/components/modal-component';
import PopoverComponent from 'ember-widgets/components/popover-component';
import $ from 'jquery';

function classInheritsFrom(childKlass, parentKlass) {
  return parentKlass.prototype.isPrototypeOf(childKlass.prototype);
}

export default Ember.Service.extend({
  init() {
    this._super(...arguments);

    // Array of specifications for modals and/or popovers
    this.popovers = Ember.A([]);
  },

  openPopover(componentName, options={}, hideAll=true) {
    assert(`[ember-widgets#openPopover] {{render-popover}} must be included in a template for popovers to open`, !!this._popoverDidRender);

    let ComponentClass = this.container.lookupFactory(`component:${componentName}`);
    assert(`[ember-widget#openPopover] cannot find component class for name "${componentName}"`,
            !!ComponentClass,);
    assert(`[ember-widgets#PopoverComponent] The Component Class for "${componentName}" does not extend PopoverComponent`,
            classInheritsFrom(ComponentClass, PopoverComponent));
    
    let rootElementSelector = options.rootElement;
    delete options.rootElement;
    let destinationElement = this._getDestinationElement(ComponentClass, rootElementSelector);

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };
    let popoverSpec = {
      componentName,
      destinationElement,
      propertyOptions: {
        ...options, closePopover
      }
    };

    if (hideAll) {
      this._hideAllPopovers();
    }
    this.popovers.pushObject(popoverSpec);
    return closePopover;
  },

  openModal(componentName, options={}) {
    assert(`[ember-widgets#openModal] {{render-popover}} must be included in a template for popovers to open`, !!this._popoverDidRender);

    let ComponentClass = this.container.lookupFactory(`component:${componentName}`);
    assert(`[ember-widget#openModal] cannot find component class for name "${componentName}"`,
            !!ComponentClass,);
    assert(`[ember-widgets#openModal] The Component Class for "${componentName}" does not extend ModalComponent`,
            classInheritsFrom(ComponentClass, ModalComponent));

    let rootElementSelector = options.rootElement;
    delete options.rootElement;
    let destinationElement = this._getDestinationElement(ComponentClass, rootElementSelector);

    let closePopover = () => {
      this.popovers.removeObject(popoverSpec);
    };
    let popoverSpec = {
      componentName,
      destinationElement,
      propertyOptions: {
        ...options, closePopover
      }
    };

    this._hideAllModals();
    this.popovers.pushObject(popoverSpec);
    return closePopover;
  },

  _hideAllModals() {
    $(document).trigger('modal:hide');
  },

  _hideAllPopovers() {
    $(document).trigger('popover:hide');
  },

  _getDestinationElement(ComponentClass, rootElement) {
    let selector = ComponentClass.rootElement || rootElement;
    assert(`[ember-widgets] No selector found when attempting to openModal`, !!selector);
    let el = document.querySelector(selector);
    assert(`[ember-widgets] No rootElement found for selector "${selector}`, !!el);
    return el;
  },

  // TODO: This should be deprecated
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
