import Ember from 'ember';
import { getOwner } from '@ember/application';
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

    let ComponentClass = getOwner(this).factoryFor(`component:${componentName}`).class;
    assert(`[ember-widget#openPopover] cannot find component class for name "${componentName}"`,
            !!ComponentClass,);
    assert(`[ember-widgets#PopoverComponent] The Component Class for "${componentName}" does not extend PopoverComponent`,
            classInheritsFrom(ComponentClass, PopoverComponent));
    
    let rootElementSelector = options.rootElement;
    delete options.rootElement;
    let destinationElement = this._getDestinationElement(ComponentClass, rootElementSelector);

    let { popoverSpec, close } = this.buildPopoverSpec(componentName, destinationElement, options);

    if (hideAll) {
      this._hideAllPopovers();
    }
    this.openPopoverSpec(popoverSpec);
    return close;
  },

  openModal(componentName, options={}) {
    assert(`[ember-widgets#openModal] {{render-popover}} must be included in a template for popovers to open`, !!this._popoverDidRender);

    let ComponentClass = getOwner(this).factoryFor(`component:${componentName}`).class;
    assert(`[ember-widget#openModal] cannot find component class for name "${componentName}"`,
            !!ComponentClass,);
    assert(`[ember-widgets#openModal] The Component Class for "${componentName}" does not extend ModalComponent`,
            classInheritsFrom(ComponentClass, ModalComponent));

    let rootElementSelector = options.rootElement;
    delete options.rootElement;
    let destinationElement = this._getDestinationElement(ComponentClass, rootElementSelector);

    let { popoverSpec, close } = this.buildPopoverSpec(componentName, destinationElement, options);

    this._hideAllModals();
    this.openPopoverSpec(popoverSpec);
    return close;
  },

  /*
   * A popoverSpec is an object describing (specifying) a component to be
   * rendered by the `{{render-popover}}` component. In
   * `app/templates/components/render-popover.hbs` these objects are iterated
   * and rendered using the component helper.
   *
   * A popoverSpec also has a `closePopover` method added to the `propertyOptions`
   * for that spec. This function allows a popover/modal/etc to close itself.
   */
  buildPopoverSpec(componentName, destinationElement, options) {
    let close = () => {
      this.popovers.removeObject(popoverSpec);
    };
    let popoverSpec = {
      componentName,
      destinationElement,
      propertyOptions: {
        ...options, closePopover: close
      }
    };

    return { popoverSpec, close };
  },

  /*
   * It is likely you should reach for `openPopover` or `openModal` before
   * using this method. Those methods perform special additional behaviors
   * around hiding currently open items of their type.
   *
   * This is a lower level method which permits developers to open any popover
   * spec. You might use this if you want to use the popover infrastructure but
   * also want to avoid the behaviors of the `openPopover` and `openModal`
   * systems.
   */
  openPopoverSpec(popoverSpec) {
    assert(`[ember-widgets#openPopoverSpec] {{render-popover}} must be included in a template for popovers to open`, !!this._popoverDidRender);
    this.popovers.pushObject(popoverSpec);
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
      ComponentClass.extend({
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
