(function(){;
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ember-widgets/components/accordion-component", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AccordionComponent;

    AccordionComponent = Ember.Component.extend({
      classNames: 'panel-group',
      activeIndex: 0
    });

    __exports__["default"] = AccordionComponent;
  });
;define("ember-widgets/components/accordion-item", 
  ["ember","ember-widgets/utils/css-transitions","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var transitionend = __dependency2__["default"];
    var AccordionItem;

    AccordionItem = Ember.View.extend({
      defaultTemplate: Ember.Handlebars.compile('{{view.content}}'),
      layoutName: 'accordion-group-layout',
      classNames: 'panel panel-default',
      title: 'Untitled Accordion Group',
      index: 0,
      isActive: false,
      content: Ember.computed.alias('parentView.content'),
      isActiveDidChange: Ember.observer(function() {
        this.set('isActive', this.get('parentView.activeIndex') === this.get('index'));
        if (this.get('isActive')) {
          return this.show();
        } else {
          return this.hide();
        }
      }, 'parentView.activeIndex'),
      didInsertElement: function() {
        var index;
        index = this.get('parentView').$('.panel').index(this.$());
        this.set('index', index);
        return this.isActiveDidChange();
      },
      click: function(event) {
        if (!(this.$(event.target).closest('.panel-heading').length > 0)) {
          return;
        }
        if (this.get('isActive')) {
          return this.set('parentView.activeIndex', null);
        } else {
          return this.set('parentView.activeIndex', this.get('index'));
        }
      },
      hide: function() {
        var $accordionBody;
        $accordionBody = this.$('.panel-collapse');
        $accordionBody.height($accordionBody.height())[0].offsetHeight;
        $accordionBody.removeClass('collapse').removeClass('in').addClass('collapsing');
        $accordionBody.height(0);
        return this._onTransitionEnd($accordionBody, function() {
          return $accordionBody.removeClass('collapsing').addClass('collapse');
        });
      },
      show: function() {
        var $accordionBody;
        $accordionBody = this.$('.panel-collapse');
        $accordionBody.removeClass('collapse').addClass('collapsing').height(0);
        $accordionBody.height($accordionBody[0]['scrollHeight']);
        return this._onTransitionEnd($accordionBody, function() {
          return $accordionBody.removeClass('collapsing').addClass('in').height('auto');
        });
      },
      _onTransitionEnd: function($el, callback) {
        if (this.get('emberWidgetsConfig.DISABLE_ANIMATIONS')) {
          return callback();
        } else {
          return $el.one(transitionend, callback);
        }
      }
    });

    __exports__["default"] = AccordionItem;
  });
;define("ember-widgets/utils/css-transitions", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var transEndEventNames, transitionend;

    transEndEventNames = {
      "WebkitTransition": "webkitTransitionEnd",
      "MozTransition": "transitionend",
      "OTransition": "oTransitionEnd",
      "msTransition": "MSTransitionEnd",
      "transition": "transitionend"
    };

    transitionend = transEndEventNames[Modernizr.prefixed('transition')];

    __exports__["default"] = transitionend;
  });
;define("ember-widgets/components/carousel-component", 
  ["ember","ember-widgets/utils/css-transitions","ember-widgets/components/carousel-indicator","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var transitionend = __dependency2__["default"];
    var CarouselIndicator = __dependency3__["default"];
    var CarouselComponent;

    CarouselComponent = Ember.Component.extend({
      layoutName: 'carousel',
      classNames: ['carousel', 'slide'],
      classNameBindings: Ember.A(['sliding']),
      activeIndex: 0,
      itemViewClass: CarouselIndicator,
      didInsertElement: function() {
        if (!this.get('content')) {
          return this.set('content', Ember.A(new Array(this.$('.item').length)));
        }
      },
      actions: {
        prev: function() {
          var activeIndex, contentLength, nextIndex;
          if (this.get('sliding')) {
            return;
          }
          activeIndex = this.get('activeIndex');
          contentLength = this.get('content.length');
          nextIndex = activeIndex - 1;
          nextIndex = nextIndex < 0 ? contentLength - 1 : nextIndex;
          return this.slide('prev', nextIndex);
        },
        next: function() {
          var activeIndex, contentLength, nextIndex;
          if (this.get('sliding')) {
            return;
          }
          activeIndex = this.get('activeIndex');
          contentLength = this.get('content.length');
          nextIndex = activeIndex + 1;
          nextIndex = nextIndex >= contentLength ? 0 : nextIndex;
          return this.slide('next', nextIndex);
        }
      },
      to: function(pos) {
        var direction;
        if (this.get('sliding')) {
          return;
        }
        if (!((0 <= pos && pos < this.get('content.length')))) {
          return;
        }
        direction = pos > this.get('activeIndex') ? 'next' : 'prev';
        return this.slide(direction, pos);
      },
      slide: function(type, nextIndex) {
        var $active, $next, direction,
          _this = this;
        if (this.get('activeIndex') === nextIndex) {
          return;
        }
        direction = type === 'next' ? 'left' : 'right';
        $active = $(this.$('.item').get(this.get('activeIndex')));
        $next = $(this.$('.item').get(nextIndex));
        if (!this.get('emberWidgetsConfig.DISABLE_ANIMATIONS')) {
          this.set('sliding', true);
          $next.addClass(type);
          $next[0].offsetWidth;
          $active.addClass(direction);
          $next.addClass(direction);
        }
        return this._onTransitionEnd($next, function() {
          return Ember.run(_this, function() {
            this.set('activeIndex', nextIndex);
            $next.removeClass([type, direction].join(' ')).addClass('active');
            $active.removeClass(['active', direction].join(' '));
            return this.set('sliding', false);
          });
        });
      },
      _onTransitionEnd: function($el, callback) {
        if (this.get('emberWidgetsConfig.DISABLE_ANIMATIONS')) {
          return callback();
        } else {
          return $el.one(transitionend, callback);
        }
      }
    });

    __exports__["default"] = CarouselComponent;
  });
;define("ember-widgets/components/carousel-indicator", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CarouselIndicator;

    CarouselIndicator = Ember.View.extend({
      classNameBindings: 'isActive:active',
      isActive: Ember.computed(function() {
        return this.get('contentIndex') === this.get('controller.activeIndex');
      }).property('contentIndex', 'controller.activeIndex'),
      click: function() {
        return this.get('controller').to(this.get('contentIndex'));
      }
    });

    __exports__["default"] = CarouselIndicator;
  });
;define("ember-widgets/components/carousel-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CarouselItem;

    CarouselItem = Ember.View.extend({
      classNames: 'item'
    });

    __exports__["default"] = CarouselItem;
  });
;define("ember-widgets/components/color-picker-cell", 
  ["ember","ember-widgets/utils/color-utils","ember-widgets/mixins/style-bindings","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var colorToHex = __dependency2__["default"];
    var StyleBindingsMixin = __dependency3__["default"];
    var ColorPickerCell;

    ColorPickerCell = Ember.View.extend(StyleBindingsMixin, {
      templateName: 'color-picker-cell',
      classNames: ['pull-left', 'color-picker-cell'],
      classNameBindings: Ember.A(['isActive:active:inactive']),
      styleBindings: 'color:background-color',
      color: null,
      isActive: Ember.computed(function() {
        return colorToHex(this.get('controller.selectedColor')) === colorToHex(this.get('color'));
      }).property('controller.selectedColor', 'color'),
      click: function(event) {
        this.get('controller').send('setColor', this.get('color'));
        return this.get('controller').userDidSelect(this.get('color'));
      }
    });

    __exports__["default"] = ColorPickerCell;
  });
;define("ember-widgets/utils/color-utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var colorNameToHexMap, colorToHex, rgbToHex;

    rgbToHex = function(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    colorNameToHexMap = {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      gold: "#ffd700",
      goldenrod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      "indianred ": "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavender: "#e6e6fa",
      lavenderblush: "#fff0f5",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgrey: "#d3d3d3",
      lightgreen: "#90ee90",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370d8",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#d87093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      steelblue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    };

    colorToHex = function(color) {
      var blue, digits, green, opacity, red;
      if (!color) {
        return color;
      }
      if (color.substr(0, 1) === "#" || color === "transparent") {
        return color.toLowerCase;
      }
      if (color in colorNameToHexMap) {
        return colorNameToHexMap[color.toLowerCase()];
      }
      digits = /(.*?)rgb(a)?\((\d+), (\d+), (\d+)(, (\d+))?\)/.exec(color);
      if ((digits != null ? digits.length : void 0) === 8) {
        red = parseInt(digits[3]);
        green = parseInt(digits[4]);
        blue = parseInt(digits[5]);
        opacity = parseInt(digits[7]);
        if (opacity === 0) {
          return "transparent";
        }
        return rgbToHex(red, green, blue);
      }
      return void 0;
    };

    __exports__["default"] = colorToHex;
  });
;define("ember-widgets/mixins/style-bindings", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var StyleBindingsMixin;

    StyleBindingsMixin = Ember.Mixin.create({
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
        return "" + styleName + ":" + value + ";";
      },
      applyStyleBindings: function() {
        var lookup, properties, styleBindings, styleComputed, styles,
          _this = this;
        styleBindings = this.styleBindings;
        if (!styleBindings) {
          return;
        }
        lookup = {};
        styleBindings.forEach(function(binding) {
          var property, style, _ref;
          _ref = binding.split(':'), property = _ref[0], style = _ref[1];
          return lookup[style || property] = property;
        });
        styles = _.keys(lookup);
        properties = _.values(lookup);
        styleComputed = Ember.computed(function() {
          var styleString, styleTokens;
          styleTokens = styles.map(function(style) {
            return _this.createStyleString(style, lookup[style]);
          });
          styleString = styleTokens.join('');
          if (styleString.length !== 0) {
            return styleString;
          }
        });
        styleComputed.property.apply(styleComputed, properties);
        return Ember.defineProperty(this, 'style', styleComputed);
      },
      init: function() {
        this.applyStyleBindings();
        return this._super();
      }
    });

    __exports__["default"] = StyleBindingsMixin;
  });
;define("ember-widgets/components/color-picker", 
  ["ember","ember-widgets/utils/color-utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var colorToHex = __dependency2__["default"];
    var ColorPicker;

    ColorPicker = Ember.Component.extend({
      layoutName: 'color-picker',
      classNames: ['color-picker-button'],
      colorPickerPlacement: 'right',
      dropdownClass: null,
      INITIAL_COLOR: '#0074D9',
      selectedColor: '#0074D9',
      selectedColorRGB: Ember.computed(function() {
        return colorToHex(this.get('selectedColor'));
      }).property('selectedColor'),
      customColor: '',
      isColorTransparent: Ember.computed.equal('selectedColorRGB', 'transparent'),
      colorRows: Ember.A([Ember.A(['#000000', '#111111', '#434343', '#666666', '#999999', '#AAAAAA', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF']), Ember.A(['#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144B', '#B10DC9', 'transparent'])]),
      setCustomColor: Ember.observer(function() {
        if (this.get('isCustomColorValid') === true) {
          return this.set('selectedColor', this.get('customColor'));
        }
      }, 'customColor', 'isCustomColorValid'),
      isCustomColorValid: Ember.computed(function() {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("" + (this.get('customColor')));
      }).property('customColor'),
      customColorCSS: Ember.computed(function() {
        return "background-color: " + (this.get('customColor'));
      }).property('customColor'),
      actions: {
        setColor: function(color) {
          this.set('customColor', '');
          return this.set('selectedColor', color);
        }
      },
      userDidSelect: function(selection) {
        return this.sendAction('userSelected', selection);
      }
    });

    __exports__["default"] = ColorPicker;
  });
;define("ember-widgets/components/editable-label-component", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EditableLabel;

    EditableLabel = Ember.View.extend({
      templateName: 'editable-label',
      classNames: ['editable-label'],
      placeholder: '',
      isEditing: false,
      value: null,
      displayName: Ember.computed(function() {
        if (Ember.isNone(this.get('value')) || this.get('value') === '') {
          return this.get('placeholder');
        } else {
          return this.get('value');
        }
      }).property('value', 'placeholder'),
      innerTextField: Ember.TextField.extend({
        valueBinding: Ember.Binding.oneWay('parentView.value'),
        didInsertElement: function() {
          return this.$().focus();
        },
        blur: function() {
          this.set('parentView.isEditing', false);
          return this.set('parentView.value', this.get('value'));
        }
      }),
      editLabel: function() {
        return this.set('isEditing', true);
      }
    });

    __exports__["default"] = EditableLabel;
  });
;define("ember-widgets/components/modal-component", 
  ["ember","ember-widgets/mixins/style-bindings","ember-widgets/utils/css-transitions","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var StyleBindingsMixin = __dependency2__["default"];
    var transitionend = __dependency3__["default"];
    var ModalComponent;

    ModalComponent = Ember.Component.extend(StyleBindingsMixin, {
      layoutName: 'modal',
      classNames: ['modal'],
      classNameBindings: ['isShowing:in', 'hasCloseButton::has-no-close-button', 'fadeEnabled:fade'],
      modalPaneBackdrop: '<div class="modal-backdrop"></div>',
      bodyElementSelector: '.modal-backdrop',
      targetObject: null,
      enforceModality: false,
      escToCancel: true,
      backdrop: true,
      isShowing: false,
      hasCloseButton: true,
      fade: true,
      headerText: "Modal Header",
      confirmText: "Confirm",
      cancelText: "Cancel",
      closeText: null,
      content: "",
      size: "normal",
      isValid: true,
      fadeEnabled: Ember.computed(function() {
        if (this.get('emberWidgetsConfig.DISABLE_ANIMATIONS')) {
          return false;
        }
        return this.get('fade');
      }).property('fade'),
      confirm: Ember.K,
      cancel: Ember.K,
      close: Ember.K,
      headerViewClass: Ember.View.extend({
        templateName: 'modal_header'
      }),
      contentViewClass: Ember.View.extend({
        template: Ember.Handlebars.compile("<p>{{content}}</p>")
      }),
      footerViewClass: Ember.View.extend({
        templateName: 'modal-footer'
      }),
      _headerViewClass: Ember.computed(function() {
        var headerViewClass;
        headerViewClass = Ember.get(this, 'headerViewClass');
        if (typeof headerViewClass === 'string') {
          return Ember.get(headerViewClass);
        } else {
          return headerViewClass;
        }
      }).property('headerViewClass'),
      _contentViewClass: Ember.computed(function() {
        var contentViewClass;
        contentViewClass = Ember.get(this, 'contentViewClass');
        if (typeof contentViewClass === 'string') {
          return Ember.get(contentViewClass);
        } else {
          return contentViewClass;
        }
      }).property('contentViewClass'),
      _footerViewClass: Ember.computed(function() {
        var footerViewClass;
        footerViewClass = Ember.get(this, 'footerViewClass');
        if (typeof footerViewClass === 'string') {
          return Ember.get(footerViewClass);
        } else {
          return footerViewClass;
        }
      }).property('footerViewClass'),
      sizeClass: Ember.computed(function() {
        switch (this.get('size')) {
          case 'large':
            return 'modal-lg';
          case 'small':
            return 'modal-sm';
          default:
            return '';
        }
      }).property('size'),
      actions: {
        sendCancel: function() {
          var cancel;
          if (!Ember.get(this, 'isShowing')) {
            return;
          }
          cancel = Ember.get(this, 'cancel');
          if (typeof cancel === 'function') {
            this.cancel(this);
          } else {
            this.sendAction('cancel');
          }
          return this.hide();
        },
        sendConfirm: function() {
          var confirm;
          if (!Ember.get(this, 'isShowing')) {
            return;
          }
          confirm = Ember.get(this, 'confirm');
          if (typeof confirm === 'function') {
            confirm(this);
          } else {
            this.sendAction('confirm');
          }
          return this.hide();
        },
        sendClose: function() {
          var close;
          if (!Ember.get(this, 'isShowing')) {
            return;
          }
          close = Ember.get(this, 'close');
          if (typeof close === 'function') {
            this.close(this);
          } else {
            this.sendAction('close');
          }
          return this.hide();
        }
      },
      didInsertElement: function() {
        this._super();
        if (this.get('fade')) {
          this.$()[0].offsetWidth;
        }
        if (this.get('backdrop')) {
          this._appendBackdrop();
        }
        Ember.run.next(this, function() {
          return this.set('isShowing', true);
        });
        $(document.body).addClass('modal-open');
        return this._setupDocumentHandlers();
      },
      willDestroyElement: function() {
        this._super();
        this._removeDocumentHandlers();
        if (this._backdrop) {
          return this._backdrop.remove();
        }
      },
      keyHandler: Ember.computed(function() {
        var _this = this;
        return function(event) {
          if (event.which === 27 && _this.get('escToCancel')) {
            return _this.send('sendCancel');
          }
        };
      }),
      click: function(event) {
        if (event.target !== event.currentTarget) {
          return;
        }
        if (!this.get('enforceModality')) {
          return this.send('sendCancel');
        }
      },
      hide: function() {
        var _this = this;
        this.set('isShowing', false);
        $(document.body).removeClass('modal-open');
        if (this._backdrop) {
          this._backdrop.removeClass('in');
        }
        if (this.get('fadeEnabled')) {
          return this.$().one(transitionend, function() {
            return Ember.run(_this, _this.destroy);
          });
        } else {
          return Ember.run(this, this.destroy);
        }
      },
      _appendBackdrop: function() {
        var modalPaneBackdrop, parentLayer;
        parentLayer = this.$().parent();
        modalPaneBackdrop = this.get('modalPaneBackdrop');
        this._backdrop = this.get('fadeEnabled') ? jQuery(modalPaneBackdrop).addClass('fade') : void 0;
        this._backdrop.appendTo(parentLayer);
        return Ember.run.next(this, function() {
          return this._backdrop.addClass('in');
        });
      },
      _setupDocumentHandlers: function() {
        var _this = this;
        this._super();
        if (!this._hideHandler) {
          this._hideHandler = function() {
            return _this.hide();
          };
          $(document).on('modal:hide', this._hideHandler);
        }
        return $(document).on('keyup', this.get('keyHandler'));
      },
      _removeDocumentHandlers: function() {
        this._super();
        $(document).off('modal:hide', this._hideHandler);
        this._hideHandler = null;
        return $(document).off('keyup', this.get('keyHandler'));
      }
    });

    ModalComponent.reopenClass({
      rootElement: '.ember-application',
      poppedModal: null,
      hideAll: function() {
        return $(document).trigger('modal:hide');
      },
      popup: function(options) {
        var modal, rootElement, _ref, _ref1;
        if (options == null) {
          options = {};
        }
        this.hideAll();
        rootElement = options.rootElement || this.rootElement;
        modal = this.create(options);
        if ((_ref = modal.targetObject) != null ? _ref.get('container') : void 0) {
          Ember.set(modal, 'container', (_ref1 = modal.targetObject) != null ? _ref1.get('container') : void 0);
        }
        modal.appendTo(rootElement);
        return modal;
      }
    });

    __exports__["default"] = ModalComponent;
  });
;define("ember-widgets/components/multi-select-component", 
  ["ember","ember-widgets/components/select-component","ember-widgets/views/multi-select-option","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SelectComponent = __dependency2__["default"];
    var MultiSelectOptionView = __dependency3__["default"];
    var MultiSelectComponent;

    MultiSelectComponent = SelectComponent.extend({
      layoutName: 'multi-select',
      selections: void 0,
      choicesFieldClass: '',
      placeholder: void 0,
      persistentPlaceholder: void 0,
      values: Ember.computed(function(key, value) {
        var selections, valuePath;
        if (arguments.length === 2) {
          if (!value) {
            return;
          }
          valuePath = this.get('optionValuePath');
          this.set('selections', Ember.A(this.get('content').filter(function(item) {
            return value.contains(Ember.get(item, valuePath));
          })));
          return value;
        } else {
          valuePath = this.get('optionValuePath');
          selections = this.get('selections');
          if (valuePath) {
            return selections.getEach(valuePath);
          } else {
            return selections;
          }
        }
      }).property('selections.@each'),
      selectionItemView: MultiSelectOptionView,
      invisiblePlaceholderText: Ember.computed(function() {
        if (this.get('query')) {
          return this.get('query');
        }
        if (this.get('selections.length')) {
          return this.get('persistentPlaceholder');
        }
        return this.get('placeholder') || this.get('persistentPlaceholder');
      }).property('query', 'placeholder', 'persistentPlaceholder', 'selections.length'),
      searchView: Ember.TextField.extend({
        "class": 'ember-select-input',
        valueBinding: 'parentView.query',
        focusIn: function(event) {
          return this.set('parentView.showDropdown', true);
        },
        placeholder: Ember.computed(function() {
          if (this.get('parentView.selections.length')) {
            return this.get('parentView.persistentPlaceholder');
          }
          return this.get('parentView.placeholder') || this.get('parentView.persistentPlaceholder');
        }).property('parentView.placeholder', 'parentView.persistentPlaceholder', 'parentView.selections.length')
      }),
      preparedContent: Ember.computed(function() {
        var content, selections;
        content = this.get('content');
        selections = this.get('selections');
        if (!(content && selections)) {
          return Ember.A([]);
        }
        if (this.get('sortLabels')) {
          return this.get('sortedFilteredContent').filter(function(item) {
            return !selections.contains(item);
          });
        } else {
          return this.get('filteredContent').filter(function(item) {
            return !selections.contains(item);
          });
        }
      }).property('content.@each', 'filteredContent.[]', 'sortedFilteredContent.[]', 'selections.@each', 'sortLabels'),
      selectionDidChange: Ember.observer(function() {
        var selection, selections;
        selections = this.get('selections');
        selection = this.get('selection');
        this.set('selection', null);
        this.set('query', '');
        if (!Ember.isEmpty(selection) && !selections.contains(selection)) {
          return selections.pushObject(selection);
        }
      }, 'selection'),
      didInsertElement: function() {
        this._super();
        if (!this.get('selections')) {
          this.set('selections', Ember.A([]));
        }
        if (!this.get('values')) {
          return this.set('values', Ember.A([]));
        }
      },
      deletePressed: function(event) {
        if (event.target.selectionStart === 0) {
          return this.removeSelectItem(this.get('selections.lastObject'));
        }
      },
      removeSelectItem: function(item) {
        return this.get('selections').removeObject(item);
      },
      actions: {
        removeSelectItem: function(item) {
          return this.removeSelectItem(item);
        }
      }
    });

    __exports__["default"] = MultiSelectComponent;
  });
;define("ember-widgets/components/select-component", 
  ["ember","ember-widgets/mixins/body-event-listener","ember-widgets/mixins/resize-handler","ember-widgets/views/select-option","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var BodyEventListener = __dependency2__["default"];
    var ResizeHandlerMixin = __dependency3__["default"];
    var SelectOptionView = __dependency4__["default"];
    var SelectComponent;

    SelectComponent = Ember.Component.extend(BodyEventListener, ResizeHandlerMixin, {
      layoutName: 'select',
      classNames: 'ember-select',
      attributeBindings: Ember.A(['tabindex']),
      classNameBindings: Ember.A(['showDropdown:open', 'isDropup:dropup']),
      itemViewClass: SelectOptionView,
      prompt: 'Select a Value',
      placeholder: void 0,
      disabled: false,
      highlightedIndex: -1,
      tabindex: -1,
      showDropdown: false,
      dropdownHeight: 300,
      rowHeight: 26,
      sortLabels: true,
      titleOnOptions: false,
      isSelect: false,
      isDropup: false,
      isDropdownMenuPulledRight: false,
      dropdownToggleIcon: 'fa fa-caret-down',
      buttonClass: 'btn btn-default',
      dropdownMenuClass: '',
      content: Ember.A([]),
      selection: null,
      query: '',
      optionLabelPath: '',
      optionValuePath: '',
      optionGroupPath: '',
      optionDefaultPath: '',
      selectMenuView: null,
      updateDropdownLayout: Ember.observer(function() {
        var dropdownButton, dropdownButtonHeight, dropdownButtonOffset, dropdownMargin, dropdownMenu, dropdownMenuBottom, dropdownMenuHeight, dropdownMenuOffset, dropdownMenuWidth, dropupMenuTop;
        if ((this.get('_state') || this.get('state')) !== 'inDOM' || this.get('showDropdown') === false) {
          return;
        }
        this.$('.js-dropdown-menu').css('visibility', 'hidden');
        dropdownButton = this.$('.js-dropdown-toggle')[0];
        dropdownButtonHeight = this.$(dropdownButton).outerHeight();
        dropdownButtonOffset = this.$(dropdownButton).offset();
        dropdownMenu = this.$('.js-dropdown-menu')[0];
        dropdownMenuHeight = this.$(dropdownMenu).outerHeight();
        dropdownMenuWidth = this.$(dropdownMenu).outerWidth();
        dropdownMenuOffset = this.$(dropdownMenu).offset();
        dropdownMargin = 15;
        if (this.get('isDropup')) {
          dropdownMenuBottom = dropdownButtonOffset.top + dropdownButtonHeight + dropdownMenuHeight + dropdownMargin;
        } else {
          dropdownMenuBottom = dropdownMenuOffset.top + dropdownMenuHeight;
        }
        dropupMenuTop = dropdownButtonOffset.top - dropdownMenuHeight - dropdownMargin;
        this.set('isDropup', dropupMenuTop > window.scrollY && dropdownMenuBottom > window.innerHeight);
        this.set('isDropdownMenuPulledRight', dropdownButtonOffset.left + dropdownMenuWidth + dropdownMargin > window.innerWidth);
        return this.$('.js-dropdown-menu').css('visibility', 'visible');
      }, 'showDropdown'),
      onResizeEnd: function() {
        return Ember.run(this, this.updateDropdownLayout);
      },
      itemView: Ember.computed(function() {
        var itemViewClass;
        itemViewClass = this.get('itemViewClass');
        if (typeof itemViewClass === 'string') {
          return Ember.get(itemViewClass);
        }
        return itemViewClass;
      }).property('itemViewClass'),
      selectedItemView: Ember.computed(function() {
        return this.get('itemView').extend({
          tagName: 'span',
          labelPath: Ember.computed.alias('controller.optionLabelPath'),
          context: Ember.computed.alias('controller.selection')
        });
      }).property('itemView'),
      selectedLabel: Ember.computed(function() {
        return Ember.get(this.get('selection'), this.get('optionLabelPath'));
      }).property('selection', 'optionLabelPath'),
      searchView: Ember.TextField.extend({
        placeholder: Ember.computed.alias('parentView.placeholder'),
        valueBinding: 'parentView.query',
        showDropdownDidChange: Ember.observer(function() {
          return Ember.run.schedule('afterRender', this, function() {
            if ((this.get('_state') || this.get('state')) === 'inDOM') {
              return this.$().focus();
            }
          });
        }, 'parentView.showDropdown')
      }),
      listView: Ember.ListView.extend({
        style: Ember.computed(function() {
          var height;
          height = Math.min(this.get('height'), this.get('totalHeight'));
          return "height: " + height + "px";
        }).property('height', 'totalHeight')
      }),
      preparedContent: Ember.computed(function() {
        if (this.get('sortLabels')) {
          return this.get('sortedFilteredContent');
        } else {
          return this.get('filteredContent');
        }
      }).property('sortLabels', 'filteredContent', 'sortedFilteredContent'),
      contentProxy: Ember.computed(function() {
        var ContentProxy, matcher, optionLabelPath, query,
          _this = this;
        matcher = function(searchText, item) {
          return _this.matcher(searchText, item);
        };
        optionLabelPath = this.get('optionLabelPath');
        query = this.get('query');
        ContentProxy = Ember.ObjectProxy.extend({
          filteredContent: Ember.computed(function() {
            return (this.get('content') || []).filter(function(item) {
              return matcher(query, item);
            });
          }).property("content.@each." + optionLabelPath),
          sortedFilteredContent: Ember.computed(function() {
            return _.sortBy(this.get('filteredContent'), function(item) {
              var _ref;
              return (_ref = Ember.get(item, optionLabelPath)) != null ? _ref.toLowerCase() : void 0;
            });
          }).property("filteredContent")
        });
        return ContentProxy.create({
          content: this.get('content')
        });
      }).property('content', 'optionLabelPath', 'query'),
      filteredContent: Ember.computed.alias('contentProxy.filteredContent'),
      sortedFilteredContent: Ember.computed.alias('contentProxy.sortedFilteredContent'),
      groupedContent: Ember.computed(function() {
        var content, groups, path, result;
        path = this.get('optionGroupPath');
        content = this.get('preparedContent');
        if (!path) {
          return content;
        }
        groups = _.groupBy(content, function(item) {
          return Ember.get(item, path);
        });
        result = Ember.A();
        _.keys(groups).sort().forEach(function(key) {
          result.pushObject(Ember.Object.create({
            isGroupOption: true,
            name: key
          }));
          return result.pushObjects(groups[key]);
        });
        return result;
      }).property('preparedContent', 'optionGroupPath', 'labels.[]'),
      isLoading: false,
      isLoaded: Ember.computed.not('isLoading'),
      filteredContentIsEmpty: Ember.computed.empty('filteredContent'),
      hasNoResults: Ember.computed.and('isLoaded', 'filteredContentIsEmpty'),
      value: Ember.computed(function(key, value) {
        var selection, valuePath;
        if (arguments.length === 2) {
          valuePath = this.get('optionValuePath');
          selection = value;
          if (valuePath) {
            selection = this.get('content').findProperty(valuePath, value);
          }
          this.set('selection', selection);
          return value;
        } else {
          valuePath = this.get('optionValuePath');
          selection = this.get('selection');
          if (valuePath) {
            return Ember.get(selection, valuePath);
          } else {
            return selection;
          }
        }
      }).property('selection'),
      didInsertElement: function() {
        this._super();
        return this.setDefaultSelection();
      },
      matcher: function(searchText, item) {
        var escapedSearchText, label, regex;
        if (!searchText) {
          return true;
        }
        label = Ember.get(item, this.get('optionLabelPath'));
        escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        regex = new RegExp(escapedSearchText, 'i');
        return regex.test(label);
      },
      setDefaultSelection: Ember.observer(function() {
        var content, defaultPath;
        if (this.get('selection')) {
          return;
        }
        content = this.get('content');
        defaultPath = this.get('optionDefaultPath');
        if (!(content && defaultPath)) {
          return;
        }
        return this.set('selection', content.findProperty(defaultPath));
      }, 'content.@each'),
      selectableOptionsDidChange: Ember.observer(function() {
        var highlighted;
        if (this.get('showDropdown')) {
          highlighted = this.get('highlighted');
          if (!this.get('selectableOptions').contains(highlighted)) {
            return this.set('highlighted', this.get('selectableOptions.firstObject'));
          }
        }
      }, 'selectableOptions', 'showDropdown'),
      /*
      # SELECTION RELATED
      */

      KEY_EVENTS: {
        8: 'deletePressed',
        27: 'escapePressed',
        13: 'enterPressed',
        38: 'upArrowPressed',
        40: 'downArrowPressed'
      },
      selectableOptions: Ember.computed(function() {
        return Ember.A((this.get('groupedContent') || []).filter(function(item) {
          return !Ember.get(item, 'isGroupOption');
        }));
      }).property('groupedContent'),
      highlighted: Ember.computed(function(key, value) {
        var content, index;
        content = this.get('selectableOptions') || Ember.A([]);
        value = value || Ember.A([]);
        if (arguments.length === 1) {
          index = this.get('highlightedIndex');
          value = content.objectAt(index);
        } else {
          index = content.indexOf(value);
          this.setHighlightedIndex(index, true);
        }
        return value;
      }).property('selectableOptions', 'highlightedIndex'),
      bodyClick: function() {
        return this.send('hideDropdown');
      },
      keyDown: function(event) {
        var map, method, _ref;
        if (!this.get('showDropdown')) {
          return this.set('showDropdown', true);
        }
        map = this.get('KEY_EVENTS');
        method = map[event.keyCode];
        if (method) {
          return (_ref = this.get(method)) != null ? _ref.apply(this, arguments) : void 0;
        }
      },
      deletePressed: Ember.K,
      escapePressed: function(event) {
        return this.send('hideDropdown');
      },
      enterPressed: function(event) {
        var item;
        item = this.get('highlighted');
        if (!Ember.isEmpty(item)) {
          this.set('selection', item);
        }
        if (!Ember.isEmpty(item)) {
          this.userDidSelect(item);
        }
        this.send('hideDropdown');
        return event.preventDefault();
      },
      upArrowPressed: function(event) {
        var index, sel;
        sel = this.get('highlightedIndex');
        index = event.ctrlKey || event.metaKey ? 0 : sel - 1;
        this.setHighlightedIndex(index, true);
        return event.preventDefault();
      },
      downArrowPressed: function(event) {
        var clen, index, sel;
        sel = this.get('highlightedIndex');
        clen = this.get('selectableOptions.length');
        index = event.ctrlKey || event.metaKey ? clen - 1 : sel + 1;
        this.setHighlightedIndex(index, true);
        return event.preventDefault();
      },
      setHighlightedIndex: function(index, ensureVisible) {
        if (!this.ensureIndex(index)) {
          return;
        }
        this.set('highlightedIndex', index);
        if (ensureVisible) {
          return this.ensureVisible(index);
        }
      },
      ensureIndex: function(index) {
        var clen;
        clen = this.get('selectableOptions.length');
        return index >= 0 && index < clen;
      },
      ensureVisible: function(index) {
        var $listView, endIndex, item, listView, newIndex, numRows, startIndex;
        $listView = this.$('.ember-list-view');
        listView = Ember.View.views[$listView.attr('id')];
        if (!listView) {
          return;
        }
        startIndex = listView._startingIndex();
        numRows = listView._childViewCount() - 1;
        endIndex = startIndex + numRows;
        item = this.get('selectableOptions').objectAt(index);
        newIndex = this.get('groupedContent').indexOf(item);
        if (index === 0) {
          return $listView.scrollTop(0);
        } else if (newIndex < startIndex) {
          return $listView.scrollTop(newIndex * this.get('rowHeight'));
        } else if (newIndex >= endIndex) {
          return $listView.scrollTop((newIndex - numRows + 1.5) * this.get('rowHeight'));
        }
      },
      userDidSelect: function(selection) {
        return this.sendAction('userSelected', selection);
      },
      actions: {
        toggleDropdown: function(event) {
          if (this.get('disabled')) {
            return;
          }
          return this.toggleProperty('showDropdown');
        },
        hideDropdown: function(event) {
          if (this.get('isDestroyed') || this.get('isDestroying')) {
            return;
          }
          return this.set('showDropdown', false);
        }
      }
    });

    __exports__["default"] = SelectComponent;
  });
;define("ember-widgets/mixins/body-event-listener", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var BodyEventListener;

    BodyEventListener = Ember.Mixin.create({
      bodyElementSelector: 'html',
      bodyClick: Ember.K,
      didInsertElement: function() {
        this._super();
        return Ember.run.next(this, this._setupDocumentHandlers);
      },
      willDestroyElement: function() {
        this._super();
        return this._removeDocumentHandlers();
      },
      _setupDocumentHandlers: function() {
        var _this = this;
        if (this._clickHandler || this.isDestroying) {
          return;
        }
        this._clickHandler = function(event) {
          return Ember.run(function() {
            if ((_this.get('_state') || _this.get('state')) === 'inDOM' && Ember.isEmpty(_this.$().has($(event.target)))) {
              return _this.bodyClick();
            }
          });
        };
        return $(this.get('bodyElementSelector')).on("click", this._clickHandler);
      },
      _removeDocumentHandlers: function() {
        $(this.get('bodyElementSelector')).off("click", this._clickHandler);
        return this._clickHandler = null;
      }
    });

    __exports__["default"] = BodyEventListener;
  });
;define("ember-widgets/mixins/resize-handler", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ResizeHandlerMixin;

    ResizeHandlerMixin = Ember.Mixin.create({
      resizeEndDelay: 200,
      resizing: false,
      onResizeStart: Ember.K,
      onResizeEnd: Ember.K,
      onResize: Ember.K,
      endResize: Ember.computed(function() {
        return function(event) {
          if (this.isDestroyed) {
            return;
          }
          this.set('resizing', false);
          if (typeof this.onResizeEnd === "function") {
            return this.onResizeEnd(event);
          }
        };
      }),
      handleWindowResize: function(event) {
        if (!this.get('resizing')) {
          this.set('resizing', true);
          if (typeof this.onResizeStart === "function") {
            this.onResizeStart(event);
          }
        }
        if (typeof this.onResize === "function") {
          this.onResize(event);
        }
        return Ember.run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
      },
      didInsertElement: function() {
        this._super();
        return this._setupResizeDocumentHandlers();
      },
      willDestroyElement: function() {
        this._removeResizeDocumentHandlers();
        return this._super();
      },
      _setupResizeDocumentHandlers: function() {
        if (this._resizeHandler) {
          return;
        }
        this._resizeHandler = jQuery.proxy(this.get('handleWindowResize'), this);
        return jQuery(window).on("resize." + this.elementId, this._resizeHandler);
      },
      _removeResizeDocumentHandlers: function() {
        jQuery(window).off("resize." + this.elementId, this._resizeHandler);
        return this._resizeHandler = null;
      }
    });

    __exports__["default"] = ResizeHandlerMixin;
  });
;define("ember-widgets/views/select-option", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SelectOptionView;

    SelectOptionView = Ember.ListItemView.extend({
      tagName: 'li',
      templateName: 'select-item',
      layoutName: 'select-item-layout',
      classNames: 'ember-select-result-item',
      classNameBindings: Ember.A(['content.isGroupOption:ember-select-group', 'isHighlighted:highlighted']),
      labelPath: Ember.computed.alias('controller.optionLabelPath'),
      isHighlighted: Ember.computed(function() {
        return this.get('controller.highlighted') === this.get('content');
      }).property('controller.highlighted', 'content'),
      labelPathDidChange: Ember.observer(function() {
        var labelPath, path;
        labelPath = this.get('labelPath');
        path = labelPath ? "content." + labelPath : 'content';
        Ember.defineProperty(this, 'label', Ember.computed.alias(path));
        return this.notifyPropertyChange('label');
      }, 'content', 'labelPath'),
      didInsertElement: function() {
        this._super();
        return this.labelPathDidChange();
      },
      updateContext: function(context) {
        this._super(context);
        return this.set('content', context);
      },
      click: function() {
        if (this.get('content.isGroupOption')) {
          return;
        }
        this.set('controller.selection', this.get('content'));
        this.get('controller').userDidSelect(this.get('content'));
        if (this.get('controller.showDropdown')) {
          this.get('controller').send('hideDropdown');
          return false;
        }
      },
      mouseEnter: function() {
        if (this.get('content.isGroupOption')) {
          return;
        }
        return this.set('controller.highlighted', this.get('content'));
      }
    });

    __exports__["default"] = SelectOptionView;
  });
;define("ember-widgets/views/multi-select-option", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var MultiSelectOptionView;

    MultiSelectOptionView = Ember.View.extend({
      tagName: 'li',
      templateName: 'multi-select-item',
      classNames: 'ember-select-search-choice',
      labelPath: Ember.computed.alias('controller.optionLabelPath'),
      didInsertElement: function() {
        this._super();
        return this.labelPathDidChange();
      },
      labelPathDidChange: Ember.observer(function() {
        var labelPath, path;
        labelPath = this.get('labelPath');
        path = labelPath ? "context." + labelPath : 'context';
        Ember.defineProperty(this, 'label', Ember.computed.alias(path));
        return this.notifyPropertyChange('label');
      }, 'context', 'labelPath')
    });

    __exports__["default"] = MultiSelectOptionView;
  });
;define("ember-widgets/components/pill-select", 
  ["ember","ember-widgets/components/select-component","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SelectComponent = __dependency2__["default"];
    var PillSelect;

    PillSelect = SelectComponent.extend({
      templateName: 'text-editor-pill-menu',
      isSelect: true,
      showButton: true
    });

    __exports__["default"] = PillSelect;
  });
;define("ember-widgets/components/popover-component", 
  ["ember","ember-widgets/mixins/popover","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var PopoverMixin = __dependency2__["default"];
    var PopoverComponent;

    PopoverComponent = Ember.Component.extend(PopoverMixin);

    PopoverComponent.reopenClass({
      rootElement: '.ember-application',
      hideAll: function() {
        return $(document).trigger('popover:hide');
      },
      popup: function(options) {
        var popover, rootElement;
        this.hideAll();
        rootElement = options.rootElement || this.rootElement;
        popover = this.create(options);
        if (popover.get('targetObject.container')) {
          popover.set('container', popover.get('targetObject.container'));
        }
        popover.appendTo(rootElement);
        return popover;
      }
    });

    __exports__["default"] = PopoverComponent;
  });
;define("ember-widgets/mixins/popover", 
  ["ember","ember-widgets/mixins/style-bindings","ember-widgets/mixins/body-event-listener","ember-widgets/utils/css-transitions","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var StyleBindingsMixin = __dependency2__["default"];
    var BodyEventListener = __dependency3__["default"];
    var transitionend = __dependency4__["default"];
    var PopoverMixin;

    PopoverMixin = Ember.Mixin.create(StyleBindingsMixin, BodyEventListener, {
      layoutName: 'popover',
      classNames: ['popover'],
      classNameBindings: ['isShowing:in', 'fadeEnabled:fade', 'placement'],
      styleBindings: ['left', 'top', 'display', 'visibility'],
      targetElement: null,
      contentViewClass: null,
      fade: true,
      escToCancel: true,
      placement: 'top',
      display: 'block',
      visibility: 'hidden',
      debounceTime: 100,
      fadeEnabled: Ember.computed(function() {
        if (this.get('emberWidgetsConfig.DISABLE_ANIMATIONS')) {
          return false;
        }
        return this.get('fade');
      }).property('fade'),
      left: 0,
      top: 0,
      marginTop: 23,
      marginLeft: 10,
      isShowing: false,
      inserted: false,
      title: '',
      content: '',
      _resizeHandler: null,
      _scrollHandler: null,
      _contentViewClass: Ember.computed(function() {
        if (this.get('contentViewClass')) {
          return this.get('contentViewClass');
        }
        return Ember.View.extend({
          content: Ember.computed.alias('parentView.content'),
          templateName: 'view-parent-view-content'
        });
      }).property('contentViewClass'),
      didInsertElement: function() {
        this._super();
        this.snapToPosition();
        this.set('visibility', 'visible');
        return this.set('isShowing', true);
      },
      bodyClick: function() {
        return this.hide();
      },
      hide: function() {
        var _this = this;
        if (this.get('isDestroyed')) {
          return;
        }
        this.set('isShowing', false);
        if (this.get('fadeEnabled')) {
          return this.$().one(transitionend, function() {
            return Ember.run(_this, _this.destroy);
          });
        } else {
          return Ember.run(this, this.destroy);
        }
      },
      /*
      Calculate the offset of the given iframe relative to the top window.
      - Walks up the iframe chain, checking the offset of each one till it reaches
        top
      - Only works with friendly iframes.
      - Takes into account scrolling, but comes up with a result relative to
      top iframe, regardless of being visibile withing intervening frames.
      
      @param window win    the iframe we're interested in (e.g. window)
      @param object pos   an object containing the offset so far:
      { left: [x], top: [y] }
      (optional - initializes with 0,0 if undefined)
      @return pos object above
      
      via http://stackoverflow.com/a/9676655
      */

      computeFrameOffset: function(win, pos) {
        var found, frame, frames, rect, _i, _len;
        if (pos == null) {
          pos = {
            top: 0,
            left: 0
          };
        }
        frames = win.parent.document.getElementsByTagName("iframe");
        found = false;
        for (_i = 0, _len = frames.length; _i < _len; _i++) {
          frame = frames[_i];
          if (frame.contentWindow === win) {
            found = true;
            break;
          }
        }
        if (found) {
          rect = frame.getBoundingClientRect();
          pos.left += rect.left;
          pos.top += rect.top;
          if (win !== top) {
            this.computeFrameOffset(win.parent, pos);
          }
        }
        return pos;
      },
      getOffset: function($target) {
        var doc, pos, win;
        pos = $target.offset();
        doc = $target[0].ownerDocument;
        win = doc.defaultView;
        return this.computeFrameOffset(win, pos);
      },
      snapToPosition: function() {
        var $target, actualHeight, actualWidth, pos;
        $target = $(this.get('targetElement'));
        if ((this.get('_state') || this.get('state')) !== 'inDOM') {
          return;
        }
        actualWidth = this.$()[0].offsetWidth;
        actualHeight = this.$()[0].offsetHeight;
        if (Ember.isEmpty($target)) {
          pos = {
            top: this.get('top'),
            left: this.get('left'),
            width: 0,
            height: 0
          };
        } else {
          pos = this.getOffset($target);
          pos.width = $target[0].offsetWidth;
          pos.height = $target[0].offsetHeight;
        }
        switch (this.get('placement')) {
          case 'bottom':
            this.set('top', pos.top + pos.height);
            this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
            break;
          case 'top':
            this.set('top', pos.top - actualHeight);
            this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
            break;
          case 'top-right':
            this.set('top', pos.top);
            this.set('left', pos.left + pos.width);
            break;
          case 'top-left':
            this.set('top', pos.top);
            this.set('left', pos.left - actualWidth);
            break;
          case 'bottom-right':
            this.set('top', pos.top + pos.height);
            this.set('left', pos.left + pos.width - actualWidth);
            break;
          case 'bottom-left':
            this.set('top', pos.top + pos.height);
            this.set('left', pos.left);
            break;
          case 'left':
            this.set('top', pos.top - this.get('marginTop'));
            this.set('left', pos.left - actualWidth);
            break;
          case 'right':
            this.set('top', pos.top - this.get('marginTop'));
            this.set('left', pos.left + pos.width);
            break;
        }
        this.correctIfOffscreen();
        if (!Ember.isEmpty($target)) {
          return this.positionArrow();
        }
      },
      positionArrow: function() {
        var $target, arrowSize, left, pos, top;
        $target = $(this.get('targetElement'));
        pos = this.getOffset($target);
        pos.width = $target[0].offsetWidth;
        pos.height = $target[0].offsetHeight;
        arrowSize = 22;
        switch (this.get('placement')) {
          case 'left':
          case 'right':
            top = pos.top + pos.height / 2 - this.get('top') - arrowSize / 2;
            return this.set('arrowStyle', "margin-top:" + top + "px;");
          case 'top':
          case 'bottom':
            left = pos.left + pos.width / 2 - this.get('left') - arrowSize / 2;
            return this.set('arrowStyle', "margin-left:" + left + "px;");
        }
      },
      correctIfOffscreen: function() {
        var actualHeight, actualWidth, bodyHeight, bodyWidth;
        bodyWidth = $('body').width();
        bodyHeight = $('body').height();
        actualWidth = this.$()[0].offsetWidth;
        actualHeight = this.$()[0].offsetHeight;
        if (this.get('left') + actualWidth > bodyWidth) {
          this.set('left', bodyWidth - actualWidth - this.get('marginLeft'));
        }
        if (this.get('left') < 0) {
          this.set('left', this.get('marginLeft'));
        }
        if (this.get('top') + actualHeight > bodyHeight) {
          this.set('top', bodyHeight - actualHeight - this.get('marginTop'));
        }
        if (this.get('top') < 0) {
          return this.set('top', this.get('marginTop'));
        }
      },
      keyHandler: Ember.computed(function() {
        var _this = this;
        return function(event) {
          if (event.keyCode === 27 && _this.get('escToCancel')) {
            return _this.hide();
          }
        };
      }),
      debounceSnapToPosition: Ember.computed(function() {
        var _this = this;
        return function() {
          return Ember.run.debounce(_this, _this.snapToPosition, _this.get('debounceTime'));
        };
      }),
      _setupDocumentHandlers: function() {
        var _this = this;
        this._super();
        if (!this._hideHandler) {
          this._hideHandler = function() {
            return _this.hide();
          };
          $(document).on('popover:hide', this._hideHandler);
        }
        if (!this._resizeHandler) {
          this._resizeHandler = this.get('debounceSnapToPosition');
          $(document).on('resize', this._resizeHandler);
        }
        if (!this._scrollHandler) {
          this._scrollHandler = this.get('debounceSnapToPosition');
          $(document).on('scroll', this._scrollHandler);
        }
        return $(document).on('keyup', this.get('keyHandler'));
      },
      _removeDocumentHandlers: function() {
        this._super();
        $(document).off('popover:hide', this._hideHandler);
        this._hideHandler = null;
        $(document).off('resize', this._resizeHandler);
        this._resizeHandler = null;
        $(document).off('scroll', this._scrollHandler);
        this._scrollHandler = null;
        return $(document).off('keyup', this.get('keyHandler'));
      }
    });

    __exports__["default"] = PopoverMixin;
  });
;define("ember-widgets/components/popover-link-component", 
  ["ember","ember-widgets/mixins/popover","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var PopoverMixin = __dependency2__["default"];
    var PopoverLinkComponent;

    PopoverLinkComponent = Ember.Component.extend({
      classNames: ['popover-link'],
      classNameBindings: ['disabled'],
      placement: 'top',
      content: null,
      title: null,
      contentViewClass: null,
      disabled: false,
      popoverClassNames: [],
      rootElement: '.ember-application',
      fade: true,
      _contentViewClass: Ember.computed(function() {
        var contentViewClass;
        contentViewClass = this.get('contentViewClass');
        if (typeof contentViewClass === 'string') {
          return Ember.get(contentViewClass);
        }
        return contentViewClass;
      }).property('contentViewClass'),
      click: function(event) {
        var popover, popoverView;
        if (this.get('disabled')) {
          return;
        }
        popover = this.get('_popover');
        if (((popover != null ? popover.get('_state') : void 0) || (popover != null ? popover.get('state') : void 0)) === 'inDOM') {
          return popover.hide();
        } else {
          popoverView = Ember.View.extend(PopoverMixin, {
            layoutName: 'popover-link-popover',
            classNames: this.get('popoverClassNames'),
            controller: this,
            targetElement: this.get('element'),
            container: this.get('container'),
            placement: Ember.computed.alias('controller.placement'),
            title: Ember.computed.alias('controller.title'),
            contentViewClass: this.get('_contentViewClass'),
            fade: this.get('fade')
          });
          popover = popoverView.create();
          this.set('_popover', popover);
          return popover.appendTo(this.get('rootElement'));
        }
      }
    });

    __exports__["default"] = PopoverLinkComponent;
  });
;define("ember-widgets/components/radio-button-component", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RadioButtonComponent;

    RadioButtonComponent = Ember.View.extend({
      attributeBindings: ['type', 'checked', 'disabled'],
      classNames: ['radio-input'],
      tagName: 'input',
      type: 'radio',
      checked: Ember.computed.alias('parentView.checked'),
      disabled: Ember.computed.alias('parentView._disabled')
    });

    __exports__["default"] = RadioButtonComponent;
  });
;define("ember-widgets/components/radio-button-group-component", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RadioButtonGroupComponent;

    RadioButtonGroupComponent = Ember.Component.extend({
      classNames: ['ember-radio-button-group'],
      selectedValue: null,
      disabled: false
    });

    __exports__["default"] = RadioButtonGroupComponent;
  });
;define("ember-widgets/components/radio-button-wrapper", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RadioButtonWrapperComponent;

    RadioButtonWrapperComponent = Ember.Component.extend({
      layoutName: 'radio-button-layout',
      value: null,
      disabled: false,
      selectedValue: Ember.computed.alias('parentView.selectedValue'),
      classNames: ['radio-button'],
      checked: false,
      _disabled: Ember.computed.or('parentView.disabled', 'disabled'),
      selectedValueChanged: Ember.on('init', Ember.observer(function() {
        var selectedValue;
        selectedValue = this.get('selectedValue');
        if (!Ember.isEmpty(selectedValue) && this.get('value') === selectedValue) {
          return this.set('checked', true);
        } else {
          return this.set('checked', false);
        }
      }, 'selectedValue')),
      click: function(event) {
        if (this.get('_disabled')) {
          return;
        }
        this.set('checked', true);
        return this.set('selectedValue', this.get('value'));
      }
    });

    __exports__["default"] = RadioButtonWrapperComponent;
  });
;define("ember-widgets/components/radio-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RadioButtonWrapperComponent;

    RadioButtonWrapperComponent = Ember.Component.extend({
      layoutName: 'radio-button-layout',
      value: null,
      disabled: false,
      selectedValue: Ember.computed.alias('parentView.selectedValue'),
      classNames: ['radio-button'],
      checked: false,
      _disabled: Ember.computed.or('parentView.disabled', 'disabled'),
      selectedValueChanged: Ember.on('init', Ember.observer(function() {
        var selectedValue;
        selectedValue = this.get('selectedValue');
        if (!Ember.isEmpty(selectedValue) && this.get('value') === selectedValue) {
          return this.set('checked', true);
        } else {
          return this.set('checked', false);
        }
      }, 'selectedValue')),
      click: function(event) {
        if (this.get('_disabled')) {
          return;
        }
        this.set('checked', true);
        return this.set('selectedValue', this.get('value'));
      }
    });

    __exports__["default"] = RadioButtonWrapperComponent;
  });
;define("ember-widgets/components/text-editor-config-component", 
  ["ember","ember-widgets/views/select-option","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SelectOptionView = __dependency2__["default"];
    var TextEditorConfigComponent;

    TextEditorConfigComponent = Ember.Component.extend({
      layoutName: 'text-editor-config',
      classNames: Ember.A(['ember-text-editor-toolbar']),
      selectedFontName: 'Helvetica Neue',
      selectedFontSize: '2',
      selectedForeColor: 'rgb(0, 0, 0)',
      textEditor: null,
      fontNames: Ember.computed(function() {
        return Ember.A(['Arial', 'Calibri', 'Cambria', 'Consolas', 'Corsiva', 'Courier New', 'Georgia', 'Helvetica Neue', 'Helvetica', 'Sans-Serif', 'Serif', 'Syncopate', 'Times New Roman', 'Trebuchet MS', 'Verdana']);
      }),
      fontSizes: Ember.computed(function() {
        return Ember.A([
          {
            size: '1',
            name: '8'
          }, {
            size: '2',
            name: '10'
          }, {
            size: '3',
            name: '12'
          }, {
            size: '4',
            name: '14'
          }, {
            size: '5',
            name: '18'
          }, {
            size: '6',
            name: '24'
          }, {
            size: '7',
            name: '36'
          }
        ]);
      }),
      fontChooserItemViewClass: SelectOptionView.extend({
        templateName: 'font-chooser-item',
        style: Ember.computed(function() {
          return "font-family:" + (this.get('label')) + ";";
        }).property('label')
      }),
      actions: {
        applyFontSize: function(options) {
          this.get('textEditor').fontSize(options.size);
          return this.get('textEditor').getEditor().focus();
        },
        applyFontName: function(font) {
          this.get('textEditor').fontName(font);
          return this.get('textEditor').getEditor().focus();
        },
        applyForeColor: function(color) {
          this.get('textEditor').foreColor(color);
          return this.get('textEditor').getEditor().focus();
        },
        toggleBold: function() {
          this.get('textEditor').bold();
          return this.get('textEditor').getEditor().focus();
        },
        toggleItalic: function() {
          this.get('textEditor').italic();
          return this.get('textEditor').getEditor().focus();
        },
        toggleUnderline: function() {
          this.get('textEditor').underline();
          return this.get('textEditor').getEditor().focus();
        },
        justifyLeft: function() {
          this.get('textEditor').justifyLeft();
          return this.get('textEditor').getEditor().focus();
        },
        justifyCenter: function() {
          this.get('textEditor').justifyCenter();
          return this.get('textEditor').getEditor().focus();
        },
        justifyRight: function() {
          this.get('textEditor').justifyRight();
          return this.get('textEditor').getEditor().focus();
        },
        insertOrderedList: function() {
          this.get('textEditor').insertOrderedList();
          return this.get('textEditor').getEditor().focus();
        },
        insertUnorderedList: function() {
          this.get('textEditor').insertUnorderedList();
          return this.get('textEditor').getEditor().focus();
        },
        outdent: function() {
          this.get('textEditor').outdent();
          return this.get('textEditor').getEditor().focus();
        },
        indent: function() {
          this.get('textEditor').indent();
          return this.get('textEditor').getEditor().focus();
        }
      }
    });

    __exports__["default"] = TextEditorConfigComponent;
  });
;define("ember-widgets/components/text-editor-with-non-editable-component", 
  ["ember","ember-widgets/components/text-editor","ember-widgets/mixins/pill-insert","ember-widgets/controllers/todays-date-pill","ember-widgets/controllers/non-editable-text-pill","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var TextEditorComponent = __dependency2__["default"];
    var PillInsertMixin = __dependency3__["default"];
    var TodaysDatePill = __dependency4__["default"];
    var NonEditableTextPill = __dependency5__["default"];
    var TextEditorWithNonEditableComponent;

    TextEditorWithNonEditableComponent = TextEditorComponent.extend(PillInsertMixin, {
      layoutName: 'text-editor-with-non-editable',
      pillOptions: Ember.A([TodaysDatePill, NonEditableTextPill]),
      getInsertSelectController: function() {
        return this.get('pillChooserInLine');
      },
      INVISIBLE_CHAR: '\uFEFF',
      INSERT_PILL_CHAR: '=',
      insertPillRegex: Ember.computed(function() {
        return new RegExp(this.INSERT_PILL_CHAR + '[A-Za-z0-9_\+\-]*$', 'gi');
      }).property('INSERT_PILL_CHAR'),
      pillId: 0,
      mouseDownTarget: null,
      pillHideSearchBox: false,
      showConfigPopover: false,
      selectedPillOption: null,
      isTargetInEditor: function(event) {
        return !Ember.isEmpty($(event.target).closest('.' + this.EDITOR_CLASS));
      },
      getEditor: function() {
        return this.$('iframe.text-editor-frame').contents().find('.' + this.EDITOR_CLASS);
      },
      inEditor: function(range) {
        return this.$(range.endContainer).parents().has(range.startContainer).first().closest('.' + this.EDITOR_CLASS).length > 0;
      },
      _getPillFromElement: function(pillElement) {
        var data, key, params, value;
        data = $(pillElement).data();
        if (!data.type) {
          return;
        }
        params = {};
        for (key in data) {
          value = data[key];
          params[key] = value;
        }
        return Ember.get(data.type).create({
          'textEditor': this,
          'params': params
        });
      },
      _getElementFromPill: function(pill) {
        var pillId;
        pillId = pill.get('params.pillId');
        return this.getEditor().find('.non-editable[data-pill-id="' + pillId + '"]');
      },
      serialize: function() {
        var div, raw_html;
        raw_html = this.getEditor().html();
        div = $('<div/>').html(raw_html);
        $('.non-editable', div).empty();
        return div.html();
      },
      updateNonEditablePillContent: function() {
        var pill, pillElement, pillElements, _i, _len;
        pillElements = this.getEditor().find('.non-editable[data-pill-id]');
        for (_i = 0, _len = pillElements.length; _i < _len; _i++) {
          pillElement = pillElements[_i];
          pill = this._getPillFromElement(pillElement);
          if (!pill) {
            return;
          }
          $(pillElement).text(pill.result());
        }
      },
      getNewPillId: function() {
        return this.incrementProperty('pillId');
      },
      updatePill: function(pill) {
        var pillElement;
        pillElement = this._getElementFromPill(pill);
        return $(pillElement).text(pill.result());
      },
      insertPill: function(pill) {
        var factor, iframeDocument, matches, precedingCharacters, range, selection;
        iframeDocument = this.getDocument();
        precedingCharacters = this.getCharactersPrecedingCaret(this.getEditor()[0]);
        matches = precedingCharacters.match(this.get('insertPillRegex'));
        if (matches) {
          this.deleteCharactersPrecedingCaret(matches[0].length, false);
        }
        range = this.getCurrentRange();
        if (!range || !this.inEditor(range)) {
          selection = iframeDocument.getSelection();
          selection.removeAllRanges();
          range = iframeDocument.createRange();
          range.selectNodeContents(iframeDocument.body.firstChild);
          selection.addRange(range);
        }
        factor = this.insertElementAtRange(range, pill.render());
        this.getEditor().focus();
        selection = iframeDocument.getSelection();
        selection.removeAllRanges();
        range = iframeDocument.createRange();
        range.setStartAfter(factor);
        range.collapse();
        return selection.addRange(range);
      },
      configurePill: function($pill) {
        var pillClass, selectedPillOption;
        pillClass = $pill.attr('data-type');
        selectedPillOption = Ember.get(window, pillClass).create({
          textEditor: this,
          params: {
            text: $pill.text(),
            pillId: $pill.attr('data-pill-id')
          }
        });
        return selectedPillOption.configure();
      },
      _showPillConfig: function(query) {
        this.set('showConfigPopover', true);
        this.set('pillHideSearchBox', true);
        return this.set('query', query);
      },
      _hidePillConfig: function() {
        this.set('showConfigPopover', false);
        this.set('pillHideSearchBox', false);
        return this.set('query', null);
      },
      _handlePillConfig: function() {
        var matches, precedingCharacters, query;
        precedingCharacters = this.getCharactersPrecedingCaret(this.getEditor()[0]);
        matches = precedingCharacters.match(this.get('insertPillRegex'));
        if (matches) {
          query = matches[0].split(" ").reverse()[0].slice(1);
          return this._showPillConfig(query);
        } else {
          return this._hidePillConfig();
        }
      },
      keyDown: function(event) {
        var insertSelect, keyCode;
        keyCode = event.keyCode;
        if (this.showConfigPopover) {
          insertSelect = this.getInsertSelectController();
          if (keyCode === this.KEY_CODES.DOWN) {
            return insertSelect.downArrowPressed(event);
          } else if (keyCode === this.KEY_CODES.UP) {
            return insertSelect.upArrowPressed(event);
          } else if ((keyCode === this.KEY_CODES.ENTER || keyCode === this.KEY_CODES.TAB) && insertSelect.get('preparedContent').length > 0) {
            return insertSelect.enterPressed(event);
          } else if (keyCode === this.KEY_CODES.ESCAPE) {
            return insertSelect.escapePressed(event);
          }
        }
      },
      keyUp: function(event) {
        if (!this.isTargetInEditor(event)) {
          return;
        }
        if (event.keyCode !== this.KEY_CODES.ESCAPE) {
          this._handlePillConfig();
          return this._super.apply(this, arguments);
        }
      },
      click: function(event) {
        var $target;
        $target = $(event.target);
        if ($target.attr('contentEditable') === "false" && $target.hasClass('configurable')) {
          return this.configurePill($target);
        }
      }
    });

    __exports__["default"] = TextEditorWithNonEditableComponent;
  });
;define("ember-widgets/components/text-editor", 
  ["ember","ember-widgets/mixins/dom-helper","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DomHelper = __dependency2__["default"];
    var TextEditorComponent;

    TextEditorComponent = Ember.Component.extend(DomHelper, {
      layoutName: 'text-editor',
      selectedFontName: 'Helvetica Neue',
      selectedFontSize: '2',
      selectedForeColor: 'rgb(0, 0, 0)',
      isToolbarVisible: true,
      EDITOR_CLASS: 'text-editor',
      PLACEHOLDER_TEXT: 'Click to edit',
      commands: Ember.A(['bold', 'italic', 'underline', 'fontName', 'fontSize', 'foreColor', 'indent', 'outdent', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'strikeThrough']),
      iframeHeadContents: Ember.computed(function() {
        return "<style>\n  html,\n  body {\n    min-height: 0;\n    min-width: 0;\n    margin: 0;\n    background: transparent;\n    font-family: \"Helvetica Neue\";\n  }\n  ." + this.EDITOR_CLASS + " {\n  min-height: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  padding: 5px;\n}\n." + this.EDITOR_CLASS + ":focus {\n    outline: none;\n  }\n  .non-editable {\n    display: inline-block;\n    padding: 0 4px;\n    margin: 0 1px;\n    background-color: #e7e7e7;\n    list-style-type: none;\n  }\n  .configurable {\n    cursor: pointer;\n  }\n  p:first-of-type:empty:not(:focus):before {\n    content: attr(data-ph);\n    color: grey;\n    font-style: italic;\n  }\n</style>";
      }).property('EDITOR_CLASS'),
      iframeBodyContents: Ember.computed(function() {
        return '<p data-ph="' + this.PLACEHOLDER_TEXT + '"></p>';
      }).property('PLACEHOLDER_TEXT'),
      getEditor: function() {
        return this.$('iframe.text-editor-frame').contents().find('.' + this.EDITOR_CLASS);
      },
      getDocument: function() {
        var iframe;
        iframe = this.$('iframe.text-editor-frame')[0];
        return iframe.contentDocument || iframe.contentWindow.document;
      },
      selectLastElement: function() {
        var iframeDocument, range, selection;
        iframeDocument = this.getDocument();
        selection = iframeDocument.getSelection();
        selection.removeAllRanges();
        range = iframeDocument.createRange();
        if (iframeDocument.body.lastChild.innerHTML.length === 0) {
          iframeDocument.body.lastChild.innerHTML = this.INVISIBLE_CHAR;
        }
        range.selectNodeContents(iframeDocument.body.lastChild);
        return selection.addRange(range);
      },
      unselect: function() {
        var iframeDocument, selection;
        iframeDocument = this.getDocument();
        selection = iframeDocument.getSelection();
        return selection.removeAllRanges();
      },
      didInsertElement: function() {
        var $body, $head, $iframe, $iframeContents, iframe,
          _this = this;
        this._super();
        $iframe = this.$('iframe.text-editor-frame');
        $iframeContents = $iframe.contents();
        $head = $iframeContents.find('head');
        $head.append(this.get('iframeHeadContents'));
        $body = $iframeContents.find('body');
        $body.addClass(this.EDITOR_CLASS);
        $body.attr('contentEditable', true);
        $body.append(this.get('iframeBodyContents'));
        iframe = $iframe[0];
        iframe.contentWindow.onkeyup = function(event) {
          return _this.keyUp(event);
        };
        iframe.contentWindow.onkeydown = function(event) {
          return _this.keyDown(event);
        };
        iframe.contentWindow.onmouseup = function(event) {
          return _this.mouseUp(event);
        };
        iframe.contentWindow.onmousedown = function(event) {
          return _this.mouseDown(event);
        };
        iframe.contentWindow.onclick = function(event) {
          return _this.click(event);
        };
        return this.get('commands').forEach(function(command) {
          return _this.set(command, function(arg) {
            _this.getDocument().execCommand(command, true, arg);
            return _this.queryCommandState();
          });
        });
      },
      keyUp: function(event) {
        var $body, $iframe, $iframeContents, iframeDocument, range, selection;
        if (event.keyCode === this.KEY_CODES.BACKSPACE) {
          $iframe = this.$('iframe.text-editor-frame');
          $iframeContents = $iframe.contents();
          $body = $iframeContents.find('body');
          if (!$body.children().length) {
            $body.append(this.get('iframeBodyContents'));
            iframeDocument = this.getDocument();
            selection = iframeDocument.getSelection();
            selection.removeAllRanges();
            range = iframeDocument.createRange();
            range.selectNodeContents(iframeDocument.body.firstChild);
            return selection.addRange(range);
          }
        } else {
          return this.queryCommandState();
        }
      },
      mouseUp: function(event) {
        return this.queryCommandState();
      },
      queryCommandState: function() {
        var fontName, idocument;
        idocument = this.getDocument();
        this.set('isBold', idocument.queryCommandState('bold'));
        this.set('isItalic', idocument.queryCommandState('italic'));
        this.set('isUnderline', idocument.queryCommandState('underline'));
        this.set('isJustifyLeft', idocument.queryCommandState('justifyLeft'));
        this.set('isJustifyCenter', idocument.queryCommandState('justifyCenter'));
        this.set('isJustifyRight', idocument.queryCommandState('justifyRight'));
        fontName = idocument.queryCommandValue('fontName') || '';
        this.set('selectedFontName', fontName.replace(/^'/, '').replace(/'$/, ''));
        this.set('selectedFontSize', idocument.queryCommandValue('fontSize'));
        return this.set('selectedForeColor', idocument.queryCommandValue('foreColor'));
      },
      click: function(event) {
        return Ember.K;
      },
      keyDown: function(event) {
        return Ember.K;
      },
      mouseDown: function(event) {
        return Ember.K;
      }
    });

    __exports__["default"] = TextEditorComponent;
  });
;define("ember-widgets/mixins/dom-helper", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DomHelper;

    DomHelper = Ember.Mixin.create({
      KEY_CODES: {
        BACKSPACE: 8,
        DELETE: 46,
        DOWN: 40,
        ENTER: 13,
        LEFT: 37,
        RIGHT: 39,
        SPACEBAR: 32,
        TAB: 9,
        UP: 38,
        ESCAPE: 27
      },
      selectElement: function(document, element, collapseMode) {
        var range;
        if (collapseMode == null) {
          collapseMode = "end";
        }
        if (document.createRange) {
          range = document.createRange();
          range.selectNodeContents(element);
          if (collapseMode !== "none") {
            range.collapse(collapseMode === "beginning" ? true : false);
          }
          return this.activateRange(document, range);
        }
      },
      activateRange: function(document, range) {
        var selection;
        selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return range;
      },
      deleteRange: function(range, shouldDeleteContainer) {
        var endParent, startParent;
        if (shouldDeleteContainer == null) {
          shouldDeleteContainer = true;
        }
        startParent = range.startContainer.parentNode;
        endParent = range.endContainer.parentNode;
        range.deleteContents();
        if (this.isEmpty(startParent) && shouldDeleteContainer) {
          $(startParent).remove();
        }
        if (this.isEmpty(endParent) && shouldDeleteContainer) {
          return $(endParent).remove();
        }
      },
      insertHTMLAtRange: function(range, html) {
        return this.insertElementAtRange(range, this.createElementsFromString(html)[0]);
      },
      insertElementAtRange: function(range, node) {
        this.deleteRange(range, false);
        range.insertNode(node);
        return node;
      },
      getCurrentRange: function() {
        var idocument, iframe;
        iframe = this.$('iframe.text-editor-frame')[0];
        idocument = iframe.contentDocument || iframe.contentWindow.document;
        if (idocument.getSelection().rangeCount > 0) {
          return idocument.getSelection().getRangeAt(0);
        } else {
          return null;
        }
      },
      isEmpty: function(element) {
        var _ref;
        return element.children.length === 0 && element.childNodes.length <= 1 && ((_ref = element.childNodes[0]) != null ? _ref.length : void 0) === 0;
      },
      createElementsFromString: function(string) {
        return $("<div/>").html(string).contents();
      },
      convertElementsToString: function(elements) {
        return $("<div/>").html(elements).html();
      },
      extractSideNode: function(node, left) {
        return node[left ? 'previousSibling' : 'nextSibling'];
      },
      nodeIsEmpty: function(node) {
        var _ref;
        return (node != null ? (_ref = node.nodeValue) != null ? _ref.trim().length : void 0 : void 0) === 0;
      },
      notEditDiv: function(sideNode, node) {
        return this.nodeIsEmpty(sideNode) && !$(node).hasClass(this.EDITOR_CLASS);
      },
      getNonEmptySideNode: function(range, left, deep) {
        var index, node, sideNode, _ref;
        if (left == null) {
          left = true;
        }
        node = range[left ? 'startContainer' : 'endContainer'];
        while ((sideNode = this.extractSideNode(node, left)) === null || this.notEditDiv(sideNode, node)) {
          if (this.nodeIsEmpty(sideNode)) {
            node = node[left ? 'previousSibling' : 'nextSibling'];
          } else {
            node = node.parentNode;
          }
        }
        if (deep) {
          while ((sideNode != null ? (_ref = sideNode.children) != null ? _ref.length : void 0 : void 0) > 0) {
            index = left ? sideNode.children.length - 1 : 0;
            sideNode = sideNode.children[index];
          }
        }
        return sideNode;
      },
      getCharactersPrecedingCaret: function() {
        var precedingChars, range;
        range = this.getCurrentRange();
        if (range === null) {
          return "";
        }
        range.collapse(true);
        range.setStart(range.startContainer, 0);
        precedingChars = range.toString();
        return precedingChars;
      },
      deleteCharactersPrecedingCaret: function(length, shouldDeleteContainer) {
        var range;
        if (shouldDeleteContainer == null) {
          shouldDeleteContainer = true;
        }
        range = this.getCurrentRange();
        if (range === null) {
          return "";
        }
        range.collapse(true);
        range.setStart(range.startContainer, range.endOffset - length);
        return this.deleteRange(range, shouldDeleteContainer);
      },
      wrapInDiv: function(htmlElements) {
        var endSlice, isDiv, newElement, slicedElements, _results;
        isDiv = htmlElements.map(function(i, el) {
          var _ref;
          return ((_ref = el.tagName) != null ? _ref.toLowerCase() : void 0) === "div";
        });
        isDiv = isDiv.toArray();
        if (isDiv.every(function(elem) {
          return elem;
        })) {
          return;
        }
        if (htmlElements.length === 1 && htmlElements[0].className === "rangySelectionBoundary") {
          return;
        }
        _results = [];
        while (htmlElements.length > 0) {
          endSlice = isDiv.indexOf(true);
          if (endSlice === -1) {
            endSlice = isDiv.length;
          }
          if (endSlice > 0) {
            slicedElements = htmlElements.slice(0, endSlice);
            newElement = slicedElements.wrapAll('<div/>');
            slicedElements.wrapAll('<div/>').parent().replaceWith(newElement);
          } else {
            endSlice = 1;
          }
          htmlElements = htmlElements.slice(endSlice);
          _results.push(isDiv = isDiv.slice(endSlice));
        }
        return _results;
      }
    });

    __exports__["default"] = DomHelper;
  });
;define("ember-widgets/mixins/pill-insert", 
  ["ember","ember-widgets/controllers/todays-date-pill","ember-widgets/controllers/non-editable-text-pill","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var TodaysDatePill = __dependency2__["default"];
    var NonEditableTextPill = __dependency3__["default"];
    var PillInsertMixin;

    PillInsertMixin = Ember.Mixin.create({
      pillOptions: Ember.A([TodaysDatePill, NonEditableTextPill]),
      _pillOptions: Ember.computed(function() {
        return Ember.A(this.getWithDefault('pillOptions', []).map(function(option) {
          return {
            label: option.create().name,
            value: option
          };
        }));
      }).property('pillOptions'),
      actions: {
        insertPill: function(pillOption) {
          var selectedPillOption;
          selectedPillOption = pillOption.value.create({
            textEditor: this.get('textEditor') || this
          });
          selectedPillOption.configure();
          return this.set('selectedPillOption', null);
        }
      }
    });

    __exports__["default"] = PillInsertMixin;
  });
;define("ember-widgets/controllers/todays-date-pill", 
  ["ember","ember-widgets/controllers/base-non-editable-pill","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var BaseNonEditablePill = __dependency2__["default"];
    var TodaysDatePill;

    TodaysDatePill = BaseNonEditablePill.extend({
      name: "Today's Date",
      result: function() {
        return Date();
      }
    });

    __exports__["default"] = TodaysDatePill;
  });
;define("ember-widgets/controllers/base-non-editable-pill", 
  ["ember","ember-widgets/mixins/dom-helper","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DomHelper = __dependency2__["default"];
    var BaseNonEditablePill;

    BaseNonEditablePill = Ember.Controller.extend(DomHelper, {
      textEditor: null,
      params: Ember.computed(function() {
        return {};
      }),
      name: null,
      result: function() {
        return Ember.K;
      },
      configurable: false,
      configure: function() {
        return this.send('modalConfirm');
      },
      actions: {
        modalConfirm: function() {
          if (this.get('params.pillId')) {
            return this.get('textEditor').updatePill(this);
          } else {
            this.set('params.pillId', this.get('textEditor').getNewPillId());
            this.set('params.type', "" + this.constructor);
            return this.get('textEditor').insertPill(this);
          }
        },
        modalCancel: function() {
          return Ember.K;
        }
      },
      updateContent: function() {
        return $(this.get('pillElement')).text(this.result());
      },
      render: function() {
        var key, span, value, _ref;
        span = this.createElementsFromString("<span></span>");
        span.addClass('non-editable');
        if (this.get('configurable')) {
          span.addClass('configurable');
        }
        span.attr({
          'title': this.get('name')
        });
        span.attr('contentEditable', false);
        _ref = this.get('params');
        for (key in _ref) {
          value = _ref[key];
          span.attr('data-' + Ember.String.dasherize(key), value);
        }
        this.set('pillElement', span);
        this.updateContent(span);
        return span[0];
      }
    });

    __exports__["default"] = BaseNonEditablePill;
  });
;define("ember-widgets/controllers/non-editable-text-pill", 
  ["ember","ember-widgets/controllers/base-non-editable-pill","ember-widgets/components/modal-component","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var BaseNonEditablePill = __dependency2__["default"];
    var ModalComponent = __dependency3__["default"];
    var NonEditableTextPill;

    NonEditableTextPill = BaseNonEditablePill.extend({
      name: "Custom Text",
      text: Ember.computed.alias('params.text'),
      result: function() {
        return this.get('params.text');
      },
      configurable: true,
      configure: function() {
        var modal;
        return modal = ModalComponent.popup({
          content: this,
          targetObject: this,
          confirm: "modalConfirm",
          cancel: "modalCancel",
          contentViewClass: Ember.View.extend({
            templateName: 'non-editable-text-pill-configuration'
          }),
          headerText: this.get('name'),
          confirmText: "Insert"
        });
      }
    });

    __exports__["default"] = NonEditableTextPill;
  });
;define("ember-widgets/components/text-editor-with-non-editable-config-component", 
  ["ember","ember-widgets/components/text-editor-config-component","ember-widgets/mixins/pill-insert","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var TextEditorConfigComponent = __dependency2__["default"];
    var PillInsertMixin = __dependency3__["default"];
    var TextEditorWithNonEditableConfigComponent;

    TextEditorWithNonEditableConfigComponent = TextEditorConfigComponent.extend(PillInsertMixin, {
      templateName: 'text-editor-with-non-editable-config'
    });

    __exports__["default"] = TextEditorWithNonEditableConfigComponent;
  });
;define("ember-widgets/components/typeahead-component", 
  ["ember","ember-widgets/components/select-component","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SelectComponent = __dependency2__["default"];
    var TypeaheadComponent;

    TypeaheadComponent = SelectComponent.extend({
      layoutName: 'typeahead',
      searchFieldClass: 'form-control',
      disabled: false,
      searchView: Ember.TextField.extend({
        "class": 'ember-select-input',
        valueBinding: 'parentView.query',
        focusIn: function(event) {
          return this.set('parentView.showDropdown', true);
        }
      }),
      userDidSelect: function(selection) {
        this._super;
        return this.set('query', this.get('selection'));
      }
    });

    __exports__["default"] = TypeaheadComponent;
  });
;define("ember-widgets/initializers/ember-widgets-config", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EmberWidgetsConfigInitializer;

    EmberWidgetsConfigInitializer = Ember.Object.create({
      name: 'ember-widgets-config',
      initialize: function(container, application) {
        var config;
        config = {
          DISABLE_ANIMATIONS: false
        };
        application.register('_ember-widgets:config', config, {
          instantiate: false
        });
        return application.inject('component', 'emberWidgetsConfig', '_ember-widgets:config');
      }
    });

    __exports__["default"] = EmberWidgetsConfigInitializer;
  });
;define("ember-widgets/templates/accordion-group-layout", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<div class=\"panel-heading\">\n  <h4 class=\"panel-title\">\n    <a class=\"accordion-toggle collapsed\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "view.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </a>\n  </h4>\n</div>\n<div class=\"panel-collapse collapse\">\n  <div class=\"panel-body\">");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/carousel", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.CollectionView", {hash:{
        'tagName': ("ol"),
        'class': ("carousel-indicators"),
        'contentBinding': ("view.content"),
        'itemViewClass': ("itemViewClass")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'contentBinding': "STRING",'itemViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'contentBinding': depth0,'itemViewClass': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n<div class=\"carousel-inner\">\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n<a class=\"left carousel-control\"  href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "prev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">‹</a>\n<a class=\"right carousel-control\" href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "next", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">›</a>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/color-picker", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("selectedColor"),
        'classNames': ("color-picker-cell-transparent")
      },hashTypes:{'colorBinding': "STRING",'classNames': "STRING"},hashContexts:{'colorBinding': depth0,'classNames': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("selectedColor")
      },hashTypes:{'colorBinding': "STRING"},hashContexts:{'colorBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <div class=\"color-row clearfix\">\n        ");
      stack1 = helpers.each.call(depth0, "color", "in", "row", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n      <hr>\n    ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n          ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("color")
      },hashTypes:{'colorBinding': "STRING"},hashContexts:{'colorBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n        ");
      return buffer;
      }

      data.buffer.push("<div class=\"dropdown\">\n  <a class=\"clearfix color-picker-dropdown-button\" data-toggle=\"dropdown\" href=\"#\">\n    ");
      stack1 = helpers['if'].call(depth0, "isColorTransparent", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <span class=\"pull-right fa fa-caret-down color-picker-dropdown-caret\"></span>\n  </a>\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":dropdown-menu :color-picker-dropdown dropdownClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    role=\"menu\" aria-labelledby=\"dLabel\">\n    ");
      stack1 = helpers.each.call(depth0, "row", "in", "colorRows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <form ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":color-picker-custom-form isCustomColorValid:valid:invalid")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n      <div class=\"form-group form-group-sm\">\n        <div class=\"input-group\">\n          <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":input-group-addon\n            :color-picker-custom-preview isCustomColor:active"),
        'style': ("customColorCSS")
      },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></span>\n          ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
        'valueBinding': ("customColor"),
        'class': ("form-control input-sm"),
        'type': ("text"),
        'placeholder': ("HEX code")
      },hashTypes:{'valueBinding': "STRING",'class': "STRING",'type': "STRING",'placeholder': "STRING"},hashContexts:{'valueBinding': depth0,'class': depth0,'type': depth0,'placeholder': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/component-default-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<p>");
      stack1 = helpers._triageMustache.call(depth0, "content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/color-picker-cell", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<div class=\"no-color-indicator-holder\"></div>");
      
    });
  });
;define("ember-widgets/templates/components/color-picker", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("selectedColor"),
        'classNames': ("color-picker-cell-transparent")
      },hashTypes:{'colorBinding': "STRING",'classNames': "STRING"},hashContexts:{'colorBinding': depth0,'classNames': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("selectedColor")
      },hashTypes:{'colorBinding': "STRING"},hashContexts:{'colorBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <div class=\"color-row clearfix\">\n        ");
      stack1 = helpers.each.call(depth0, "color", "in", "row", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n      <hr>\n    ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n          ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
        'colorBinding': ("color")
      },hashTypes:{'colorBinding': "STRING"},hashContexts:{'colorBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
      data.buffer.push("\n        ");
      return buffer;
      }

      data.buffer.push("<div class=\"dropdown\">\n  <a class=\"clearfix color-picker-dropdown-button\" data-toggle=\"dropdown\" href=\"#\">\n    ");
      stack1 = helpers['if'].call(depth0, "isColorTransparent", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <span class=\"pull-right fa fa-caret-down color-picker-dropdown-caret\"></span>\n  </a>\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":dropdown-menu :color-picker-dropdown dropdownClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    role=\"menu\" aria-labelledby=\"dLabel\">\n    ");
      stack1 = helpers.each.call(depth0, "row", "in", "colorRows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <form ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":color-picker-custom-form isCustomColorValid:valid:invalid")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n      <div class=\"form-group form-group-sm\">\n        <div class=\"input-group\">\n          <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":input-group-addon\n            :color-picker-custom-preview isCustomColor:active"),
        'style': ("customColorCSS")
      },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></span>\n          ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
        'valueBinding': ("customColor"),
        'class': ("form-control input-sm"),
        'type': ("text"),
        'placeholder': ("HEX code")
      },hashTypes:{'valueBinding': "STRING",'class': "STRING",'type': "STRING",'placeholder': "STRING"},hashContexts:{'valueBinding': depth0,'class': depth0,'type': depth0,'placeholder': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/editable-label", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.innerTextField", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <span ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "editLabel", {hash:{
        'target': ("view")
      },hashTypes:{'target': "STRING"},hashContexts:{'target': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "view.displayName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "view.isEditing", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/font-chooser-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'style': ("view.style")
      },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":modal-dialog sizeClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  <div class=\"modal-content\">\n    <div class=\"modal-body\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/multi-select-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div>");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n<a class=\"ember-select-search-choice-close\" href=\"#\"\n  ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeSelectItem", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">×\n</a>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/multi-select", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"ember-select-container ember-select-multi dropdown-toggle js-dropdown-toggle\">\n  <ul ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":form-control :ember-select-choices choicesFieldClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      data.buffer.push(escapeExpression(helpers.each.call(depth0, "selections", {hash:{
        'itemViewClass': ("view.selectionItemView")
      },hashTypes:{'itemViewClass': "STRING"},hashContexts:{'itemViewClass': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    <li class=\"ember-select-search-field\">\n      \n      <span class=\"invisible-placeholder\">");
      stack1 = helpers._triageMustache.call(depth0, "invisiblePlaceholderText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </li>\n  </ul>\n</div>\n\n<div class=\"dropdown-menu js-dropdown-menu\">\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-select-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/non-editable-text-pill-configuration", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'valueBinding': ("content.text"),
        'placeholder': ("Enter custom text"),
        'class': ("form-control")
      },hashTypes:{'valueBinding': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'valueBinding': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/popover", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <h4 class=\"popover-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n");
      return buffer;
      }

      data.buffer.push("<div class=\"arrow\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'style': ("arrowStyle")
      },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></div>\n");
      stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"popover-content\">\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/select-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'title': ("view.label")
      },hashTypes:{'title': "ID"},hashContexts:{'title': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </span>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "controller.titleOnOptions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/select", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectedItemView", {hash:{
        'contentBinding': ("selection")
      },hashTypes:{'contentBinding': "STRING"},hashContexts:{'contentBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span>");
      stack1 = helpers._triageMustache.call(depth0, "prompt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    <div class=\"ember-select-search\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n  ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-select-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    ");
      stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program8(depth0,data) {
      
      
      data.buffer.push("\n      <span class=\"ember-select-loading\">Loading...</span>\n    ");
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n    ");
      return buffer;
      }

    function program12(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"ember-select-container dropdown-toggle js-dropdown-toggle\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <a ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":form-control :ember-select-choice buttonClass disabled:disabled")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers['if'].call(depth0, "selection", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </a>\n</div>\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":dropdown-menu :js-dropdown-menu dropdownMenuClass\n  isDropdownMenuPulledRight:pull-right")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers.unless.call(depth0, "isSelect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "showDropdown", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/text-editor-config", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
        'content': ("fontNames"),
        'placeholder': ("Select a Font"),
        'selection': ("textEditor.selectedFontName"),
        'class': ("ember-text-editor-font-family-select js-ember-text-editor-font-family-select"),
        'isSelect': ("true"),
        'buttonClass': ("btn btn-default btn-sm btn-form text-left"),
        'itemViewClass': ("fontChooserItemViewClass"),
        'userSelected': ("applyFontName")
      },hashTypes:{'content': "ID",'placeholder': "STRING",'selection': "ID",'class': "STRING",'isSelect': "STRING",'buttonClass': "STRING",'itemViewClass': "ID",'userSelected': "STRING"},hashContexts:{'content': depth0,'placeholder': depth0,'selection': depth0,'class': depth0,'isSelect': depth0,'buttonClass': depth0,'itemViewClass': depth0,'userSelected': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
        'content': ("fontSizes"),
        'placeholder': ("Select Font Size"),
        'optionLabelPath': ("name"),
        'optionValuePath': ("size"),
        'value': ("textEditor.selectedFontSize"),
        'sortLabels': (false),
        'class': ("ember-text-editor-font-size-select"),
        'isSelect': ("true"),
        'buttonClass': ("btn btn-default btn-sm"),
        'userSelected': ("applyFontSize")
      },hashTypes:{'content': "ID",'placeholder': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'sortLabels': "BOOLEAN",'class': "STRING",'isSelect': "STRING",'buttonClass': "STRING",'userSelected': "STRING"},hashContexts:{'content': depth0,'placeholder': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'sortLabels': depth0,'class': depth0,'isSelect': depth0,'buttonClass': depth0,'userSelected': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Widgets.ColorPicker", {hash:{
        'selectedColor': ("textEditor.selectedForeColor"),
        'class': ("btn btn-default btn-sm"),
        'userSelected': ("applyForeColor")
      },hashTypes:{'selectedColor': "ID",'class': "STRING",'userSelected': "STRING"},hashContexts:{'selectedColor': depth0,'class': depth0,'userSelected': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n\n<div class=\"btn-group\">\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isBold:active :js-btn-bold")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleBold", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-bold\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isItalic:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleItalic", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-italic\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isUnderline:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleUnderline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-underline\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyLeft:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyLeft", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-left\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyCenter:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyCenter", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-center\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyRight:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyRight", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-right\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "insertOrderedList", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-list-ol\"></i>\n  </button>\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "insertUnorderedList", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-list-ul\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "outdent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-outdent\"></i>\n  </button>\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "indent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-indent\"></i>\n  </button>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/text-editor-pill-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"ember-select-container dropdown-toggle\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <a ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":ember-select-choice buttonClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers['if'].call(depth0, "selection", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </a>\n</div>\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectedItemView", {hash:{
        'contentBinding': ("selection")
      },hashTypes:{'contentBinding': "STRING"},hashContexts:{'contentBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span>");
      stack1 = helpers._triageMustache.call(depth0, "prompt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    <div class=\"ember-select-search\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n  ");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n  ");
      return buffer;
      }

    function program10(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "showButton", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":dropdown-menu dropdownMenuClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers.unless.call(depth0, "isSelect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-select-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/text-editor-with-non-editable-config", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
        'content': ("fontNames"),
        'placeholder': ("Select a Font"),
        'selection': ("textEditor.selectedFontName"),
        'class': ("ember-text-editor-font-family-select js-ember-text-editor-font-family-select"),
        'isSelect': ("true"),
        'buttonClass': ("btn btn-default btn-sm btn-form text-left"),
        'itemViewClass': ("fontChooserItemViewClass"),
        'userSelected': ("applyFontName")
      },hashTypes:{'content': "ID",'placeholder': "STRING",'selection': "ID",'class': "STRING",'isSelect': "STRING",'buttonClass': "STRING",'itemViewClass': "ID",'userSelected': "STRING"},hashContexts:{'content': depth0,'placeholder': depth0,'selection': depth0,'class': depth0,'isSelect': depth0,'buttonClass': depth0,'itemViewClass': depth0,'userSelected': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
      data.buffer.push("\n\n\n\n\n\n");
      data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
        'content': ("fontSizes"),
        'placeholder': ("Select Font Size"),
        'optionLabelPath': ("name"),
        'optionValuePath': ("size"),
        'value': ("textEditor.selectedFontSize"),
        'sortLabels': (false),
        'class': ("ember-text-editor-font-size-select"),
        'isSelect': ("true"),
        'buttonClass': ("btn btn-default btn-sm"),
        'userSelected': ("applyFontSize")
      },hashTypes:{'content': "ID",'placeholder': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'sortLabels': "BOOLEAN",'class': "STRING",'isSelect': "STRING",'buttonClass': "STRING",'userSelected': "STRING"},hashContexts:{'content': depth0,'placeholder': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'sortLabels': depth0,'class': depth0,'isSelect': depth0,'buttonClass': depth0,'userSelected': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Widgets.ColorPicker", {hash:{
        'selectedColor': ("textEditor.selectedForeColor"),
        'class': ("btn btn-default btn-sm"),
        'userSelected': ("applyForeColor")
      },hashTypes:{'selectedColor': "ID",'class': "STRING",'userSelected': "STRING"},hashContexts:{'selectedColor': depth0,'class': depth0,'userSelected': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n\n<div class=\"btn-group\">\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isBold:active :js-btn-bold")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleBold", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-bold\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isItalic:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleItalic", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-italic\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isUnderline:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleUnderline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-underline\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyLeft:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyLeft", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-left\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyCenter:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyCenter", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-center\"></i>\n  </button>\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-default :btn-sm textEditor.isJustifyRight:active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "justifyRight", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-align-right\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "insertOrderedList", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-list-ol\"></i>\n  </button>\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "insertUnorderedList", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-list-ul\"></i>\n  </button>\n</div>\n\n<div class=\"btn-group\">\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "outdent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-outdent\"></i>\n  </button>\n  <button type=\"button\" class=\"btn btn-default btn-sm\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "indent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-indent\"></i>\n  </button>\n</div>\n\n");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Widgets.PillSelect", {hash:{
        'class': ("insert-non-editable-btn"),
        'isSelect': ("pillHideSearchBox"),
        'query': ("query"),
        'showDropdown': ("showConfigPopover"),
        'content': ("_pillOptions"),
        'optionLabelPath': ("label"),
        'optionValuePath': ("value"),
        'prompt': ("Insert Non-Editable"),
        'selection': ("selectedPillOption"),
        'buttonClass': ("btn btn-default btn-sm"),
        'viewName': ("pillChooser"),
        'userSelected': ("insertPill")
      },hashTypes:{'class': "STRING",'isSelect': "ID",'query': "ID",'showDropdown': "ID",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selection': "ID",'buttonClass': "STRING",'viewName': "STRING",'userSelected': "STRING"},hashContexts:{'class': depth0,'isSelect': depth0,'query': depth0,'showDropdown': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selection': depth0,'buttonClass': depth0,'viewName': depth0,'userSelected': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/text-editor-with-non-editable", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<iframe class=\"text-editor-frame\" src=\"about:blank\">\n</iframe>\n\n");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Widgets.PillSelect", {hash:{
        'class': ("insert-non-editable-btn"),
        'isSelect': ("pillHideSearchBox"),
        'query': ("query"),
        'showDropdown': ("showConfigPopover"),
        'content': ("_pillOptions"),
        'optionLabelPath': ("label"),
        'optionValuePath': ("value"),
        'prompt': ("Insert Non-Editable"),
        'selection': ("selectedPillOption"),
        'buttonClass': ("btn btn-default btn-sm"),
        'viewName': ("pillChooserInLine"),
        'userSelected': ("insertPill"),
        'showButton': (false)
      },hashTypes:{'class': "STRING",'isSelect': "ID",'query': "ID",'showDropdown': "ID",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selection': "ID",'buttonClass': "STRING",'viewName': "STRING",'userSelected': "STRING",'showButton': "BOOLEAN"},hashContexts:{'class': depth0,'isSelect': depth0,'query': depth0,'showDropdown': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selection': depth0,'buttonClass': depth0,'viewName': depth0,'userSelected': depth0,'showButton': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/components/text-editor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<iframe class=\"text-editor-frame\" src=\"about:blank\">\n</iframe>\n");
      
    });
  });
;define("ember-widgets/templates/components/typeahead", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <div class=\"dropdown-menu\">\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-typeahead-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  </div>\n");
      return buffer;
      }

      data.buffer.push("<div>\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{
        'classBinding': ("searchFieldClass"),
        'disabled': ("disabled")
      },hashTypes:{'classBinding': "STRING",'disabled': "ID"},hashContexts:{'classBinding': depth0,'disabled': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n</div>\n");
      stack1 = helpers.unless.call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/license", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("\n");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
      data.buffer.push("\n\n\n<div class=\"hero-container small-hero-container\">\n  <div class=\"hero widgets-hero\">\n    <div class=\"hero-overlay\"></div>\n  </div>\n</div>\n\n\n<div class=\"section\">\n  <div class=\"container main-content-container\">\n    <div class=\"row\">\n      <div class=\"col-md-6 col-md-offset-3 section-title\">\n        <h1>Code &amp; Documentation Licensing</h1>\n      </div>\n      <div class=\"col-md-6 col-md-offset-3\">\n        <p>The majority of open source software exclusively developed by Addepar is licensed under the liberal terms of the Apache License, Version 2.0. The documentation is generally available under the Creative Commons Attribution 3.0 Unported License. In the end, you are free to use, modify and distribute any documentation, source code or examples within our open source projects as long as you adhere to the licensing conditions present within the projects.</p>\n        <p>Also note that our engineers like to hack on their own open source projects in their free time. For code provided by our engineers outside of our official repositories on GitHub, Addepar does not grant any type of license, whether express or implied, to such code.</p>\n     </div>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/modal-footer", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <button type=\"button\"\n    ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":btn :btn-primary :btn-confirm isValid::disabled")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendConfirm", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "confirmText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </button>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <button type=\"button\" class=\"btn btn-default btn-cancel\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendCancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "cancelText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </button>\n");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <button type=\"button\" class=\"btn btn-default btn-close\"\n    ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "closeText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </button>\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "confirmText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "cancelText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "closeText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":modal-dialog sizeClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_headerViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n    <div class=\"modal-body\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n    <div class=\"modal-footer\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_footerViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/modal_header", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<button type=\"button\" class=\"close\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">&times;</button>\n<h4 class=\"modal-title\">");
      stack1 = helpers._triageMustache.call(depth0, "headerText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/multi-select-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div>");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n<a class=\"ember-select-search-choice-close\" href=\"#\"\n  ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeSelectItem", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">×\n</a>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/multi-select", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"ember-select-container ember-select-multi dropdown-toggle js-dropdown-toggle\">\n  <ul ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":form-control :ember-select-choices choicesFieldClass")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      data.buffer.push(escapeExpression(helpers.each.call(depth0, "selections", {hash:{
        'itemViewClass': ("view.selectionItemView")
      },hashTypes:{'itemViewClass': "STRING"},hashContexts:{'itemViewClass': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    <li class=\"ember-select-search-field\">\n      \n      <span class=\"invisible-placeholder\">");
      stack1 = helpers._triageMustache.call(depth0, "invisiblePlaceholderText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </li>\n  </ul>\n</div>\n\n<div class=\"dropdown-menu js-dropdown-menu\">\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-select-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/popover-link-popover", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <h4 class=\"popover-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n");
      return buffer;
      }

      data.buffer.push("<div class=\"arrow\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'style': ("view.arrowStyle")
      },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></div>\n");
      stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"popover-content\">\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/popover", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <h4 class=\"popover-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n");
      return buffer;
      }

      data.buffer.push("<div class=\"arrow\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'style': ("arrowStyle")
      },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></div>\n");
      stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"popover-content\">\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/radio-button-layout", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "radio-button-component", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/select-item-layout", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "view.content.isGroupOption", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/select-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'title': ("view.label")
      },hashTypes:{'title': "ID"},hashContexts:{'title': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </span>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "controller.titleOnOptions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/select", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectedItemView", {hash:{
        'contentBinding': ("selection")
      },hashTypes:{'contentBinding': "STRING"},hashContexts:{'contentBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span>");
      stack1 = helpers._triageMustache.call(depth0, "prompt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("view.dropdownToggleIcon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    <div class=\"ember-select-search\">\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n  ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
        'tagName': ("ul"),
        'classNames': ("ember-select-results"),
        'heightBinding': ("dropdownHeight"),
        'rowHeightBinding': ("rowHeight"),
        'contentBinding': ("groupedContent"),
        'itemViewClassBinding': ("itemView")
      },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    ");
      stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program8(depth0,data) {
      
      
      data.buffer.push("\n      <span class=\"ember-select-loading\">Loading...</span>\n    ");
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n    ");
      return buffer;
      }

    function program12(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"ember-select-container dropdown-toggle js-dropdown-toggle\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <a ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":form-control :ember-select-choice buttonClass disabled:disabled")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers['if'].call(depth0, "selection", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </a>\n</div>\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":dropdown-menu :js-dropdown-menu dropdownMenuClass\n  isDropdownMenuPulledRight:pull-right")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers.unless.call(depth0, "isSelect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "showDropdown", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
;define("ember-widgets/templates/view-parent-view-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "view.parentView.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.Ember.Widgets = Ember.Namespace.create();
window.Ember.AddeparMixins = {};
window.Ember.TEMPLATES['accordion-group-layout'] = require('ember-widgets/templates/accordion-group-layout')['default'];
window.Ember.TEMPLATES['carousel'] = require('ember-widgets/templates/carousel')['default'];
window.Ember.TEMPLATES['color-picker'] = require('ember-widgets/templates/color-picker')['default'];
window.Ember.TEMPLATES['component-default-content'] = require('ember-widgets/templates/component-default-content')['default'];
window.Ember.TEMPLATES['components/color-picker-cell'] = require('ember-widgets/templates/components/color-picker-cell')['default'];
window.Ember.TEMPLATES['components/color-picker'] = require('ember-widgets/templates/components/color-picker')['default'];
window.Ember.TEMPLATES['components/editable-label'] = require('ember-widgets/templates/components/editable-label')['default'];
window.Ember.TEMPLATES['components/font-chooser-item'] = require('ember-widgets/templates/components/font-chooser-item')['default'];
window.Ember.TEMPLATES['components/modal'] = require('ember-widgets/templates/components/modal')['default'];
window.Ember.TEMPLATES['components/multi-select-item'] = require('ember-widgets/templates/components/multi-select-item')['default'];
window.Ember.TEMPLATES['components/multi-select'] = require('ember-widgets/templates/components/multi-select')['default'];
window.Ember.TEMPLATES['components/non-editable-text-pill-configuration'] = require('ember-widgets/templates/components/non-editable-text-pill-configuration')['default'];
window.Ember.TEMPLATES['components/popover'] = require('ember-widgets/templates/components/popover')['default'];
window.Ember.TEMPLATES['components/select-item'] = require('ember-widgets/templates/components/select-item')['default'];
window.Ember.TEMPLATES['components/select'] = require('ember-widgets/templates/components/select')['default'];
window.Ember.TEMPLATES['components/text-editor-config'] = require('ember-widgets/templates/components/text-editor-config')['default'];
window.Ember.TEMPLATES['components/text-editor-pill-menu'] = require('ember-widgets/templates/components/text-editor-pill-menu')['default'];
window.Ember.TEMPLATES['components/text-editor-with-non-editable-config'] = require('ember-widgets/templates/components/text-editor-with-non-editable-config')['default'];
window.Ember.TEMPLATES['components/text-editor-with-non-editable'] = require('ember-widgets/templates/components/text-editor-with-non-editable')['default'];
window.Ember.TEMPLATES['components/text-editor'] = require('ember-widgets/templates/components/text-editor')['default'];
window.Ember.TEMPLATES['components/typeahead'] = require('ember-widgets/templates/components/typeahead')['default'];
window.Ember.TEMPLATES['license'] = require('ember-widgets/templates/license')['default'];
window.Ember.TEMPLATES['modal-footer'] = require('ember-widgets/templates/modal-footer')['default'];
window.Ember.TEMPLATES['modal'] = require('ember-widgets/templates/modal')['default'];
window.Ember.TEMPLATES['modal_header'] = require('ember-widgets/templates/modal_header')['default'];
window.Ember.TEMPLATES['multi-select-item'] = require('ember-widgets/templates/multi-select-item')['default'];
window.Ember.TEMPLATES['multi-select'] = require('ember-widgets/templates/multi-select')['default'];
window.Ember.TEMPLATES['popover-link-popover'] = require('ember-widgets/templates/popover-link-popover')['default'];
window.Ember.TEMPLATES['popover'] = require('ember-widgets/templates/popover')['default'];
window.Ember.TEMPLATES['radio-button-layout'] = require('ember-widgets/templates/radio-button-layout')['default'];
window.Ember.TEMPLATES['select-item-layout'] = require('ember-widgets/templates/select-item-layout')['default'];
window.Ember.TEMPLATES['select-item'] = require('ember-widgets/templates/select-item')['default'];
window.Ember.TEMPLATES['select'] = require('ember-widgets/templates/select')['default'];
window.Ember.TEMPLATES['view-parent-view-content'] = require('ember-widgets/templates/view-parent-view-content')['default'];
window.Ember.Widgets.AccordionComponent = require('ember-widgets/components/accordion-component')['default'];
window.Ember.Widgets.AccordionItem = require('ember-widgets/components/accordion-item')['default'];
window.Ember.Widgets.CarouselComponent = require('ember-widgets/components/carousel-component')['default'];
window.Ember.Widgets.CarouselIndicator = require('ember-widgets/components/carousel-indicator')['default'];
window.Ember.Widgets.CarouselItem = require('ember-widgets/components/carousel-item')['default'];
window.Ember.Widgets.ColorPicker = require('ember-widgets/components/color-picker')['default'];
window.Ember.Widgets.ColorPickerCell = require('ember-widgets/components/color-picker-cell')['default'];
window.Ember.Widgets.EditableLabel = require('ember-widgets/components/editable-label-component')['default'];
window.Ember.Widgets.ModalComponent = require('ember-widgets/components/modal-component')['default'];
window.Ember.Widgets.MultiSelectComponent = require('ember-widgets/components/multi-select-component')['default'];
window.Ember.Widgets.PopoverComponent = require('ember-widgets/components/popover-component')['default'];
window.Ember.Widgets.PopoverLinkComponent = require('ember-widgets/components/popover-link-component')['default'];
window.Ember.Widgets.RadioButtonComponent = require('ember-widgets/components/radio-button-component')['default'];
window.Ember.Widgets.RadioButtonGroupComponent = require('ember-widgets/components/radio-button-group-component')['default'];
window.Ember.Widgets.RadioButtonWrapperComponent = require('ember-widgets/components/radio-button-wrapper-component')['default'];
window.Ember.Widgets.SelectComponent = require('ember-widgets/components/select-component')['default'];
window.Ember.Widgets.TypeaheadComponent = require('ember-widgets/components/typeahead-component')['default'];
window.Ember.Widgets.StyleBindingsMixin = require('ember-widgets/mixins/style-bindings')['default'];
window.Ember.Widgets.BodyEventListener = require('ember-widgets/mixins/body-event-listener')['default'];
window.Ember.Widgets.PopoverMixin = require('ember-widgets/mixins/popover')['default'];
window.Ember.AddeparMixins.ResizeHandlerMixin = require('ember-widgets/mixins/resize-handler')['default'];
window.Ember.Widgets.MultiSelectOptionView = require('ember-widgets/views/multi-select-option')['default'];
window.Ember.Widgets.SelectOptionView = require('ember-widgets/views/select-option')['default'];
Ember.onLoad('Ember.Application', function(Application) {
Application.initializer({
name: 'ember-widgets',
initialize: function(container) {
container.register('component:accordion-component', require('ember-widgets/components/accordion-component')['default']);
container.register('component:accordion-item', require('ember-widgets/components/accordion-item')['default']);
container.register('component:carousel-component', require('ember-widgets/components/carousel-component')['default']);
container.register('component:carousel-indicator', require('ember-widgets/components/carousel-indicator')['default']);
container.register('component:carousel-item', require('ember-widgets/components/carousel-item')['default']);
container.register('component:color-picker', require('ember-widgets/components/color-picker')['default']);
container.register('component:color-picker-cell', require('ember-widgets/components/color-picker-cell')['default']);
container.register('component:editable-label-component', require('ember-widgets/components/editable-label-component')['default']);
container.register('component:modal-component', require('ember-widgets/components/modal-component')['default']);
container.register('component:multi-select-component', require('ember-widgets/components/multi-select-component')['default']);
container.register('component:popover-component', require('ember-widgets/components/popover-component')['default']);
container.register('component:popover-link-component', require('ember-widgets/components/popover-link-component')['default']);
container.register('component:radio-button-component', require('ember-widgets/components/radio-button-component')['default']);
container.register('component:radio-button-group-component', require('ember-widgets/components/radio-button-group-component')['default']);
container.register('component:radio-button-wrapper-component', require('ember-widgets/components/radio-button-wrapper-component')['default']);
container.register('component:select-component', require('ember-widgets/components/select-component')['default']);
container.register('component:typeahead-component', require('ember-widgets/components/typeahead-component')['default']);
container.register('view:multi-select-option', require('ember-widgets/views/multi-select-option')['default']);
container.register('view:select-option', require('ember-widgets/views/select-option')['default']);
}
});
});})();