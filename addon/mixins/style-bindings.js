import Ember from 'ember';

export default Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings: ['style'],
  unitType: 'px',
  createStyleString: function(styleName, property) {
   var value;
   value = this.get(property);
   if (value === void 0) {
     return;
   }
   if (Ember.typeOf(value) === 'number') {
     value = value + this.get('unitType');
   }
   return styleName + ":" + value + ";";
  },
  applyStyleBindings: function() {
   var lookup, properties, styleBindings, styleComputed, styles;
   styleBindings = this.styleBindings;
   if (!styleBindings) {
     return;
   }
   // get properties from bindings e.g. ['width', 'top']
   lookup = {};
   styleBindings.forEach(function(binding) {
     var property, ref, style;
     ref = binding.split(':');
     property = ref[0];
     style = ref[1];
     return lookup[style || property] = property;
   });
   styles = _.keys(lookup);
   properties = _.values(lookup);
   // create computed property
   styleComputed = Ember.computed((function(_this) {
     return function() {
       var styleString, styleTokens;
       styleTokens = styles.map(function(style) {
         return _this.createStyleString(style, lookup[style]);
       });
       styleString = styleTokens.join('');
       if (styleString.length !== 0) {
         return styleString;
       }
     };
   })(this));
   // add dependents to computed property
   styleComputed.property.apply(styleComputed, properties);
   // define style computed properties
   return Ember.defineProperty(this, 'style', styleComputed);
  },
  init: function() {
   this.applyStyleBindings();
   return this._super();
  }
});
