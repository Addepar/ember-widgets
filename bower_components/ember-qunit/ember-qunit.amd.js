define('ember-qunit', ['exports', 'ember-qunit/module-for', 'ember-qunit/module-for-component', 'ember-qunit/module-for-model', 'ember-qunit/test', 'ember-test-helpers'], function (exports, moduleFor, moduleForComponent, moduleForModel, test, ember_test_helpers) {

  'use strict';



  exports.moduleFor = moduleFor['default'];
  exports.moduleForComponent = moduleForComponent['default'];
  exports.moduleForModel = moduleForModel['default'];
  exports.test = test['default'];
  exports.setResolver = ember_test_helpers.setResolver;

});
define('ember-qunit/module-for-component', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleForComponent(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModuleForComponent, name, description, callbacks);
  }
  exports['default'] = moduleForComponent;

});
define('ember-qunit/module-for-model', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleForModel(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModuleForModel, name, description, callbacks);
  }
  exports['default'] = moduleForModel;

});
define('ember-qunit/module-for', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, qunit_module, ember_test_helpers) {

  'use strict';

  function moduleFor(name, description, callbacks) {
    qunit_module.createModule(ember_test_helpers.TestModule, name, description, callbacks);
  }
  exports['default'] = moduleFor;

});
define('ember-qunit/qunit-module', ['exports', 'qunit'], function (exports, qunit) {

  'use strict';

  exports.createModule = createModule;

  function beforeEachCallback(callbacks) {
    if (typeof callbacks !== 'object') { return; }
    if (!callbacks) { return; }

    var beforeEach;
    
    if (callbacks.setup) {
      beforeEach = callbacks.setup;
      delete callbacks.setup;
    }

    if (callbacks.beforeEach) {
      beforeEach = callbacks.beforeEach;
      delete callbacks.beforeEach;
    }

    return beforeEach;
  }

  function afterEachCallback(callbacks) {
    if (typeof callbacks !== 'object') { return; }
    if (!callbacks) { return; }

    var afterEach;

    if (callbacks.teardown) {
      afterEach = callbacks.teardown;
      delete callbacks.teardown;
    }

    if (callbacks.afterEach) {
      afterEach = callbacks.afterEach;
      delete callbacks.afterEach;
    }

    return afterEach;
  }

  function createModule(Constructor, name, description, callbacks) {
    var beforeEach = beforeEachCallback(callbacks || description);
    var afterEach  = afterEachCallback(callbacks || description);

    var module = new Constructor(name, description, callbacks);

    qunit.module(module.name, {
      setup: function(assert) {
        var done = assert.async();
        module.setup().then(function() {
          if (beforeEach) {
            beforeEach.call(module.context, assert);
          }
        })['finally'](done);
      },

      teardown: function(assert) {
        if (afterEach) {
          afterEach.call(module.context, assert);
        }
        var done = assert.async();
        module.teardown()['finally'](done);
      }
    });
  }

});
define('ember-qunit/test', ['exports', 'ember', 'ember-test-helpers', 'qunit'], function (exports, Ember, ember_test_helpers, qunit) {

  'use strict';

  function test(testName, callback) {
    function wrapper(assert) {
      var context = ember_test_helpers.getContext();

      var result = callback.call(context, assert);

      function failTestOnPromiseRejection(reason) {
        var message;
        if (reason instanceof Error) {
          message = reason.stack;
        } else {
          message = Ember['default'].inspect(reason);
        }
        ok(false, message);
      }

      Ember['default'].run(function(){
        QUnit.stop();
        Ember['default'].RSVP.Promise.resolve(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
      });
    }

    qunit.test(testName, wrapper);
  }
  exports['default'] = test;

});
define('ember-test-helpers', ['exports', 'ember', 'ember-test-helpers/isolated-container', 'ember-test-helpers/test-module', 'ember-test-helpers/test-module-for-component', 'ember-test-helpers/test-module-for-model', 'ember-test-helpers/test-context', 'ember-test-helpers/test-resolver'], function (exports, Ember, isolated_container, TestModule, TestModuleForComponent, TestModuleForModel, test_context, test_resolver) {

  'use strict';

  Ember['default'].testing = true;

  exports.isolatedContainer = isolated_container.isolatedContainer;
  exports.TestModule = TestModule['default'];
  exports.TestModuleForComponent = TestModuleForComponent['default'];
  exports.TestModuleForModel = TestModuleForModel['default'];
  exports.getContext = test_context.getContext;
  exports.setContext = test_context.setContext;
  exports.setResolver = test_resolver.setResolver;

});
define('ember-test-helpers/isolated-container', ['exports', 'ember-test-helpers/test-resolver', 'ember'], function (exports, test_resolver, Ember) {

  'use strict';

  exports.isolatedRegistry = isolatedRegistry;
  exports.isolatedContainer = isolatedContainer;

  function exposeRegistryMethodsWithoutDeprecations(container) {
    var methods = [
      'register',
      'unregister',
      'resolve',
      'normalize',
      'typeInjection',
      'injection',
      'factoryInjection',
      'factoryTypeInjection',
      'has',
      'options',
      'optionsForType'
    ];

    function exposeRegistryMethod(container, method) {
      container[method] = function() {
        return container._registry[method].apply(container._registry, arguments);
      };
    }

    for (var i = 0, l = methods.length; i < l; i++) {
      exposeRegistryMethod(container, methods[i]);
    }
  }

  function isolatedRegistry(fullNames) {
    var resolver = test_resolver.getResolver();
    var container;
    var registry;

    var normalize = function(fullName) {
      return resolver.normalize(fullName);
    };

    if (Ember['default'].Registry) {
      registry = new Ember['default'].Registry();
      registry.normalizeFullName = normalize;

      container = registry.container();
      exposeRegistryMethodsWithoutDeprecations(container);

    } else {
      container = new Ember['default'].Container();

      //normalizeFullName only exists since Ember 1.9
      if (Ember['default'].typeOf(container.normalizeFullName) === 'function') {
        container.normalizeFullName = normalize;
      } else {
        container.normalize = normalize;
      }
    }

    container.optionsForType('component', { singleton: false });
    container.optionsForType('view', { singleton: false });
    container.optionsForType('template', { instantiate: false });
    container.optionsForType('helper', { instantiate: false });
    container.register('component-lookup:main', Ember['default'].ComponentLookup);
    container.register('controller:basic', Ember['default'].Controller, { instantiate: false });
    container.register('controller:object', Ember['default'].ObjectController, { instantiate: false });
    container.register('controller:array', Ember['default'].ArrayController, { instantiate: false });
    container.register('view:default', Ember['default']._MetamorphView);
    container.register('view:toplevel', Ember['default'].View.extend());
    container.register('view:select', Ember['default'].Select);
    container.register('route:basic', Ember['default'].Route, { instantiate: false });

    // added in Glimmer
    container.register('component:-link-to', Ember['default'].LinkView);
    container.register('component:-text-field', Ember['default'].TextField);
    container.register('component:-text-area', Ember['default'].TextArea);
    container.register('component:-checkbox', Ember['default'].Checkbox);

    if (Ember['default']._LegacyEachView) {
      container.register('view:-legacy-each', Ember['default']._LegacyEachView);
    }

    var globalContext = typeof global === 'object' && global || self;
    if (globalContext.DS) {
      var DS = globalContext.DS;
      if (DS._setupContainer) {
        DS._setupContainer(container);
      } else {
        container.register('transform:boolean', DS.BooleanTransform);
        container.register('transform:date', DS.DateTransform);
        container.register('transform:number', DS.NumberTransform);
        container.register('transform:string', DS.StringTransform);
        container.register('serializer:-default', DS.JSONSerializer);
        container.register('serializer:-rest', DS.RESTSerializer);
        container.register('adapter:-rest', DS.RESTAdapter);
      }
    }

    for (var i = fullNames.length; i > 0; i--) {
      var fullName = fullNames[i - 1];
      var normalizedFullName = resolver.normalize(fullName);
      container.register(fullName, resolver.resolve(normalizedFullName));
    }
    return {
      container: container,
      registry: registry
    };
  }

  function isolatedContainer(fullNames) {
    return isolatedRegistry(fullNames).container;
  }

});
define('ember-test-helpers/test-context', ['exports'], function (exports) {

  'use strict';

  exports.setContext = setContext;
  exports.getContext = getContext;

  var __test_context__;

  function setContext(context) {
    __test_context__ = context;
  }

  function getContext() {
    return __test_context__;
  }

});
define('ember-test-helpers/test-module-for-component', ['exports', 'ember-test-helpers/test-module', 'ember', 'ember-test-helpers/test-resolver'], function (exports, TestModule, Ember, test_resolver) {

  'use strict';

  exports['default'] = TestModule['default'].extend({
    init: function(componentName, description, callbacks) {
      // Allow `description` to be omitted
      if (!callbacks && typeof description === 'object') {
        callbacks = description;
        description = null;
      } else if (!callbacks && !description) {
        callbacks = {};
      }

      this.componentName = componentName;

      if (callbacks.needs || callbacks.unit || callbacks.integration === false) {
        this.isUnitTest = true;
      } else if (callbacks.integration) {
        this.isUnitTest = false;
      } else {
        Ember['default'].deprecate("the component:" + componentName + " test module is implicitly running in unit test mode, which will change to integration test mode by default in an upcoming version of ember-test-helpers. Add `unit: true` or a `needs:[]` list to explicitly opt in to unit test mode.");
        this.isUnitTest = true;
      }

      if (!this.isUnitTest) {
        callbacks.integration = true;
      }

      if (description) {
        this._super.call(this, 'component:' + componentName, description, callbacks);
      } else {
        this._super.call(this, 'component:' + componentName, callbacks);
      }

      if (this.isUnitTest) {
        this.setupSteps.push(this.setupComponentUnitTest);
      } else {
        this.callbacks.subject = function() {
          throw new Error("component integration tests do not support `subject()`.");
        };
        this.setupSteps.push(this.setupComponentIntegrationTest);
        this.teardownSteps.push(this.teardownComponent);
      }
    },

    setupComponentUnitTest: function() {
      var _this = this;
      var resolver = test_resolver.getResolver();
      var container = this.container;
      var context = this.context;

      var layoutName = 'template:components/' + this.componentName;

      var layout = resolver.resolve(layoutName);

      if (layout) {
        container.register(layoutName, layout);
        container.injection(this.subjectName, 'layout', layoutName);
      }

      context.dispatcher = Ember['default'].EventDispatcher.create();
      context.dispatcher.setup({}, '#ember-testing');

      this.callbacks.render = function() {
        var containerView = Ember['default'].ContainerView.create({container: container});
        Ember['default'].run(function(){
          var subject = context.subject();
          containerView.pushObject(subject);
          containerView.appendTo('#ember-testing');
        });

        _this.teardownSteps.unshift(function() {
          Ember['default'].run(function() {
            Ember['default'].tryInvoke(containerView, 'destroy');
          });
        });
      };

      this.callbacks.append = function() {
        Ember['default'].deprecate('this.append() is deprecated. Please use this.render() or this.$() instead.');
        return context.$();
      };

      context.$ = function() {
        this.render();
        var subject = this.subject();

        return subject.$.apply(subject, arguments);
      };
    },

    setupComponentIntegrationTest: function() {
      var self = this;
      var context = this.context;
      context.dispatcher = Ember['default'].EventDispatcher.create();
      context.dispatcher.setup({}, '#ember-testing');
      this.actionHooks = {};

      context.render = function(template) {
        if (!template) {
          throw new Error("in a component integration test you must pass a template to `render()`");
        }
        if (Ember['default'].isArray(template)) {
          template = template.join('');
        }
        if (typeof template === 'string') {
          template = Ember['default'].Handlebars.compile(template);
        }
        self.component = Ember['default'].View.create({
          context: context,
          controller: self,
          template: template,
          container: self.container
        });
        Ember['default'].run(function() {
          self.component.appendTo('#ember-testing');
        });
      };

      context.$ = function() {
        return self.component.$.apply(self.component, arguments);
      };

      context.set = function(key, value) {
        Ember['default'].run(function() {
          Ember['default'].set(context, key, value);
        });
      };

      context.get = function(key) {
        return Ember['default'].get(context, key);
      };

      context.on = function(actionName, handler) {
        self.actionHooks[actionName] = handler;
      };

    },

    setupContext: function() {
      this._super.call(this);
      if (!this.isUnitTest) {
        this.context.factory = function() {};
      }
    },


    send: function(actionName) {
      var hook = this.actionHooks[actionName];
      if (!hook) {
        throw new Error("integration testing template received unexpected action " + actionName);
      }
      hook.apply(this, Array.prototype.slice.call(arguments, 1));
    },

    teardownComponent: function() {
      var component = this.component;
      if (component) {
        Ember['default'].run(function() {
          component.destroy();
        });
      }
    }


  });

});
define('ember-test-helpers/test-module-for-model', ['exports', 'ember-test-helpers/test-module', 'ember'], function (exports, TestModule, Ember) {

  'use strict';

  exports['default'] = TestModule['default'].extend({
    init: function(modelName, description, callbacks) {
      this.modelName = modelName;

      this._super.call(this, 'model:' + modelName, description, callbacks);

      this.setupSteps.push(this.setupModel);
    },

    setupModel: function() {
      var container = this.container;
      var defaultSubject = this.defaultSubject;
      var callbacks = this.callbacks;
      var modelName = this.modelName;

      var adapterFactory = container.lookupFactory('adapter:application');
      if (!adapterFactory) {
        container.register('adapter:application', DS.FixtureAdapter);
      }

      callbacks.store = function(){
        var container = this.container;

        return container.lookup('store:main');
      };

      if (callbacks.subject === defaultSubject) {
        callbacks.subject = function(options) {
          var container = this.container;

          return Ember['default'].run(function() {
            return container.lookup('store:main').createRecord(modelName, options);
          });
        };
      }
    }
  });

});
define('ember-test-helpers/test-module', ['exports', 'ember', 'ember-test-helpers/isolated-container', 'ember-test-helpers/test-context', 'klassy', 'ember-test-helpers/test-resolver'], function (exports, Ember, isolated_container, test_context, klassy, test_resolver) {

  'use strict';

  exports['default'] = klassy.Klass.extend({
    init: function(subjectName, description, callbacks) {
      // Allow `description` to be omitted, in which case it should
      // default to `subjectName`
      if (!callbacks && typeof description === 'object') {
        callbacks = description;
        description = subjectName;
      }

      this.subjectName = subjectName;
      this.description = description || subjectName;
      this.name = description || subjectName;
      this.callbacks = callbacks || {};

      if (this.callbacks.integration) {
        this.isIntegration = callbacks.integration;      
        delete callbacks.integration;
      }

      this.initSubject();
      this.initNeeds();
      this.initSetupSteps();
      this.initTeardownSteps();
    },

    initSubject: function() {
      this.callbacks.subject = this.callbacks.subject || this.defaultSubject;
    },

    initNeeds: function() {
      this.needs = [this.subjectName];
      if (this.callbacks.needs) {
        this.needs = this.needs.concat(this.callbacks.needs)
        delete this.callbacks.needs;
      }
    },

    initSetupSteps: function() {
      this.setupSteps = [];
      this.contextualizedSetupSteps = [];

      if (this.callbacks.beforeSetup) {
        this.setupSteps.push( this.callbacks.beforeSetup );
        delete this.callbacks.beforeSetup;
      }

      this.setupSteps.push(this.setupContainer);
      this.setupSteps.push(this.setupContext);
      this.setupSteps.push(this.setupTestElements);

      if (this.callbacks.setup) {
        this.contextualizedSetupSteps.push( this.callbacks.setup );
        delete this.callbacks.setup;
      }
    },

    initTeardownSteps: function() {
      this.teardownSteps = [];
      this.contextualizedTeardownSteps = [];

      if (this.callbacks.teardown) {
        this.contextualizedTeardownSteps.push( this.callbacks.teardown );
        delete this.callbacks.teardown;
      }

      this.teardownSteps.push(this.teardownSubject);
      this.teardownSteps.push(this.teardownContainer);
      this.teardownSteps.push(this.teardownContext);
      this.teardownSteps.push(this.teardownTestElements);

      if (this.callbacks.afterTeardown) {
        this.teardownSteps.push( this.callbacks.afterTeardown );
        delete this.callbacks.afterTeardown;
      }
    },

    setup: function() {
      var self = this;
      return self.invokeSteps(self.setupSteps).then(function() {
        self.contextualizeCallbacks();
        return self.invokeSteps(self.contextualizedSetupSteps, self.context);
      });
    },

    teardown: function() {
      var self = this;
      return self.invokeSteps(self.contextualizedTeardownSteps, self.context).then(function() {
        return self.invokeSteps(self.teardownSteps);
      }).then(function() {
        self.cache = null;
        self.cachedCalls = null;
      });
    },

    invokeSteps: function(steps, _context) {
      var context = _context;
      if (!context) {
        context = this;
      }
      steps = steps.slice();
      function nextStep() {
        var step = steps.shift();
        if (step) {
          return Ember['default'].RSVP.resolve(step.call(context)).then(nextStep);
        } else {
          return Ember['default'].RSVP.resolve();
        }
      }
      return nextStep();
    },

    setupContainer: function() {
      if (this.isIntegration) {
        this._setupIntegratedContainer();
      } else {
        this._setupIsolatedContainer();
      }
    },

    setupContext: function() {
      var subjectName = this.subjectName;
      var container = this.container;

      var factory = function() {
        return container.lookupFactory(subjectName);
      };

      test_context.setContext({
        container:  this.container,
        registry: this.registry,
        factory:    factory,
        dispatcher: null
      });

      this.context = test_context.getContext();
    },

    setupTestElements: function() {
      if (Ember['default'].$('#ember-testing').length === 0) {
        Ember['default'].$('<div id="ember-testing"/>').appendTo(document.body);
      }
    },

    teardownSubject: function() {
      var subject = this.cache.subject;

      if (subject) {
        Ember['default'].run(function() {
          Ember['default'].tryInvoke(subject, 'destroy');
        });
      }
    },

    teardownContainer: function() {
      var container = this.container;
      Ember['default'].run(function() {
        container.destroy();
      });
    },

    teardownContext: function() {
      var context = this.context;
      if (context.dispatcher) {
        Ember['default'].run(function() {
          context.dispatcher.destroy();
        });
      }
    },

    teardownTestElements: function() {
      Ember['default'].$('#ember-testing').empty();
      Ember['default'].View.views = {};
    },

    defaultSubject: function(options, factory) {
      return factory.create(options);
    },

    // allow arbitrary named factories, like rspec let
    contextualizeCallbacks: function() {
      var _this     = this;
      var callbacks = this.callbacks;
      var context   = this.context;
      var factory   = context.factory;

      this.cache = this.cache || {};
      this.cachedCalls = this.cachedCalls || {};

      var keys = Ember['default'].keys(callbacks);

      for (var i = 0, l = keys.length; i < l; i++) {
        (function(key) {

          context[key] = function(options) {
            if (_this.cachedCalls[key]) { return _this.cache[key]; }

            var result = callbacks[key].call(_this, options, factory());

            _this.cache[key] = result;
            _this.cachedCalls[key] = true;

            return result;
          };

        })(keys[i]);
      }
    },


    _setupIsolatedContainer: function() {
      var isolated = isolated_container.isolatedRegistry(this.needs);
      this.container = isolated.container;
      this.registry = isolated.registry;
    },

    _setupIntegratedContainer: function() {
      var resolver = test_resolver.getResolver();
      var namespace = Ember['default'].Object.create({
        Resolver: { create: function() { return resolver; } }
      });

      if (Ember['default'].Application.buildRegistry) {
        var registry;
        registry = Ember['default'].Application.buildRegistry(namespace);
        registry.register('component-lookup:main', Ember['default'].ComponentLookup);
        this.registry = registry;
        this.container = registry.container();
      } else {
        this.container = Ember['default'].Application.buildContainer(namespace);
        this.container.register('component-lookup:main', Ember['default'].ComponentLookup);
      }
    }

  });

});
define('ember-test-helpers/test-resolver', ['exports'], function (exports) {

  'use strict';

  exports.setResolver = setResolver;
  exports.getResolver = getResolver;

  var __resolver__;

  function setResolver(resolver) {
    __resolver__ = resolver;
  }

  function getResolver() {
    if (__resolver__ == null) throw new Error('you must set a resolver with `testResolver.set(resolver)`');
    return __resolver__;
  }

});
define('klassy', ['exports'], function (exports) {

  'use strict';

  /**
   Extend a class with the properties and methods of one or more other classes.

   When a method is replaced with another method, it will be wrapped in a
   function that makes the replaced method accessible via `this._super`.

   @method extendClass
   @param {Object} destination The class to merge into
   @param {Object} source One or more source classes
   */
  var extendClass = function(destination) {
    var sources = Array.prototype.slice.call(arguments, 1);
    var source;

    for (var i = 0, l = sources.length; i < l; i++) {
      source = sources[i];

      for (var p in source) {
        if (source.hasOwnProperty(p) &&
          destination[p] &&
          typeof destination[p] === 'function' &&
          typeof source[p] === 'function') {

          /* jshint loopfunc:true */
          destination[p] =
            (function(destinationFn, sourceFn) {
              var wrapper = function() {
                var prevSuper = this._super;
                this._super = destinationFn;

                var ret = sourceFn.apply(this, arguments);

                this._super = prevSuper;

                return ret;
              };
              wrapper.wrappedFunction = sourceFn;
              return wrapper;
            })(destination[p], source[p]);

        } else {
          destination[p] = source[p];
        }
      }
    }
  };

  // `subclassing` is a state flag used by `defineClass` to track when a class is
  // being subclassed. It allows constructors to avoid calling `init`, which can
  // be expensive and cause undesirable side effects.
  var subclassing = false;

  /**
   Define a new class with the properties and methods of one or more other classes.

   The new class can be based on a `SuperClass`, which will be inserted into its
   prototype chain.

   Furthermore, one or more mixins (object that contain properties and/or methods)
   may be specified, which will be applied in order. When a method is replaced
   with another method, it will be wrapped in a function that makes the previous
   method accessible via `this._super`.

   @method defineClass
   @param {Object} SuperClass A base class to extend. If `mixins` are to be included
   without a `SuperClass`, pass `null` for SuperClass.
   @param {Object} mixins One or more objects that contain properties and methods
   to apply to the new class.
   */
  var defineClass = function(SuperClass) {
    var Klass = function() {
      if (!subclassing && this.init) {
        this.init.apply(this, arguments);
      }
    };

    if (SuperClass) {
      subclassing = true;
      Klass.prototype = new SuperClass();
      subclassing = false;
    }

    if (arguments.length > 1) {
      var extendArgs = Array.prototype.slice.call(arguments, 1);
      extendArgs.unshift(Klass.prototype);
      extendClass.apply(Klass.prototype, extendArgs);
    }

    Klass.constructor = Klass;

    Klass.extend = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(Klass);
      return defineClass.apply(Klass, args);
    };

    return Klass;
  };

  /**
   A base class that can be extended.

   @example

   ```javascript
   var CelestialObject = Klass.extend({
     init: function(name) {
       this._super();
       this.name = name;
       this.isCelestialObject = true;
     },
     greeting: function() {
       return 'Hello from ' + this.name;
     }
   });

   var Planet = CelestialObject.extend({
     init: function(name) {
       this._super.apply(this, arguments);
       this.isPlanet = true;
     },
     greeting: function() {
       return this._super() + '!';
     },
   });

   var earth = new Planet('Earth');

   console.log(earth instanceof Klass);           // true
   console.log(earth instanceof CelestialObject); // true
   console.log(earth instanceof Planet);          // true

   console.log(earth.isCelestialObject);          // true
   console.log(earth.isPlanet);                   // true

   console.log(earth.greeting());                 // 'Hello from Earth!'
   ```

   @class Klass
   */
  var Klass = defineClass(null, {
    init: function() {}
  });

  exports.Klass = Klass;
  exports.defineClass = defineClass;
  exports.extendClass = extendClass;

});
define('qunit', ['exports'], function (exports) {

	'use strict';

	/* globals test:true */

	var module = QUnit.module;
	var test = QUnit.test;
	var skip = QUnit.skip;

	exports['default'] = QUnit;

	exports.module = module;
	exports.test = test;
	exports.skip = skip;

});//# sourceMappingURL=ember-qunit.amd.map