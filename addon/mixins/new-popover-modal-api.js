const BINDING_RE = /Binding$/;
const CONCAT_PROPS = ['classNames'];

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
    let concatPropKeys = [];
    Object.keys(props).forEach(key => {
      if (BINDING_RE.test(key)) {
        boundPropKeys.push(key);
      } else if (CONCAT_PROPS.includes(key)) {
        concatPropKeys.push(key);
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

    for (let key of concatPropKeys) {
      let originalProps = this.get(key) || [];
      let newProps = props[key] || [];
      this.set(key, [...originalProps, ...newProps]);
    }
  }
});
