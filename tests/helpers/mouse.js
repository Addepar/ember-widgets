import Ember from 'ember';

var _mouseDown = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  Ember.run(function() {
    return $element.mousedown();
  });
  return wait(app);
};

Ember.Test.registerHelper('mouseDown', _mouseDown);
