import Ember from 'ember';

var _findInChosen, _findInMultiChosen, _findInSelect, _openDropdown, _selectFirstInMultiChosen, _selectInChosen, _selectInMultiChosen;

_openDropdown = function(app, element) {
  return click('.dropdown-toggle', element);
};

_findInChosen = function(app, element, itemText) {
  var promise, searchBox, shouldOpenChosen, toggleButton;
  toggleButton = find('.dropdown-toggle', element);
  searchBox = find('.ember-select-search input', element);
  shouldOpenChosen = isHidden(app, searchBox);
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
};

_findInMultiChosen = function(app, element, itemText) {
  var searchBox;
  searchBox = find('input', element);
  click(searchBox);
  return fillIn(searchBox, itemText).then(function() {
    return $('.js-dropdown-menu li', element).filter(function() {
      return $.text([this]).trim() === itemText;
    });
  });
};

_selectInMultiChosen = function(app, element, itemText) {
  return findInMultiChosen(element, itemText).then(function(item) {
    return click(item);
  });
};

_selectFirstInMultiChosen = function(app, element) {
  var searchBox;
  searchBox = find('input', element);
  click(searchBox);
  return click($('.ember-select-result-item', element)[0]);
};

_selectInChosen = function(app, element, itemText) {
  return findInChosen(element, itemText).then(function(item) {
    return click(item);
  });
};

_findInSelect = function(app, element, itemText) {
  var toggleButton;
  toggleButton = find('a', element);
  return mouseDown(toggleButton).then(function() {
    var item;
    item = $('li', element).filter(function() {
      return $.text([this]).trim() === itemText;
    });
    return click(item);
  });
};

Ember.Test.registerHelper('openDropdown', _openDropdown);
Ember.Test.registerHelper('findInChosen', _findInChosen);
Ember.Test.registerHelper('findInMultiChosen', _findInMultiChosen);
Ember.Test.registerHelper('selectInMultiChosen', _selectInMultiChosen);
Ember.Test.registerHelper('selectFirstInMultiChosen', _selectFirstInMultiChosen);
Ember.Test.registerHelper('selectInChosen', _selectInChosen);
Ember.Test.registerHelper('findInSelect', _findInSelect);
