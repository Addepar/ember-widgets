import Ember from 'ember';

var _pressEnter, _pressSpacebar, _pressESC,
  _pressUpArrow, _pressDownArrow, _pressBackspace;

_pressEnter = function(app, element) {
  return keyEvent(element, 'keydown', 13);
};

_pressSpacebar = function(app, element) {
  return keyEvent(element, 'keydown', 32);
};

_pressESC = function(app, element) {
  return keyEvent(element, 'keydown', 27);
};

_pressUpArrow = function(app, element) {
  return keyEvent(element, 'keydown', 38);
};

_pressDownArrow = function(app, element) {
  return keyEvent(element, 'keydown', 40);
};

_pressBackspace = function(app, element) {
  return keyEvent(element, 'keydown', 8);
};

Ember.Test.registerAsyncHelper('pressEnter', _pressEnter);
Ember.Test.registerAsyncHelper('pressSpacebar', _pressSpacebar);
Ember.Test.registerAsyncHelper('pressESC', _pressESC);
Ember.Test.registerAsyncHelper('pressUpArrow', _pressUpArrow);
Ember.Test.registerAsyncHelper('pressDownArrow', _pressDownArrow);
Ember.Test.registerAsyncHelper('pressBackspace', _pressBackspace);
