define("dummy/app", 
  ["ember","ember/resolver","ember/load-initializers","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];
    var App;

    Ember.MODEL_FACTORY_INJECTIONS = true;

    App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("dummy/components/accordion-component", 
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
define("dummy/components/accordion-item", 
  ["ember","dummy/utils/css-transitions","exports"],
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
define("dummy/components/carousel-component", 
  ["ember","dummy/utils/css-transitions","dummy/components/carousel-indicator","exports"],
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
        var $active, $next, direction;
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
        return this._onTransitionEnd($next, (function(_this) {
          return function() {
            return Ember.run(_this, function() {
              this.set('activeIndex', nextIndex);
              $next.removeClass([type, direction].join(' ')).addClass('active');
              $active.removeClass(['active', direction].join(' '));
              return this.set('sliding', false);
            });
          };
        })(this));
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
define("dummy/components/carousel-indicator", 
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
define("dummy/components/carousel-item", 
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
define("dummy/components/color-picker-cell", 
  ["ember","dummy/utils/color-utils","dummy/mixins/style-bindings","exports"],
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
define("dummy/components/color-picker", 
  ["ember","dummy/utils/color-utils","exports"],
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
define("dummy/components/editable-label-component", 
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
define("dummy/components/modal-component", 
  ["ember","dummy/mixins/style-bindings","dummy/utils/css-transitions","exports"],
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
        return (function(_this) {
          return function(event) {
            if (event.which === 27 && _this.get('escToCancel')) {
              return _this.send('sendCancel');
            }
          };
        })(this);
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
        this.set('isShowing', false);
        $(document.body).removeClass('modal-open');
        if (this._backdrop) {
          this._backdrop.removeClass('in');
        }
        if (this.get('fadeEnabled')) {
          return this.$().one(transitionend, (function(_this) {
            return function() {
              return Ember.run(_this, _this.destroy);
            };
          })(this));
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
        this._super();
        if (!this._hideHandler) {
          this._hideHandler = (function(_this) {
            return function() {
              return _this.hide();
            };
          })(this);
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
define("dummy/components/multi-select-component", 
  ["ember","dummy/components/select-component","dummy/views/multi-select-option","exports"],
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
define("dummy/components/pill-select", 
  ["ember","dummy/components/select-component","exports"],
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
define("dummy/components/popover-component", 
  ["ember","dummy/mixins/popover","exports"],
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
define("dummy/components/popover-link-component", 
  ["ember","dummy/mixins/popover","exports"],
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
define("dummy/components/radio-button-component", 
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
define("dummy/components/radio-button-group-component", 
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
define("dummy/components/radio-button-wrapper", 
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
define("dummy/components/radio-button", 
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
define("dummy/components/select-component", 
  ["ember","dummy/mixins/body-event-listener","dummy/mixins/resize-handler","dummy/views/select-option","exports"],
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
        var ContentProxy, matcher, optionLabelPath, query;
        matcher = (function(_this) {
          return function(searchText, item) {
            return _this.matcher(searchText, item);
          };
        })(this);
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
       * SELECTION RELATED
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
define("dummy/components/text-editor-config-component", 
  ["ember","dummy/views/select-option","exports"],
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
define("dummy/components/text-editor-with-non-editable-component", 
  ["ember","dummy/components/text-editor","dummy/mixins/pill-insert","dummy/controllers/todays-date-pill","dummy/controllers/non-editable-text-pill","exports"],
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
define("dummy/components/text-editor-with-noneditable-config-component", 
  ["ember","dummy/components/text-editor-config-component","dummy/mixins/pill-insert","exports"],
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
define("dummy/components/text-editor", 
  ["ember","dummy/mixins/dom-helper","exports"],
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
      unselect: function() {
        var iframeDocument, selection;
        iframeDocument = this.getDocument();
        selection = iframeDocument.getSelection();
        return selection.removeAllRanges();
      },
      didInsertElement: function() {
        var $body, $head, $iframe, $iframeContents, iframe;
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
        iframe.contentWindow.onkeyup = (function(_this) {
          return function(event) {
            return _this.keyUp(event);
          };
        })(this);
        iframe.contentWindow.onkeydown = (function(_this) {
          return function(event) {
            return _this.keyDown(event);
          };
        })(this);
        iframe.contentWindow.onmouseup = (function(_this) {
          return function(event) {
            return _this.mouseUp(event);
          };
        })(this);
        iframe.contentWindow.onmousedown = (function(_this) {
          return function(event) {
            return _this.mouseDown(event);
          };
        })(this);
        iframe.contentWindow.onclick = (function(_this) {
          return function(event) {
            return _this.click(event);
          };
        })(this);
        return this.get('commands').forEach((function(_this) {
          return function(command) {
            return _this.set(command, function(arg) {
              _this.getDocument().execCommand(command, true, arg);
              return _this.queryCommandState();
            });
          };
        })(this));
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
define("dummy/components/typeahead-component", 
  ["ember","dummy/components/select-component","exports"],
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
define("dummy/controllers/base-non-editable-pill", 
  ["ember","dummy/mixins/dom-helper","exports"],
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
define("dummy/controllers/ember-widgets/popover", 
  ["ember","dummy/views/custom-popover-content","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CustomPopoverContentView = __dependency2__["default"];
    var EmberWidgetsPopoverController;

    EmberWidgetsPopoverController = Ember.Controller.extend({
      customContentView: CustomPopoverContentView
    });

    __exports__["default"] = EmberWidgetsPopoverController;
  });
define("dummy/controllers/non-editable-text-pill", 
  ["ember","dummy/controllers/base-non-editable-pill","dummy/components/modal-component","exports"],
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
define("dummy/controllers/todays-date-pill", 
  ["ember","dummy/controllers/base-non-editable-pill","exports"],
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
define("dummy/initializers/ember-widgets-config", 
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
define("dummy/initializers/export-application-global", 
  ["ember","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: 'export-application-global',

      initialize: initialize
    };
  });
define("dummy/mixins/body-event-listener", 
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
        if (this._clickHandler || this.isDestroying) {
          return;
        }
        this._clickHandler = (function(_this) {
          return function(event) {
            return Ember.run(function() {
              if ((_this.get('_state') || _this.get('state')) === 'inDOM' && Ember.isEmpty(_this.$().has($(event.target)))) {
                return _this.bodyClick();
              }
            });
          };
        })(this);
        return $(this.get('bodyElementSelector')).on("click", this._clickHandler);
      },
      _removeDocumentHandlers: function() {
        $(this.get('bodyElementSelector')).off("click", this._clickHandler);
        return this._clickHandler = null;
      }
    });

    __exports__["default"] = BodyEventListener;
  });
define("dummy/mixins/code-pretty-print", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CodePrettyPrintMixin;

    CodePrettyPrintMixin = Ember.Mixin.create({
      didInsertElement: function() {
        this._super();
        return Ember.run.next(this, function() {
          return prettyPrint();
        });
      }
    });

    __exports__["default"] = CodePrettyPrintMixin;
  });
define("dummy/mixins/dom-helper", 
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
      getNonEmptySideNode: function(range, left, deep) {
        var index, node, nodeIsEmpty, sideNode, _ref;
        if (left == null) {
          left = true;
        }
        nodeIsEmpty = function(node) {
          var _ref;
          return (node != null ? (_ref = node.nodeValue) != null ? _ref.trim().length : void 0 : void 0) === 0;
        };
        node = range[left ? 'startContainer' : 'endContainer'];
        while (((sideNode = node[left ? 'previousSibling' : 'nextSibling']) === null || nodeIsEmpty(sideNode)) && !$(node).hasClass(this.EDITOR_CLASS)) {
          if (nodeIsEmpty(sideNode)) {
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
define("dummy/mixins/large-hero-affix", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var LargeHeroAffixMixin;

    LargeHeroAffixMixin = Ember.Mixin.create({
      didInsertElement: function() {
        this._super();
        $('.sub-navigation-sidebar').affix({
          offset: {
            top: 500,
            bottom: 450
          }
        });
        return $('.sub-navigation-sidebar').data('bs.affix').options.offset.top = 500;
      }
    });

    __exports__["default"] = LargeHeroAffixMixin;
  });
define("dummy/mixins/pill-insert", 
  ["ember","dummy/controllers/todays-date-pill","dummy/controllers/non-editable-text-pill","exports"],
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
define("dummy/mixins/popover", 
  ["ember","dummy/mixins/style-bindings","dummy/mixins/body-event-listener","dummy/utils/css-transitions","exports"],
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
        if (this.get('isDestroyed')) {
          return;
        }
        this.set('isShowing', false);
        if (this.get('fadeEnabled')) {
          return this.$().one(transitionend, (function(_this) {
            return function() {
              return Ember.run(_this, _this.destroy);
            };
          })(this));
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
        return (function(_this) {
          return function(event) {
            if (event.keyCode === 27 && _this.get('escToCancel')) {
              return _this.hide();
            }
          };
        })(this);
      }),
      debounceSnapToPosition: Ember.computed(function() {
        return (function(_this) {
          return function() {
            return Ember.run.debounce(_this, _this.snapToPosition, _this.get('debounceTime'));
          };
        })(this);
      }),
      _setupDocumentHandlers: function() {
        this._super();
        if (!this._hideHandler) {
          this._hideHandler = (function(_this) {
            return function() {
              return _this.hide();
            };
          })(this);
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
define("dummy/mixins/resize-handler", 
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
define("dummy/mixins/small-hero-affix", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin;

    SmallHeroAffixMixin = Ember.Mixin.create({
      didInsertElement: function() {
        this._super();
        $('.sub-navigation-sidebar').affix({
          offset: {
            top: 150,
            bottom: 450
          }
        });
        return $('.sub-navigation-sidebar').data('bs.affix').options.offset.top = 150;
      }
    });

    __exports__["default"] = SmallHeroAffixMixin;
  });
define("dummy/mixins/style-bindings", 
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
        var lookup, properties, styleBindings, styleComputed, styles;
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
define("dummy/models/countries", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Countries;

    Countries = Ember.A([
      {
        name: 'Afghanistan',
        code: 'AF'
      }, {
        name: 'Aland Islands',
        code: 'AX'
      }, {
        name: 'Albania',
        code: 'AL'
      }, {
        name: 'Algeria',
        code: 'DZ'
      }, {
        name: 'American Samoa',
        code: 'AS'
      }, {
        name: 'Andorra',
        code: 'AD'
      }, {
        name: 'Angola',
        code: 'AO'
      }, {
        name: 'Anguilla',
        code: 'AI'
      }, {
        name: 'Antarctica',
        code: 'AQ'
      }, {
        name: 'Antigua and Barbuda',
        code: 'AG'
      }, {
        name: 'Argentina',
        code: 'AR'
      }, {
        name: 'Armenia',
        code: 'AM'
      }, {
        name: 'Aruba',
        code: 'AW'
      }, {
        name: 'Australia',
        code: 'AU'
      }, {
        name: 'Austria',
        code: 'AT'
      }, {
        name: 'Azerbaijan',
        code: 'AZ'
      }, {
        name: 'Bahamas',
        code: 'BS'
      }, {
        name: 'Bahrain',
        code: 'BH'
      }, {
        name: 'Bangladesh',
        code: 'BD'
      }, {
        name: 'Barbados',
        code: 'BB'
      }, {
        name: 'Belarus',
        code: 'BY'
      }, {
        name: 'Belgium',
        code: 'BE'
      }, {
        name: 'Belize',
        code: 'BZ'
      }, {
        name: 'Benin',
        code: 'BJ'
      }, {
        name: 'Bermuda',
        code: 'BM'
      }, {
        name: 'Bhutan',
        code: 'BT'
      }, {
        name: 'Bolivia',
        code: 'BO'
      }, {
        name: 'Bosnia and Herzegovina',
        code: 'BA'
      }, {
        name: 'Botswana',
        code: 'BW'
      }, {
        name: 'Bouvet Island',
        code: 'BV'
      }, {
        name: 'Brazil',
        code: 'BR'
      }, {
        name: 'British Indian Ocean Territory',
        code: 'IO'
      }, {
        name: 'Brunei Darussalam',
        code: 'BN'
      }, {
        name: 'Bulgaria',
        code: 'BG'
      }, {
        name: 'Burkina Faso',
        code: 'BF'
      }, {
        name: 'Burundi',
        code: 'BI'
      }, {
        name: 'Cambodia',
        code: 'KH'
      }, {
        name: 'Cameroon',
        code: 'CM'
      }, {
        name: 'Canada',
        code: 'CA'
      }, {
        name: 'Cape Verde',
        code: 'CV'
      }, {
        name: 'Cayman Islands',
        code: 'KY'
      }, {
        name: 'Central African Republic',
        code: 'CF'
      }, {
        name: 'Chad',
        code: 'TD'
      }, {
        name: 'Chile',
        code: 'CL'
      }, {
        name: 'China',
        code: 'CN'
      }, {
        name: 'Christmas Island',
        code: 'CX'
      }, {
        name: 'Cocos (Keeling) Islands',
        code: 'CC'
      }, {
        name: 'Colombia',
        code: 'CO'
      }, {
        name: 'Comoros',
        code: 'KM'
      }, {
        name: 'Congo',
        code: 'CG'
      }, {
        name: 'Congo, The Democratic Republic of the',
        code: 'CD'
      }, {
        name: 'Cook Islands',
        code: 'CK'
      }, {
        name: 'Costa Rica',
        code: 'CR'
      }, {
        name: 'Cote D\'Ivoire',
        code: 'CI'
      }, {
        name: 'Croatia',
        code: 'HR'
      }, {
        name: 'Cuba',
        code: 'CU'
      }, {
        name: 'Cyprus',
        code: 'CY'
      }, {
        name: 'Czech Republic',
        code: 'CZ'
      }, {
        name: 'Denmark',
        code: 'DK'
      }, {
        name: 'Djibouti',
        code: 'DJ'
      }, {
        name: 'Dominica',
        code: 'DM'
      }, {
        name: 'Dominican Republic',
        code: 'DO'
      }, {
        name: 'Ecuador',
        code: 'EC'
      }, {
        name: 'Egypt',
        code: 'EG'
      }, {
        name: 'El Salvador',
        code: 'SV'
      }, {
        name: 'Equatorial Guinea',
        code: 'GQ'
      }, {
        name: 'Eritrea',
        code: 'ER'
      }, {
        name: 'Estonia',
        code: 'EE'
      }, {
        name: 'Ethiopia',
        code: 'ET'
      }, {
        name: 'Falkland Islands (Malvinas)',
        code: 'FK'
      }, {
        name: 'Faroe Islands',
        code: 'FO'
      }, {
        name: 'Fiji',
        code: 'FJ'
      }, {
        name: 'Finland',
        code: 'FI'
      }, {
        name: 'France',
        code: 'FR'
      }, {
        name: 'French Guiana',
        code: 'GF'
      }, {
        name: 'French Polynesia',
        code: 'PF'
      }, {
        name: 'French Southern Territories',
        code: 'TF'
      }, {
        name: 'Gabon',
        code: 'GA'
      }, {
        name: 'Gambia',
        code: 'GM'
      }, {
        name: 'Georgia',
        code: 'GE'
      }, {
        name: 'Germany',
        code: 'DE'
      }, {
        name: 'Ghana',
        code: 'GH'
      }, {
        name: 'Gibraltar',
        code: 'GI'
      }, {
        name: 'Greece',
        code: 'GR'
      }, {
        name: 'Greenland',
        code: 'GL'
      }, {
        name: 'Grenada',
        code: 'GD'
      }, {
        name: 'Guadeloupe',
        code: 'GP'
      }, {
        name: 'Guam',
        code: 'GU'
      }, {
        name: 'Guatemala',
        code: 'GT'
      }, {
        name: 'Guernsey',
        code: 'GG'
      }, {
        name: 'Guinea',
        code: 'GN'
      }, {
        name: 'Guinea-Bissau',
        code: 'GW'
      }, {
        name: 'Guyana',
        code: 'GY'
      }, {
        name: 'Haiti',
        code: 'HT'
      }, {
        name: 'Heard Island and Mcdonald Islands',
        code: 'HM'
      }, {
        name: 'Holy See (Vatican City State)',
        code: 'VA'
      }, {
        name: 'Honduras',
        code: 'HN'
      }, {
        name: 'Hong Kong',
        code: 'HK'
      }, {
        name: 'Hungary',
        code: 'HU'
      }, {
        name: 'Iceland',
        code: 'IS'
      }, {
        name: 'India',
        code: 'IN'
      }, {
        name: 'Indonesia',
        code: 'ID'
      }, {
        name: 'Iran, Islamic Republic Of',
        code: 'IR'
      }, {
        name: 'Iraq',
        code: 'IQ'
      }, {
        name: 'Ireland',
        code: 'IE'
      }, {
        name: 'Isle of Man',
        code: 'IM'
      }, {
        name: 'Israel',
        code: 'IL'
      }, {
        name: 'Italy',
        code: 'IT'
      }, {
        name: 'Jamaica',
        code: 'JM'
      }, {
        name: 'Japan',
        code: 'JP'
      }, {
        name: 'Jersey',
        code: 'JE'
      }, {
        name: 'Jordan',
        code: 'JO'
      }, {
        name: 'Kazakhstan',
        code: 'KZ'
      }, {
        name: 'Kenya',
        code: 'KE'
      }, {
        name: 'Kiribati',
        code: 'KI'
      }, {
        name: 'Korea, Democratic People\'S Republic of',
        code: 'KP'
      }, {
        name: 'Korea, Republic of',
        code: 'KR'
      }, {
        name: 'Kuwait',
        code: 'KW'
      }, {
        name: 'Kyrgyzstan',
        code: 'KG'
      }, {
        name: 'Lao People\'S Democratic Republic',
        code: 'LA'
      }, {
        name: 'Latvia',
        code: 'LV'
      }, {
        name: 'Lebanon',
        code: 'LB'
      }, {
        name: 'Lesotho',
        code: 'LS'
      }, {
        name: 'Liberia',
        code: 'LR'
      }, {
        name: 'Libyan Arab Jamahiriya',
        code: 'LY'
      }, {
        name: 'Liechtenstein',
        code: 'LI'
      }, {
        name: 'Lithuania',
        code: 'LT'
      }, {
        name: 'Luxembourg',
        code: 'LU'
      }, {
        name: 'Macao',
        code: 'MO'
      }, {
        name: 'Macedonia, The Former Yugoslav Republic of',
        code: 'MK'
      }, {
        name: 'Madagascar',
        code: 'MG'
      }, {
        name: 'Malawi',
        code: 'MW'
      }, {
        name: 'Malaysia',
        code: 'MY'
      }, {
        name: 'Maldives',
        code: 'MV'
      }, {
        name: 'Mali',
        code: 'ML'
      }, {
        name: 'Malta',
        code: 'MT'
      }, {
        name: 'Marshall Islands',
        code: 'MH'
      }, {
        name: 'Martinique',
        code: 'MQ'
      }, {
        name: 'Mauritania',
        code: 'MR'
      }, {
        name: 'Mauritius',
        code: 'MU'
      }, {
        name: 'Mayotte',
        code: 'YT'
      }, {
        name: 'Mexico',
        code: 'MX'
      }, {
        name: 'Micronesia, Federated States of',
        code: 'FM'
      }, {
        name: 'Moldova, Republic of',
        code: 'MD'
      }, {
        name: 'Monaco',
        code: 'MC'
      }, {
        name: 'Mongolia',
        code: 'MN'
      }, {
        name: 'Montserrat',
        code: 'MS'
      }, {
        name: 'Morocco',
        code: 'MA'
      }, {
        name: 'Mozambique',
        code: 'MZ'
      }, {
        name: 'Myanmar',
        code: 'MM'
      }, {
        name: 'Namibia',
        code: 'NA'
      }, {
        name: 'Nauru',
        code: 'NR'
      }, {
        name: 'Nepal',
        code: 'NP'
      }, {
        name: 'Netherlands',
        code: 'NL'
      }, {
        name: 'Netherlands Antilles',
        code: 'AN'
      }, {
        name: 'New Caledonia',
        code: 'NC'
      }, {
        name: 'New Zealand',
        code: 'NZ'
      }, {
        name: 'Nicaragua',
        code: 'NI'
      }, {
        name: 'Niger',
        code: 'NE'
      }, {
        name: 'Nigeria',
        code: 'NG'
      }, {
        name: 'Niue',
        code: 'NU'
      }, {
        name: 'Norfolk Island',
        code: 'NF'
      }, {
        name: 'Northern Mariana Islands',
        code: 'MP'
      }, {
        name: 'Norway',
        code: 'NO'
      }, {
        name: 'Oman',
        code: 'OM'
      }, {
        name: 'Pakistan',
        code: 'PK'
      }, {
        name: 'Palau',
        code: 'PW'
      }, {
        name: 'Palestinian Territory, Occupied',
        code: 'PS'
      }, {
        name: 'Panama',
        code: 'PA'
      }, {
        name: 'Papua New Guinea',
        code: 'PG'
      }, {
        name: 'Paraguay',
        code: 'PY'
      }, {
        name: 'Peru',
        code: 'PE'
      }, {
        name: 'Philippines',
        code: 'PH'
      }, {
        name: 'Pitcairn',
        code: 'PN'
      }, {
        name: 'Poland',
        code: 'PL'
      }, {
        name: 'Portugal',
        code: 'PT'
      }, {
        name: 'Puerto Rico',
        code: 'PR'
      }, {
        name: 'Qatar',
        code: 'QA'
      }, {
        name: 'Reunion',
        code: 'RE'
      }, {
        name: 'Romania',
        code: 'RO'
      }, {
        name: 'Russian Federation',
        code: 'RU'
      }, {
        name: 'RWANDA',
        code: 'RW'
      }, {
        name: 'Saint Helena',
        code: 'SH'
      }, {
        name: 'Saint Kitts and Nevis',
        code: 'KN'
      }, {
        name: 'Saint Lucia',
        code: 'LC'
      }, {
        name: 'Saint Pierre and Miquelon',
        code: 'PM'
      }, {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC'
      }, {
        name: 'Samoa',
        code: 'WS'
      }, {
        name: 'San Marino',
        code: 'SM'
      }, {
        name: 'Sao Tome and Principe',
        code: 'ST'
      }, {
        name: 'Saudi Arabia',
        code: 'SA'
      }, {
        name: 'Senegal',
        code: 'SN'
      }, {
        name: 'Serbia and Montenegro',
        code: 'CS'
      }, {
        name: 'Seychelles',
        code: 'SC'
      }, {
        name: 'Sierra Leone',
        code: 'SL'
      }, {
        name: 'Singapore',
        code: 'SG'
      }, {
        name: 'Slovakia',
        code: 'SK'
      }, {
        name: 'Slovenia',
        code: 'SI'
      }, {
        name: 'Solomon Islands',
        code: 'SB'
      }, {
        name: 'Somalia',
        code: 'SO'
      }, {
        name: 'South Africa',
        code: 'ZA'
      }, {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS'
      }, {
        name: 'Spain',
        code: 'ES'
      }, {
        name: 'Sri Lanka',
        code: 'LK'
      }, {
        name: 'Sudan',
        code: 'SD'
      }, {
        name: 'Suriname',
        code: 'SR'
      }, {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ'
      }, {
        name: 'Swaziland',
        code: 'SZ'
      }, {
        name: 'Sweden',
        code: 'SE'
      }, {
        name: 'Switzerland',
        code: 'CH'
      }, {
        name: 'Syrian Arab Republic',
        code: 'SY'
      }, {
        name: 'Taiwan, Province of China',
        code: 'TW'
      }, {
        name: 'Tajikistan',
        code: 'TJ'
      }, {
        name: 'Tanzania, United Republic of',
        code: 'TZ'
      }, {
        name: 'Thailand',
        code: 'TH'
      }, {
        name: 'Timor-Leste',
        code: 'TL'
      }, {
        name: 'Togo',
        code: 'TG'
      }, {
        name: 'Tokelau',
        code: 'TK'
      }, {
        name: 'Tonga',
        code: 'TO'
      }, {
        name: 'Trinidad and Tobago',
        code: 'TT'
      }, {
        name: 'Tunisia',
        code: 'TN'
      }, {
        name: 'Turkey',
        code: 'TR'
      }, {
        name: 'Turkmenistan',
        code: 'TM'
      }, {
        name: 'Turks and Caicos Islands',
        code: 'TC'
      }, {
        name: 'Tuvalu',
        code: 'TV'
      }, {
        name: 'Uganda',
        code: 'UG'
      }, {
        name: 'Ukraine',
        code: 'UA'
      }, {
        name: 'United Arab Emirates',
        code: 'AE'
      }, {
        name: 'United Kingdom',
        code: 'GB'
      }, {
        name: 'United States',
        code: 'US'
      }, {
        name: 'United States Minor Outlying Islands',
        code: 'UM'
      }, {
        name: 'Uruguay',
        code: 'UY'
      }, {
        name: 'Uzbekistan',
        code: 'UZ'
      }, {
        name: 'Vanuatu',
        code: 'VU'
      }, {
        name: 'Venezuela',
        code: 'VE'
      }, {
        name: 'Viet Nam',
        code: 'VN'
      }, {
        name: 'Virgin Islands, British',
        code: 'VG'
      }, {
        name: 'Virgin Islands, U.S.',
        code: 'VI'
      }, {
        name: 'Wallis and Futuna',
        code: 'WF'
      }, {
        name: 'Western Sahara',
        code: 'EH'
      }, {
        name: 'Yemen',
        code: 'YE'
      }, {
        name: 'Zambia',
        code: 'ZM'
      }, {
        name: 'Zimbabwe',
        code: 'ZW'
      }
    ]);

    __exports__["default"] = Countries;
  });
define("dummy/router", 
  ["ember","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];
    var Router;

    Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function() {
      this.route('license');
      this.resource('emberWidgets', {
        path: '/ember-widgets'
      }, function() {
        this.route('overview');
        this.route('documentation');
        this.route('accordion');
        this.route('carousel');
        this.route('modal');
        this.route('popover');
        this.route('select');
        this.route('colorPicker');
        return this.route('radioButton');
      });
      this.route('ember-widgets-index-route');
      this.route('ember-widgets-overview');
      this.route('ember-widgets-select');
      this.route('ember-widgets-modal');
      return this.route('ember-widgets-popover');
    });

    __exports__["default"] = Router;
  });
define("dummy/routes/ember-widgets/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EmberWidgetsIndexRoute;

    EmberWidgetsIndexRoute = Ember.Route.extend({
      beforeModel: function() {
        return this.transitionTo('emberWidgets.overview');
      }
    });

    __exports__["default"] = EmberWidgetsIndexRoute;
  });
define("dummy/routes/ember-widgets/modal", 
  ["ember","dummy/components/modal-component","dummy/views/custom-modal-content","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ModalComponent = __dependency2__["default"];
    var CustomModalContentView = __dependency3__["default"];
    var EmberWidgetsModalRoute;

    EmberWidgetsModalRoute = Ember.Route.extend({
      actions: {
        showModal: function() {
          return ModalComponent.popup({
            targetObject: this,
            confirm: "modalConfirm",
            cancel: "modalCancel",
            content: "Isn't this one fine day?"
          });
        },
        showSmallModal: function() {
          return ModalComponent.popup({
            targetObject: this,
            confirm: "modalConfirm",
            cancel: "modalCancel",
            size: 'small',
            content: "This is quite small isn't it? You can also use 'large'."
          });
        },
        showModalWithCustomContent: function() {
          return ModalComponent.popup({
            targetObject: this,
            confirm: "modalConfirm",
            cancel: "modalCancel",
            content: {
              name: "Louis"
            },
            contentViewClass: CustomModalContentView
          });
        },
        modalConfirm: function() {
          return console.log("Modal Confirm!");
        },
        modalCancel: function() {
          return console.log("Modal Cancel!");
        }
      }
    });

    __exports__["default"] = EmberWidgetsModalRoute;
  });
define("dummy/routes/ember-widgets/overview", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EmberWidgetsOverviewRoute;

    EmberWidgetsOverviewRoute = Ember.Route.extend({
      activate: function() {
        var controller;
        controller = this.controllerFor('emberWidgets');
        return controller.set('showLargeHero', true);
      },
      deactivate: function() {
        var controller;
        controller = this.controllerFor('emberWidgets');
        return controller.set('showLargeHero', false);
      }
    });

    __exports__["default"] = EmberWidgetsOverviewRoute;
  });
define("dummy/routes/ember-widgets/popover", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EmberWidgetsPopoverRoute;

    EmberWidgetsPopoverRoute = Ember.Route.extend({
      model: function() {
        return {
          name: "Louis"
        };
      }
    });

    __exports__["default"] = EmberWidgetsPopoverRoute;
  });
define("dummy/routes/ember-widgets/select", 
  ["ember","dummy/models/countries","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Countries = __dependency2__["default"];
    var EmberWidgetsSelectRoute;

    EmberWidgetsSelectRoute = Ember.Route.extend({
      model: function() {
        return Countries;
      }
    });

    __exports__["default"] = EmberWidgetsSelectRoute;
  });
define("dummy/routes/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var IndexRoute;

    IndexRoute = Ember.Route.extend({
      beforeModel: function() {
        return this.transitionTo('emberWidgets.overview');
      }
    });

    __exports__["default"] = IndexRoute;
  });
define("dummy/templates/accordion-group-layout", 
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
define("dummy/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("\n");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
      data.buffer.push("\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "footer", options) : helperMissing.call(depth0, "partial", "footer", options))));
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("dummy/templates/carousel", 
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
define("dummy/templates/color-picker", 
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
define("dummy/templates/component-default-content", 
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
define("dummy/templates/components/color-picker-cell", 
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
define("dummy/templates/components/color-picker", 
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
define("dummy/templates/components/editable-label", 
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
define("dummy/templates/components/font-chooser-item", 
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
define("dummy/templates/components/modal", 
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
define("dummy/templates/components/multi-select-item", 
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
define("dummy/templates/components/multi-select", 
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
define("dummy/templates/components/non-editable-text-pill-configuration", 
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
define("dummy/templates/components/popover", 
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
define("dummy/templates/components/select-item", 
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
define("dummy/templates/components/select", 
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
      stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <span class=\"ember-select-no-results\">No results match \"");
      stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\"</span>\n    ");
      return buffer;
      }

    function program10(depth0,data) {
      
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
      stack1 = helpers['if'].call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/components/text-editor-config", 
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
define("dummy/templates/components/text-editor-pill-menu", 
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
define("dummy/templates/components/text-editor-with-non-editable-config", 
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
define("dummy/templates/components/text-editor-with-non-editable", 
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
define("dummy/templates/components/text-editor", 
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
define("dummy/templates/components/typeahead", 
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
define("dummy/templates/custom-modal-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<p>Isn't this one fine day ");
      stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("?</p>\n");
      return buffer;
      
    });
  });
define("dummy/templates/custom-popover-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("Isn't this one fine day ");
      stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("?\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  \n  <div class=\"hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n    <div class=\"container hero-content-container\">\n      <div class=\"row\">\n        <div class=\"span12 hero-tagline center-align hidden-tablet\">\n          <h1 class=\"elevated\">Ember Widgets</h1>\n          <p class=\"elevated\">\n            A powerful and easy to use component library for Ember.js.\n            <br><br>\n            <a target=\"_BLANK\"\n                href=\"https://github.com/Addepar/ember-widgets/releases\"\n                class=\"addepar-btn addepar-btn-large addepar-btn-outline addepar-btn-white\">\n              Download Ember-Widgets\n            </a>\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  \n  <div class=\"hero-container small-hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n  </div>\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "showLargeHero", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n<div class=\"container\">\n  <div class=\"row\">\n    ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "sub-navigation", options) : helperMissing.call(depth0, "partial", "sub-navigation", options))));
      data.buffer.push("\n    ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/accordion", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'isActive': (true),
        'title': ("Collapsible Group Item #1")
      },hashTypes:{'isActive': "BOOLEAN",'title': "STRING"},hashContexts:{'isActive': depth0,'title': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'title': ("Collapsible Group Item #2")
      },hashTypes:{'title': "STRING"},hashContexts:{'title': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'title': ("Collapsible Group Item #3")
      },hashTypes:{'title': "STRING"},hashContexts:{'title': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("\n            Anim pariatur cliche reprehenderit...\n          ");
      }

      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Accordion <small> Ember.Widgets.Accordion</small></h2>\n      <p class=\"elevated\">Displays collapsible content panels for presenting information in a limited amount of space. Click headers to expand/collapse content that is broken into logical sections, much like tabs.</p>\n\n      <div class=\"example-container\">\n        ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
      if (helper = helpers['accordion-component']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['accordion-component']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['accordion-component']) { stack1 = blockHelperMissing.call(depth0, 'accordion-component', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h4>Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#accordion-component&#125;&#125;\n  &#123;&#123;#accordion-item isActive=true title=&quot;Collapsible Group Item #1&quot;&#125;&#125;\n    Anim pariatur cliche reprehenderit...\n  &#123;&#123;/accordion-item&#125;&#125;\n  &#123;&#123;#accordion-item title=&quot;Collapsible Group Item #2&quot;&#125;&#125;\n    Anim pariatur cliche reprehenderit...\n  &#123;&#123;/accordion-item&#125;&#125;\n  &#123;&#123;#accordion-item title=&quot;Collapsible Group Item #3&quot;&#125;&#125;\n    Anim pariatur cliche reprehenderit...\n  &#123;&#123;/accordion-item&#125;&#125;\n&#123;&#123;/accordion-component&#125;&#125;</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/carousel", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['carousel-item'] || (depth0 && depth0['carousel-item']),options={hash:{
        'class': ("active")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "carousel-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data}
      if (helper = helpers['carousel-item']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['carousel-item']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['carousel-item']) { stack1 = blockHelperMissing.call(depth0, 'carousel-item', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}
      if (helper = helpers['carousel-item']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['carousel-item']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['carousel-item']) { stack1 = blockHelperMissing.call(depth0, 'carousel-item', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("\n            <img src=\"../images/bootstrap-mdo-sfmoma-01.jpg\" alt=\"\">\n          ");
      }

    function program4(depth0,data) {
      
      
      data.buffer.push("\n            <img src=\"../images/bootstrap-mdo-sfmoma-02.jpg\" alt=\"\">\n          ");
      }

    function program6(depth0,data) {
      
      
      data.buffer.push("\n            <img src=\"../images/bootstrap-mdo-sfmoma-03.jpg\" alt=\"\">\n          ");
      }

      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Carousel</h2>\n      <p class=\"elevated\">The slideshow below shows a generic plugin and component for cycling through elements like a carousel.</p>\n\n      <div class=\"example-container\">\n        ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
      if (helper = helpers['carousel-component']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['carousel-component']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['carousel-component']) { stack1 = blockHelperMissing.call(depth0, 'carousel-component', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h4>Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#carousel-component&#125;&#125;<br/>  &#123;&#123;#carousel-item class=&quot;active&quot;&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-01.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>  &#123;&#123;#carousel-item&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-02.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>  &#123;&#123;#carousel-item&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-03.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>&#123;&#123;/carousel-component&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/color-picker", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Color Picker <small> Ember.Widgets.ColorPicker </small></h2>\n      <p class=\"elevated\">A simple component to select color from a given palette and the option to define a custom HEX.</p>\n    </div>\n\n    <div class=\"col-md-3\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
      data.buffer.push("\n      <button type=\"button\" class=\"btn btn-default\">Comparison</button>\n    </div>\n\n    <div class=\"col-md-3\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
        'class': ("btn btn-default"),
        'dropdownClass': ("pull-right")
      },hashTypes:{'class': "STRING",'dropdownClass': "STRING"},hashContexts:{'class': depth0,'dropdownClass': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
      data.buffer.push("\n      <button type=\"button\" class=\"btn btn-default\">Comparison</button>\n    </div>\n\n    <div class=\"col-md-6\">\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;color-picker&#125;&#125;\n</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-2\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
        'class': ("btn btn-default btn-expand")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/documentation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '';


      data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>API</h1>\n  <h2>Ember.Widgets.SelectComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>itemViewClass</td>\n      <td>Ember.Widgets.SelectOptionView</td>\n      <td><p>The view to be displayed in the rows of the select.</p></td>\n    </tr>\n    <tr>\n      <td>prompt</td>\n      <td>Select a Value</td>\n      <td><p>The prompt to be displayed by default in the select, when\n        nothing else is selected.</p></td>\n    </tr>\n    <tr>\n      <td>placeholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in the search box when you\n        click on the select.</p></td>\n    </tr>\n    <tr>\n      <td>highlightedIndex</td>\n      <td>-1</td>\n      <td><p>The index of the select item that is highlighted.</p></td>\n    </tr>\n    <tr>\n      <td>tabindex</td>\n      <td>-1</td>\n      <td><p>The tabindex of the component.</p></td>\n    </tr>\n    <tr>\n      <td>showDropdown</td>\n      <td>no</td>\n      <td><p>If yes then shows a dropdown.</p></td>\n    </tr>\n    <tr>\n      <td>dropdownHeight</td>\n      <td>300</td>\n      <td><p>The height of the dropdown.</p></td>\n    </tr>\n    <tr>\n      <td>rowHeight</td>\n      <td>26</td>\n      <td><p>Row height in pixels for the lazy list. Important: rowHeight must be synched with the CSS</p></td>\n    </tr>\n    <tr>\n      <td>sortLabels</td>\n      <td>yes</td>\n      <td><p>Option to indicate whether we should sort the labels</p></td>\n    </tr>\n    <tr>\n      <td>isSelect</td>\n      <td>no</td>\n      <td><p>If isSelect is true, we will not show the search box</p></td>\n    </tr>\n    <tr>\n      <td>isButton</td>\n      <td>yes</td>\n      <td><p>If is button is true, the select will look like a button</p></td>\n    </tr>\n    <tr>\n      <td>dropdownToggleIcon</td>\n      <td>icon-sort</td>\n      <td><p>Font-awesome dependency - Change the icon when necessary</p></td>\n    </tr>\n    <tr>\n      <td>content</td>\n      <td>[]</td>\n      <td><p>The list of options.</p></td>\n    </tr>\n    <tr>\n      <td>selection</td>\n      <td>null</td>\n      <td><p>The option which is currently selected.</p></td>\n    </tr>\n    <tr>\n      <td>optionLabelPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the label, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionValuePath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the value, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionGroupPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the group, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionDefaultPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the default option.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.MultiSelectComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <td>placeholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in multi-select search box\n        before anything has been selected.</p></td>\n    </tr>\n    <tr>\n      <td>persistentPlaceholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in multi-select search box,\n        even if one or more options are already selected.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.PopoverComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>targetElement</td>\n      <td>null</td>\n      <td><p>The element this popover will be attached to. If null, the popover will be positioned absolutely based on top and left.</p></td>\n    </tr>\n    <tr>\n      <td>placement</td>\n      <td>top</td>\n      <td><p>The direction the popover will pop up. Other options are\n        bottom, top-right, top-left, bottom-right, bottom-left, left,\n        and right</p></td>\n    </tr>\n    <tr>\n      <td>title</td>\n      <td>''</td>\n      <td><p>The title to be displayed on the popover.</p></td>\n    </tr>\n    <tr>\n      <td>left</td>\n      <td>0</td>\n      <td><p>The left offset of the popover, in pixels.</p></td>\n    </tr>\n    <tr>\n      <td>top</td>\n      <td>0</td>\n      <td><p>The top offset of the popover, in pixels.</p></td>\n    </tr>\n    <tr>\n      <td>fade</td>\n      <td>yes</td>\n      <td><p>If this is yes then the modal fades in/out.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.ModalComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>backdrop</td>\n      <td>yes</td>\n      <td><p>If this is yes then the modal will be displayed with a\n        semi-opaque backdrop.</p></td>\n    </tr>\n    <tr>\n      <td>fade</td>\n      <td>yes</td>\n      <td><p>If this is yes then the modal fades in/out.</p></td>\n    </tr>\n    <tr>\n      <td>escToCancel</td>\n      <td>yes</td>\n      <td><p>If this is yes then pressing ESC cancels the modal.</p></td>\n    </tr>\n    <tr>\n      <td>headerText</td>\n      <td>\"Modal Header\"</td>\n      <td><p>The text that is displayed in the header of the modal.</p></td>\n    </tr>\n    <tr>\n      <td>confirmText</td>\n      <td>\"Confirm\"</td>\n      <td><p>The text that is displayed in the confirmation button of\n        the modal.</p></td>\n    </tr>\n    <tr>\n      <td>cancelText</td>\n      <td>\"Cancel\"</td>\n      <td><p>The text that is displayed in the cancel button of the\n        modal.</p></td>\n    </tr>\n    <tr>\n      <td>bodyElementSelector</td>\n      <td>'.modal-backdrop'</td>\n      <td><p></p></td>\n    </tr>\n    <tr>\n      <td>size</td>\n      <td>'normal'</td>\n      <td><p>The size of the bootstrap modal.  Other options are 'small'\n        and 'large'.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.CarouselComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>activeIndex</td>\n      <td>0</td>\n      <td><p>The index of the carousel item which is currently being\n        shown.</p></td>\n    </tr>\n  </table>\n\n\n  layoutName: 'carousel'\n  classNames: ['carousel', 'slide']\n  classNameBindings: ['sliding']\n\n  <hr>\n  <h2>Ember.Widgets.AccordionComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>activeIndex</td>\n      <td>0</td>\n      <td><p>The index of the accordian item which is currently being\n        shown.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.RadioButtonGroupComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>selectedValue</td>\n      <td>null</td>\n      <td><p>The value of the currently selected button. To preselect a button\n        set selectedValue to the value of that button in your template. As a use\n        case example, bind selectedValue to a boolean variable and have two radio\n        buttons with values true and false. The bound boolean variable can now switch\n        values between true and false based on which radio button is chosen.</p></td>\n    </tr>\n    <tr>\n      <td>disabled</td>\n      <td>false</td>\n      <td><p>Whether or not the entire radio button group is disabled.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.RadioButtonComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n      <td>value</td>\n      <td>null</td>\n      <td><p>The value that the button corresponds to.</p></td>\n    </tr>\n    <tr>\n      <td>disabled</td>\n      <td>false</td>\n      <td><p>If the entire group is not disabled, whether or not this particular\n        radio button is disabled.</p></td>\n    </tr>\n  </table>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  \n  <div class=\"hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n    <div class=\"container hero-content-container\">\n      <div class=\"row\">\n        <div class=\"span12 hero-tagline center-align hidden-tablet\">\n          <h1 class=\"elevated\">Ember Widgets</h1>\n          <p class=\"elevated\">\n            A powerful and easy to use component library for Ember.js.\n            <br><br>\n            <a target=\"_BLANK\"\n                href=\"https://github.com/Addepar/ember-widgets/releases\"\n                class=\"addepar-btn addepar-btn-large addepar-btn-outline addepar-btn-white\">\n              Download Ember-Widgets\n            </a>\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  \n  <div class=\"hero-container small-hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n  </div>\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "showLargeHero", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n<div class=\"container\">\n  <div class=\"row\">\n    ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "sub-navigation", options) : helperMissing.call(depth0, "partial", "sub-navigation", options))));
      data.buffer.push("\n    ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Modal <small> Ember.Widgets.Modal</small></h2>\n      <p class=\"elevated\">The modal is an absolutely positioned dialog\ncomponent which overlays the page. Typically, modals are pre-rendered\ninto the page, even before they are needed. Our approach appends the\nmodal when it is required and removes it once it is no longer visible.\nWe designed it such that actions are sent to the application the same way <a\nhref=\"http://emberjs.com/guides/components/sending-actions-from-components-to-your-application/\">components\nsend them.</a> One caveat is that we need to pass in the current\ncontroller as the target object to receive actions and to inherit the\ncontainer.</p>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Modal with content property</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">\n          Show Modal\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        content: \"Isn't this one fine day?\"\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Modal with contentViewClass</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModalWithCustomContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">\n          Show Modal With Custom Content\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        content: { name: \"Louis\" }\n        contentViewClass: CustomModalContentView\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom_modal_content_view.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">CustomModalContentView = Ember.View.extend\n  templateName: 'custom-modal-content'\n</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom-modal-content.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">Isn't this one fine day &#123;&#123;content.name&#125;&#125;?</pre>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Modal with custom size</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showSmallModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">\n          Show Modal\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        size: 'small'\n        content: \"This is quite small isn't it?\"\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/overview", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Accordion");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("Carousel");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Modal");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("Popover");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("Select &amp; Multi-Select");
      }

    function program11(depth0,data) {
      
      
      data.buffer.push("Color Picker");
      }

    function program13(depth0,data) {
      
      
      data.buffer.push("Radio Button");
      }

    function program15(depth0,data) {
      
      
      data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Accordion</h4>\n            <img class=\"preview-box\" src=\"images/preview_widgets_accordion.png\" />\n          </div>\n        ");
      }

    function program17(depth0,data) {
      
      
      data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Carousel</h4>\n            <img class=\"preview-box\" src=\"images/preview_widgets_carousel.png\" />\n          </div>\n        ");
      }

    function program19(depth0,data) {
      
      
      data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Modal</h4>\n            <img class=\"preview-box\" src=\"images/preview_widgets_modal.png\" />\n          </div>\n        ");
      }

    function program21(depth0,data) {
      
      
      data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Popover</h4>\n            <img class=\"preview-box\" src=\"images/preview_widgets_popover.png\" />\n          </div>\n        ");
      }

    function program23(depth0,data) {
      
      
      data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Select &amp; Multi-Select</h4>\n            <img class=\"preview-box\" src=\"images/preview_widgets_select.png\" />\n          </div>\n        ");
      }

      data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1>Ember Widgets</h1>\n      <p class=\"elevated\">A component library built with the <a\n        target=\"_BLANK\" href=\"http://emberjs.com/\">Ember.js</a>\n      framework. Includes easy to extend components such as select,\n      popover, modal, carousel, and accordion. This library is built on\n      bootstrap 3.0 CSS and represents our ideas about component best\n      practices.</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h3>Features</h3>\n      <ul class=\"styled\">\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.accordion", options) : helperMissing.call(depth0, "link-to", "emberWidgets.accordion", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n      </ul>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Dependencies</h3>\n      <ul class=\"styled\">\n        <li><a target=\"_BLANK\" href=\"http://emberjs.com/\">Ember.js</a></li>\n        <li><a target=\"_BLANK\" href=\"http://emberjs.com/list-view/\">List-View</a></li>\n        <li><a target=\"_BLANK\" href=\"http://getbootstrap.com/\">Bootstrap (V3)</a></li>\n        <li><a target=\"_BLANK\" href=\"http://lodash.com/\">Lo-Dash</a></li>\n        <li><a target=\"_BLANK\" href=\"http://jquery.com/\">jQuery</a></li>\n      </ul>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <hr>\n      <h1>Widgets</h1>\n      <p class=\"elevated\">The examples below demonstrate how you can extend and customize the widgets.</p>\n      <div class=\"row ember-widgets-examples\">\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.accordion", options) : helperMissing.call(depth0, "link-to", "emberWidgets.accordion", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Getting Started</h1>\n      <p>You will need <a target=\"_BLANK\" href=\"http://nodejs.org/\">node</a> installed as a development dependency.</p>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/\">Clone it from Github</a> or <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/releases\">download the ZIP repo</a></p>\n      <div class=\"highlight\">\n<pre><code>$ npm install -g grunt-cli\n$ npm install\n$ grunt\n$ node examples.js</code></pre>\n      <p>Go to your browser and navigate to localhost:8000/gh_pages</p>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Contributing</h1>\n      <p>You can contribute to this project in one of two ways:\n      <ul class=\"styled\">\n        <li>Browse the ember-widgets <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/issues?state=open\">issues</a> and report bugs</li>\n        <li>Clone the ember-widgets repo, make some changes according to our development guidelines and issue a pull-request with your changes.</li>\n      </ul>\n      <p>We keep the ember-widgets.js code to the minimum necessary, giving users as much control as possible.</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Changelog</h1>\n      <p>The current version is 0.2.0.\n      <p>For the full list of changes, please see <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/blob/master/CHANGELOG.md\">CHANGELOG.md</a>.</p>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Acknowledgements</h1>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/graphs/contributors\">List of Contributors on Github</a></p>\n      <p>With lots of help from the Ember.js team</p>\n      <p><a target=\"_BLANK\" href=\"https://twitter.com/wycats\">wycats</a>, <a target=\"_BLANK\" href=\"https://twitter.com/tomdale\">tomdale</a>, <a target=\"_BLANK\" href=\"https://twitter.com/ebryn\">ebryn</a></p>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/popover", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Top\n        ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Top-Right\n        ");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Right\n        ");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Bottom-Right\n        ");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Bottom\n        ");
      }

    function program11(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Bottom-Left\n        ");
      }

    function program13(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Left\n        ");
      }

    function program15(depth0,data) {
      
      
      data.buffer.push("\n          Show Popover Top-Left\n        ");
      }

      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Popover <small> Ember.Widgets.Popover</small></h2>\n      <p class=\"elevated\">Add small overlays of content to any element\nfor displaying additional information. We created the popover link as a\ncomponent which can either hold a content string specified in the handlebar\nhelper or point to a custom view class for more sophisticated look and\nfeel.</p>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Simple Popover</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'title': ("Hello"),
        'contentViewClass': ("customContentView"),
        'content': ("Hello World!")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'title': "STRING",'contentViewClass': "ID",'content': "STRING"},hashContexts:{'tagName': depth0,'class': depth0,'title': depth0,'contentViewClass': depth0,'content': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#popover-link-component tagName=&quot;button&quot;\n  class=&quot;btn btn-primary&quot; title=&quot;Hello&quot;\n  content=&quot;Hello World&quot;&#125;&#125;\n  Show Popover Button-Left\n&#123;&#123;/popover-link-component&#125;&#125;</pre>\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("top-right"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("right"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("bottom-right"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("bottom"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("bottom-left"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("left"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
      stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
        'tagName': ("button"),
        'class': ("btn btn-primary"),
        'placement': ("top-left"),
        'contentBinding': ("model"),
        'title': ("Derp"),
        'contentViewClass': ("customContentView")
      },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'contentBinding': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'contentBinding': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(15, program15, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#popover-link-component tagName=&quot;button&quot;\n  class=&quot;btn btn-primary&quot; placement=&quot;bottom-left&quot;\n  contentViewClass=&quot;CustomPopoverContentView&quot;&#125;&#125;\n  Show Popover Button-Left\n&#123;&#123;/popover-link-component&#125;&#125;</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom-popover-content.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">Isn't this one fine day &#123;&#123;content.name&#125;&#125;?</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom_popover_content_view.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">CustomPopoverContentView = Ember.View.extend\n  templateName: 'custom-popover-content'</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/radio-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          <div class=\"radio-row\">\n            ");
      stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
        'value': (true)
      },hashTypes:{'value': "BOOLEAN"},hashContexts:{'value': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          </div>\n          <div class=\"radio-row\">\n            ");
      stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
        'value': (false)
      },hashTypes:{'value': "BOOLEAN"},hashContexts:{'value': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          </div>\n        ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("\n              <span class=\"form-label radio-label\">True</span>\n            ");
      }

    function program4(depth0,data) {
      
      
      data.buffer.push("\n              <span class=\"form-label radio-label\">False</span>\n            ");
      }

      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Radio Button <small>Ember.Widgets.RadioButton</small></h2>\n      <p class=\"elevated\">Allows selection of one choice from multiple possibilities.</p>\n      <div class=\"example-container\">\n        ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
      if (helper = helpers['radio-button-group-component']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['radio-button-group-component']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['radio-button-group-component']) { stack1 = blockHelperMissing.call(depth0, 'radio-button-group-component', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    </div>\n    <div class=\"col-md-12 bumper-30\">\n      <h4>Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#radio-button-group-component&#125;&#125;\n  &lt;div class=&quot;radio-row&quot;&gt;\n    &#123;&#123;#radio-button value=true&#125;&#125;\n      &lt;span class=&quot;form-label radio-label&quot;&gt;True&lt;/span&gt;\n    &#123;&#123;/radio-button&#125;&#125;\n  &lt;/div&gt;\n  &lt;div class=&quot;radio-row&quot;&gt;\n    &#123;&#123;#radio-button value=false&#125;&#125;\n      &lt;span class=&quot;form-label radio-label&quot;&gt;False&lt;/span&gt;\n    &#123;&#123;/radio-button&#125;&#125;\n  &lt;/div&gt;\n&#123;&#123;/radio-button-group-component&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/select", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h2>Select <small> Ember.Widgets.Select</small></h2>\n  <p class=\"elevated\">Ember select is a Ember.js based replacement for select boxes. It supports searching, remote data sets, and infinite scrolling of results. This component&#39;s design was inspired by the excellent <a target=\"_BLANK\" href=\"http://harvesthq.github.io/chosen/\">Chosen</a> jquery plugin and <a target=\"_BLANK\" href=\"http://ivaynberg.github.io/select2/\">Select2</a>. Uses the <a target=\"_BLANK\" href=\"https://github.com/emberjs/list-view\">ember list view</a> for lazily rendering large arrays of content.</p>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h3>Select with Selection Binding</h3>\n      <div class=\"example-container\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
        'contentBinding': ("model"),
        'prompt': ("Select a Country"),
        'optionLabelPath': ("name"),
        'optionValuePath': ("name"),
        'selectionBinding': ("selection"),
        'placeholder': ("Search")
      },hashTypes:{'contentBinding': "STRING",'prompt': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'placeholder': "STRING"},hashContexts:{'contentBinding': depth0,'prompt': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
      data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;select-component\n  contentBinding=\"model\"\n  prompt=\"Select a Country\"\n  optionLabelPath=\"name\"\n  optionValuePath=\"name\"\n  selectionBinding=\"selection\"\n  placeholder=\"Search\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Multi-Select</h3>\n      <div class=\"example-container\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers['multi-select-component'] || (depth0 && depth0['multi-select-component']),options={hash:{
        'contentBinding': ("model"),
        'optionLabelPath': ("name"),
        'optionValuePath': ("code"),
        'classNames': ("multi-select-example"),
        'placeholder': ("Select a country...")
      },hashTypes:{'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'classNames': "STRING",'placeholder': "STRING"},hashContexts:{'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'classNames': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "multi-select-component", options))));
      data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;multi-select-component\n  contentBinding=\"model\"\n  optionLabelPath=\"name\"\n  optionValuePath=\"code\"\n  classNames=\"multi-select-example\"\n  placeholder=\"Select a country...\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Multi-Select <small>Small</small></h3>\n      <div class=\"example-container\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers['multi-select-component'] || (depth0 && depth0['multi-select-component']),options={hash:{
        'contentBinding': ("model"),
        'optionLabelPath': ("name"),
        'optionValuePath': ("code"),
        'classNames': ("multi-select-example"),
        'choicesFieldClass': ("input-xs")
      },hashTypes:{'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'classNames': "STRING",'choicesFieldClass': "STRING"},hashContexts:{'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'classNames': depth0,'choicesFieldClass': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "multi-select-component", options))));
      data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;multi-select-component\n  contentBinding=\"model\"\n  optionLabelPath=\"name\"\n  optionValuePath=\"code\"\n  classNames=\"multi-select-example\"\n  choicesFieldClass=\"input-xs\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/ember-widgets/typeahead", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h2>Typeahead <small> Ember.Widgets.Typeahead</small></h2>\n  <p class=\"elevated\">TBD</p>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n    <p>Soon...</p>\n    </div>\n  </div>\n</div>\n");
      
    });
  });
define("dummy/templates/footer", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Overview &amp; Getting Started");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("API &amp; Documentation");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Accordion");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("Carousel");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("Modal");
      }

    function program11(depth0,data) {
      
      
      data.buffer.push("Popover");
      }

    function program13(depth0,data) {
      
      
      data.buffer.push("Select");
      }

    function program15(depth0,data) {
      
      
      data.buffer.push("Color Picker");
      }

    function program17(depth0,data) {
      
      
      data.buffer.push("Radio Button");
      }

    function program19(depth0,data) {
      
      
      data.buffer.push("License");
      }

      data.buffer.push("\n<div class=\"footer\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Ember Widgets</h6></li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.overview", options) : helperMissing.call(depth0, "link-to", "emberWidgets.overview", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.documentation", options) : helperMissing.call(depth0, "link-to", "emberWidgets.documentation", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Widgets</h6></li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.accordion", options) : helperMissing.call(depth0, "link-to", "emberWidgets.accordion", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Addepar Open Source</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://addepar.github.io/\">Home</a></li>\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "license", options) : helperMissing.call(depth0, "link-to", "license", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>About Addepar</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://www.addepar.com\">www.addepar.com</a></li>\n          <li>\n            <address>\n              <br>\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/446ui\"><strong>Addepar HQ</strong><br>\n              1215 Terra Bella Ave<br>\n              Mountain View, CA 94043</a><br><br>\n\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/xEiCM\"><strong>Addepar NY</strong><br>\n              335 Madison Ave Suite 880<br>\n              New York, NY 10017</a><br>\n            </address>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-12 center-align\">\n        <p>&copy; 2013 Addepar, Inc.</p>\n      </div>\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/modal-footer", 
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
define("dummy/templates/modal", 
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
define("dummy/templates/modal_header", 
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
define("dummy/templates/multi-select-item", 
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
define("dummy/templates/multi-select", 
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
define("dummy/templates/navigation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '';


      data.buffer.push("\n<nav class=\"navbar navbar-transparent addepar-navbar\" role=\"navigation\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n      <span class=\"sr-only\">Toggle navigation</span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"http://addepar.github.io/\">\n      <img id=\"logo_dark\" class=\"logo\" src=\"images/addepar_logo_light.png\" /><span class=\"navbar-title\">Open Source</span>\n    </a>\n  </div>\n\n  <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li><a href=\"http://addepar.github.io/ember-table\">Ember Table</a></li>\n      <li><a href=\"http://addepar.github.io/ember-charts\">Ember Charts</a></li>\n      <li><a href=\"#\">Ember Widgets</a></li>\n    </ul>\n  </div><!-- /.navbar-collapse -->\n</nav>\n");
      return buffer;
      
    });
  });
define("dummy/templates/popover-link-popover", 
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
define("dummy/templates/popover", 
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
define("dummy/templates/radio-button-layout", 
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
define("dummy/templates/select-item-layout", 
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
define("dummy/templates/select-item", 
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
define("dummy/templates/select", 
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
define("dummy/templates/sub-navigation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Overview");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("API &amp; Documentation");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Accordion");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("Carousel");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("Modal");
      }

    function program11(depth0,data) {
      
      
      data.buffer.push("Popover");
      }

    function program13(depth0,data) {
      
      
      data.buffer.push("Select");
      }

    function program15(depth0,data) {
      
      
      data.buffer.push("Color Picker");
      }

    function program17(depth0,data) {
      
      
      data.buffer.push("Radio Button");
      }

      data.buffer.push("\n<div class=\"col-md-2 sub-navigation-sidebar\">\n  <ul class=\"list-unstyled github-navigation\">\n    <li>\n      <a class=\"btn btn-default\" target=\"_BLANK\" href=\"https://github.com/addepar/ember-widgets\">\n        <i class=\"icon-github\"></i> View on GitHub\n      </a>\n    </li>\n    <li>\n      <iframe src=\"http://ghbtns.com/github-btn.html?user=addepar&amp;repo=ember-widgets&amp;type=watch&amp;count=true\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"0\" width=\"130\" height=\"30\"></iframe>\n    </li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Ember Widgets</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.overview", options) : helperMissing.call(depth0, "link-to", "emberWidgets.overview", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.documentation", options) : helperMissing.call(depth0, "link-to", "emberWidgets.documentation", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Examples</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.accordion", options) : helperMissing.call(depth0, "link-to", "emberWidgets.accordion", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n  </ul>\n</div>\n");
      return buffer;
      
    });
  });
define("dummy/templates/view-parent-view-content", 
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
define("dummy/tests/dummy/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/helpers');
    test('dummy/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'dummy/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/helpers');
    test('dummy/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'dummy/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests');
    test('dummy/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'dummy/tests/test-helper.js should pass jshint.'); 
    });
  });
define("dummy/tests/helpers/resolver", 
  ["ember/resolver","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("dummy/tests/helpers/start-app", 
  ["ember","dummy/app","dummy/router","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function() {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("dummy/tests/test-helper", 
  ["dummy/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

    QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
    var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
    document.getElementById('ember-testing-container').style.visibility = containerVisibility;
  });
define("dummy/utils/color-utils", 
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
        return color.toLowerCase();
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
define("dummy/utils/css-transitions", 
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
define("dummy/views/custom-modal-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CustomModalContentView;

    CustomModalContentView = Ember.View.extend({
      templateName: 'custom-modal-content'
    });

    __exports__["default"] = CustomModalContentView;
  });
define("dummy/views/custom-popover-content", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var CustomPopoverContentView;

    CustomPopoverContentView = Ember.View.extend({
      templateName: 'custom-popover-content'
    });

    __exports__["default"] = CustomPopoverContentView;
  });
define("dummy/views/ember-widgets-accordion", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsAccordionView;

    EmberWidgetsAccordionView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsAccordionView;
  });
define("dummy/views/ember-widgets-carousel", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsCarouselView;

    EmberWidgetsCarouselView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsCarouselView;
  });
define("dummy/views/ember-widgets-documentation", 
  ["ember","dummy/views/.mixins/small-hero-affix","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var EmberWidgetsDocumentationView;

    EmberWidgetsDocumentationView = Ember.View.extend(SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsDocumentationView;
  });
define("dummy/views/ember-widgets-modal", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsModalView;

    EmberWidgetsModalView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsModalView;
  });
define("dummy/views/ember-widgets-overview", 
  ["ember","dummy/views/mixins/large-hero-affix","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var LargeHeroAffixMixin = __dependency2__["default"];
    var EmberWidgetsOverviewView;

    EmberWidgetsOverviewView = Ember.View.extend(LargeHeroAffixMixin);

    __exports__["default"] = EmberWidgetsOverviewView;
  });
define("dummy/views/ember-widgets-popover", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsPopoverView;

    EmberWidgetsPopoverView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsPopoverView;
  });
define("dummy/views/ember-widgets-radio-button", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsRadioButtonView;

    EmberWidgetsRadioButtonView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsRadioButtonView;
  });
define("dummy/views/ember-widgets-select", 
  ["ember","dummy/views/.mixins/small-hero-affix","dummy/views/.mixins/code-pretty-print","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SmallHeroAffixMixin = __dependency2__["default"];
    var CodePrettyPrintMixin = __dependency3__["default"];
    var EmberWidgetsSelectView;

    EmberWidgetsSelectView = Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin);

    __exports__["default"] = EmberWidgetsSelectView;
  });
define("dummy/views/multi-select-option", 
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
define("dummy/views/select-option", 
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
/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true});
}

/* jshint ignore:end */
//# sourceMappingURL=dummy.map