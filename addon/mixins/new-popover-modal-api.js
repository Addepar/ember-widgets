let BINDING_RE = /Binding$/;

export default Ember.Mixin.create({
  init(...args) {
    this._super(...args);
    let opts = this.get('_propertyOptions');
    Ember.assert(`[ember-widgets] popover or modal must be initialized with _propertyOptions`,
                 !this.get('__renderPopoverNewAPI') || !!opts);
    this._setupProperties(opts);
  },
  _setupProperties(props={}) {
    let boundPropKeys = [];
    let bareProps = {};
    Object.keys(props).forEach(key => {
      if (BINDING_RE.test(key)) {
        boundPropKeys.push(key);
      } else {
        bareProps[key] = props[key];
      }
    });
    boundPropKeys.forEach(boundKey => {
      let barePropName = boundKey.replace(BINDING_RE, '');

      // "install" binding
      this[barePropName] = Ember.computed.alias(props[boundKey]);
    });

    // set non-bound props
    this.setProperties(bareProps);
  }
});
