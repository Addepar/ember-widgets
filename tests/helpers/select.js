import { isHidden } from './assertions';
import { mouseDown } from './mouse';

export function openDropdown(element) {
  return click('.dropdown-toggle', element);
}

export function findInChosen(element, itemText) {
  var promise, searchBox, shouldOpenChosen, toggleButton;
  toggleButton = find('.dropdown-toggle', element);
  searchBox = find('.ember-select-search input', element);
  shouldOpenChosen = isHidden(searchBox);
  if (shouldOpenChosen) {
    promise = click(toggleButton);
  } else {
    promise = wait();
  }
  return promise.then(function() {
    return $('li', element).filter(function() {
      return $.text([this]).trim() === itemText;
    });
  });
}

export function findInMultiChosen(element, itemText) {
  var searchBox;
  searchBox = find('input', element);
  click(searchBox);
  return fillIn(searchBox, itemText).then(function() {
    return $('.js-dropdown-menu li', element).filter(function() {
      return $.text([this]).trim() === itemText;
    });
  });
}

export function selectInMultiChosen(element, itemText) {
  return findInMultiChosen(element, itemText).then(function(item) {
    return click(item);
  });
}

export function selectFirstInMultiChosen(element) {
  var searchBox;
  searchBox = find('input', element);
  click(searchBox);
  return click($('.ember-select-result-item', element)[0]);
}

export function selectInChosen(app, element, itemText) {
  return findInChosen(element, itemText).then(function(item) {
    return click(item);
  });
}

export function findInSelect(element, itemText) {
  var toggleButton;
  toggleButton = find('a', element);
  return mouseDown(toggleButton).then(function() {
    var item;
    item = $('li', element).filter(function() {
      return $.text([this]).trim() === itemText;
    });
    return click(item);
  });
}
