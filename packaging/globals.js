var Writer = require('broccoli-writer');
var fs = require('fs');
var path = require('path');
var Promise = require('RSVP').Promise;
var walk = require('walk-sync');

var Globals = function (inputTree) {
  options = {};
  if (!(this instanceof Globals)) {
    return new Globals(inputTree, options);
  }
  this.inputTree = inputTree;
  this.outputPrefix = 'ember-widgets';

  // The old global names aren't consistent: some are on Ember.Widgets, some on
  // Ember.AddeparMixins, and some just on Ember. For backwards-compatibility
  // we need to maintain the same old names.
  // FIXME(igillis): Need to remove the "-component" from some names.
  this.globalNameMapping = {
    'ember-widgets/components/accordion-component': 'Ember.Widgets.AccordionComponent',
    'ember-widgets/components/accordion-item': 'Ember.Widgets.AccordionItem',
    'ember-widgets/components/carousel-component': 'Ember.Widgets.CarouselComponent',
    'ember-widgets/components/carousel-indicator': 'Ember.Widgets.CarouselIndicator',
    'ember-widgets/components/carousel-item': 'Ember.Widgets.CarouselItem',
    'ember-widgets/components/color-picker': 'Ember.Widgets.ColorPicker',
    'ember-widgets/components/color-picker-cell': 'Ember.Widgets.ColorPickerCell',
    'ember-widgets/components/editable-label-component': 'Ember.Widgets.EditableLabel',
    'ember-widgets/components/modal-component': 'Ember.Widgets.ModalComponent',
    'ember-widgets/components/multi-select-component': 'Ember.Widgets.MultiSelectComponent',
    'ember-widgets/components/popover-component': 'Ember.Widgets.PopoverComponent',
    'ember-widgets/components/popover-link-component': 'Ember.Widgets.PopoverLinkComponent',
    'ember-widgets/components/radio-button-component': 'Ember.Widgets.RadioButtonComponent',
    'ember-widgets/components/radio-button-group-component': 'Ember.Widgets.RadioButtonGroupComponent',
    // FIXME(igillis): Should use only `radio-button` in the CLI version, but keep the global
    // name which is set here.
    'ember-widgets/components/radio-button-wrapper-component': 'Ember.Widgets.RadioButtonWrapperComponent',
    'ember-widgets/components/select-component': 'Ember.Widgets.SelectComponent',
    'ember-widgets/components/typeahead-component': 'Ember.Widgets.TypeaheadComponent',
    // FIXME(igillis): Kill text editor
    // FIXME(igillis): What is pill-select?
    // FIXME(igillis): Do we need dom-helper?
    'ember-widgets/mixins/style-bindings': 'Ember.Widgets.StyleBindingsMixin',
    'ember-widgets/mixins/body-event-listener': 'Ember.Widgets.BodyEventListener',
    'ember-widgets/mixins/popover': 'Ember.Widgets.PopoverMixin',
    'ember-widgets/mixins/resize-handler': 'Ember.AddeparMixins.ResizeHandlerMixin',
    'ember-widgets/views/multi-select-option': 'Ember.Widgets.MultiSelectOptionView',
    'ember-widgets/views/select-option': 'Ember.Widgets.SelectOptionView'
  };
};

Globals.prototype = Object.create(Writer.prototype);
Globals.prototype.constructor = Globals;

Globals.prototype.write = function(readTree, destDir) {
  var _this = this;

  this.addLinesToOutput = function(output, lines) {
    lines.forEach(function(line) {
      output.push(line);
    });
  };

  return new Promise(function(resolve) {
    readTree(_this.inputTree).then(function(srcDir) {
      var output = [
        "define('ember', ['exports'], function(__exports__) {",
        "  __exports__['default'] = window.Ember;",
        "});",
        "",
        "window.Ember.Widgets = Ember.Namespace.create();",
        "window.Ember.AddeparMixins = {};"];

      // Get a listing of all hbs files from inputTree and make sure each one
      // is registered on Ember.TEMPLATES
      var templateFiles = walk(srcDir).filter(function(f) {
        return /^templates.*js$/.test(f);
      });
      templateFiles.forEach(function(filename) {
        // Add ember-widgets namespace and remove .js extension
        var filePath = 'ember-widgets/' + filename.slice(0, -3);
        var parts = filePath.split(path.sep);
        output.push("window.Ember.TEMPLATES['" +
            parts.slice(2).join('/') + "']" +
            " = require('" + filePath + "')['default'];");
      });

      // Classes to register on the application's container. We need this
      // because we used to refer to views by their full, global name
      // (Ember.Table.HeaderTableContainer), but now we use the view name
      // (header-table-container). So Ember needs to know where to find those
      // views.
      // FIXME(azirbel/igillis): Not sure if we need this for widgets.
      var toRegister = [];

      // Define globals and register on the container
      for (key in _this.globalNameMapping) {
        // Define the global object, like Ember.Table.EmberTableComponent = ...
        output.push("window." + _this.globalNameMapping[key] +
            " = require('" + key + "')['default'];");
        // Register on the container. We only need to register views and
        // components.
        var type = key.split('/')[1].replace(/s$/, '')
        if (type === 'view' || type === 'component') {
          toRegister.push({
            type: type,
            moduleName: key,
            containerName: key.split('/')[2]
          });
        }
      }

      // On loading the ember application, register all views and components on
      // the application's container
      _this.addLinesToOutput(output, [
        "Ember.onLoad('Ember.Application', function(Application) {",
          "Application.initializer({",
            "name: 'ember-widgets',",
            "initialize: function(container) {"
      ]);
      _this.addLinesToOutput(output, toRegister.map(function(item) {
        return "container.register('" + item.type + ':' + item.containerName +
            "', require('" + item.moduleName + "')['default']);";
        })
      );
      _this.addLinesToOutput(output, [
            "}",
          "});",
        "});"
      ]);

      // For backwards compatibility, set a layoutName so the component
      // actually renders
      // FIXME(azirbel): We need this. Revisit and add it for all components
      // who have a `layoutName`.
      // _this.addLinesToOutput(output, [
      //   "Ember.Widgets.EmberTableComponent.reopen({",
      //   "layoutName: 'components/ember-table'",
      //   "});"
      // ]);

      // Register table-component with handlebars so users can just use
      // {{table-component}}
      // FIXME(azirbel): We need this too. Revisit and add all handlebars
      // helpers with correct names.
      // output.push("Ember.Handlebars.helper('table-component', " +
      //             "Ember.Table.EmberTableComponent);");

      fs.writeFileSync(path.join(destDir, 'globals-output.js'),
          output.join("\n"));
      resolve();
    });
  });
};

module.exports = Globals;
