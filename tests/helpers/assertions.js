
var isPresent = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.length > 0;
};

var isNotPresent = function(app, selector, context) {
  return !isPresent(app, selector, context);
};

var isVisible = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':visible');
};

var isFocused = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':focus');
};

var isHidden = function(app, selector, context) {
  return !isVisible(app, selector, context);
};

export {
  isPresent,
  isNotPresent,
  isVisible,
  isFocused,
  isHidden
};
