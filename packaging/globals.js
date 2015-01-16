var Writer = require('broccoli-writer'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('RSVP').Promise,
    walk = require('walk-sync');


var Globals = function ( inputTree, options ) {
  if (!options) {
    options = {};
  }
  if ( !( this instanceof Globals ) ) {
    return new Globals( inputTree, options );
  }
  this.inputTree = inputTree;
  this.outputPrefix = 'app';
  // Generates global objects for files in these folders
  this.topLevels = options.topLevels || [
    'views',
    'components',
    'utils',
    'mixins',
    'controllers'
  ];
};

Globals.prototype = Object.create( Writer.prototype );
Globals.prototype.constructor = Globals;

Globals.prototype.write = function (readTree, destDir) {
  var self = this;

  self.capitalize = function(s) {
    return s[0].toUpperCase() + s.substring(1);
  };

  return new Promise(function(resolve) {
    readTree( self.inputTree ).then(function (srcDir) {
      var files = walk(srcDir).filter(function(f){return /\.js$/.test(f);});

      /*
       * The general idea here is, for all files in the self.topLevels dirs,
       * generate an AMD module that, when required, will export a global
       * object with the default export of that file named based on the
       * filename.
       *
       * TODO: see if some of the string manipulation here can be handled by
       * Ember? Assuming we can import it at this point. I'm not sure we can.
       */
      var modules = [];
      var dependencies = [];
      var objectNames = [];
      console.log(self.capitalize);
      files.forEach(function(filename) {
        var parts = filename.split(path.sep);
        if (self.topLevels.indexOf(parts[0]) !== -1) {
          // the file name minus extension, or, the thing that should
          // be listed as a module name
          var module = [self.outputPrefix]
            .concat(parts)
            .join(path.sep)
            .replace(path.extname(filename), '');

          modules.push("'" + module + "'");
          dependencies.push('__dependency' + (dependencies.length+1) + '__');

           /*
            * Component, View, etc
            * Take the folder name, capitalize the first letter, and remove the
            * pluralization
            */
          var objectType = self.capitalize(parts[0]).replace(/s$/, '');

          /*
           * Converts from foo-bar-baz to FooBarBaz
           *   Assumes file name is dasherized and lower case
           *   Take the file name, strip the extension, tokenize by the hyphen,
           *   for each token capitalize the first character and join.
           */
          var objectName = parts[1]
            .replace(path.extname(filename), '')
            .split('-')
            .map(self.capitalize)
            .join('')
            .replace('-', '');

          /*
           * Right now, some file names are like 'select-component', and we
           * don't want to output SelectComponentComponent, so we strip one
           * 'Component'.
           *
           * The reason they're like this is so that they can have
           * dashes in the file name as per Ember requirements.
           */
          var typeRegex = new RegExp(objectType+"$");
          if (typeRegex.test(objectName)) {
            objectNames.push(objectName);
          } else {
            objectNames.push(objectName + objectType);
          }
        }
      });
      console.log(modules, dependencies, objectNames);
      // build the actual amd module
      var output = ["define('globals', [" + modules.join(",\n") + ", \"exports\"], function(" +
        dependencies.join(",\n") + ", __exports__) {"];
      objectNames.forEach(function(objName, i){
        output.push("window.Ember.Widgets."+objName+" = "+dependencies[i]+"['default'];");
      });
      output.push("__exports__['default'] = window.Ember.Widgets;");
      output.push("});");
      fs.writeFileSync(path.join(destDir, 'globals-output.js'), output.join("\n"));
      resolve();
    });
  });
};

module.exports = Globals;
