export function isPresent(selector, context) {
  var $element;
  $element = find(selector, context);
  return $element.length > 0;
}

export function isNotPresent(selector, context) {
  return !isPresent(selector, context);
}

export function isVisible(selector, context) {
  var $element;
  $element = find(selector, context);
  return $element !== false && $element.is(':visible');
}

export function isFocused(selector, context) {
  var $element;
  $element = find(selector, context);
  return $element !== false && document.activeElement === $element[0];
}

export function isHidden(selector, context) {
  return !isVisible(selector, context);
}
