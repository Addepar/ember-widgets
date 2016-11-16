import Ember from 'ember';

export function mouseDown(selector, context) {
  var $element;
  $element = find(selector, context);
  Ember.run(function() {
    return $element.mousedown();
  });
  return wait();
}
