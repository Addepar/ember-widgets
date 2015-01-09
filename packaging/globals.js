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
  return new Promise(function(resolve) {
    readTree( self.inputTree ).then(function (srcDir) {
      var files = walk(srcDir).filter(function(f){return /\.js$/.test(f);});

      var modules = [];
      var dependencies = [];
      var objectNames = [];
      files.forEach(function(filename) {
        var parts = filename.split(path.sep);
        if (self.topLevels.indexOf(parts[0]) !== -1) {
          var module = [self.outputPrefix].concat(parts).join(path.sep).replace(path.extname(filename), '');
          modules.push("'" + module + "'");
          dependencies.push('__dependency' + (dependencies.length+1) + '__');

          // Component, View, etc
          var objectType = parts[0][0].toUpperCase() + parts[0].substring(1);
          objectType = objectType.replace(/s$/, '');
          // Assumes dasherized and lower case
          var objectName = parts[1].replace(/\.js$/, '').split('-').map(function(s) {
              return s[0].toUpperCase() + s.substring(1);
          }).join('').replace('-', '');
          var typeRegex = new RegExp(objectType+"$");
          if (typeRegex.test(objectName)) {
            objectNames.push(objectName);
          } else {
            objectNames.push(objectName + objectType);
          }
        }
      });
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
