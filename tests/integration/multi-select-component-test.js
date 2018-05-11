import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';

import {
  isVisible,
  isHidden,
  isFocused,
  isPresent,
  isNotPresent
} from '../helpers/assertions';

import {
  pressBackspace,
  pressEnter,
  pressEsc,
  pressSpacebar
} from '../helpers/keyboard';

import {
  findInMultiChosen,
  selectInMultiChosen
} from '../helpers/select';

var content = [
  {
    name: 'Alice',
    code: 'ALICE'
  }, {
    name: 'Bob',
    code: 'BOB'
  }
];

var multiSelect, app;

moduleForComponent('multi-select-component', '[Integration] Multi select component', {
  needs: ['template:multi-select', 'template:multi-select-item', 'template:select-item-layout', 'template:select-item'],

  setup: function() {
    app = startApp();
  },

  teardown: function() {
    Ember.run(function() {
      return multiSelect.destroy();
    });
    Ember.run(app, 'destroy');
    return multiSelect = null;
  }
});

test('Test preparedContent after some options are already selected', function(assert) {
  assert.expect(2);
  multiSelect = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  multiSelect.set('selections', ['bar', 'baz']);
  multiSelect.set('query', 'ba');
  assert.equal(multiSelect.get('preparedContent').length, 1);
  return assert.equal(multiSelect.get('preparedContent')[0], 'barca');
});

test('Query should not be reset on select if resetQueryOnSelect is false', function(assert) {
  assert.expect(1);
  multiSelect = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  multiSelect.set('resetQueryOnSelect', false);
  multiSelect.set('query', 'ba');
  multiSelect.set('selections', ['bar', 'baz']);
  return assert.equal(multiSelect.get('query'), 'ba');
});

test('Query should be reset on select if resetQueryOnSelect is true', function(assert) {
  assert.expect(1);
  multiSelect = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  multiSelect.set('resetQueryOnSelect', true);
  multiSelect.set('query', 'ba');
  multiSelect.set('selections', ['bar', 'baz']);
  return assert.equal(multiSelect.get('query'), '');
});

test('Test keyboard and mouse interaction', function(assert) {
  var highlightedComponent, multiSelectComponent, selectedText, textField, validateDropdownHidden, validateDropdownVisible, validateTextFieldFocus;
  assert.expect(15);
  selectedText = null;
  multiSelect = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  this.append();
  multiSelectComponent = multiSelect.$();
  highlightedComponent = find('.ember-select-multi', multiSelectComponent);
  textField = find('.ember-text-field', multiSelectComponent);
  validateDropdownVisible = function(messageVisible) {
    return assert.ok(isVisible(find('.ember-select-results', multiSelectComponent)), messageVisible);
  };
  validateDropdownHidden = function(messageHidden) {
    return assert.ok(isHidden(find('.ember-select-results', multiSelectComponent)), messageHidden);
  };
  validateTextFieldFocus = function(messageFocus) {
    return assert.ok(isFocused(textField, multiSelectComponent), messageFocus);
  };
  multiSelectComponent.focus();
  pressEnter(multiSelectComponent);
  andThen(function() {
    var resultItems;
    validateDropdownVisible('Dropdown list should appear after pressing Enter');
    resultItems = find('.ember-select-result-item', multiSelectComponent);
    assert.ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
    return selectedText = $(resultItems[0]).text().trim();
  });
  pressEnter(multiSelectComponent);
  andThen(function() {
    var currentText, resultItems;
    validateTextFieldFocus('Text field should still be focused after selecting using Enter');
    resultItems = find('.ember-select-search-choice', multiSelectComponent);
    currentText = $(resultItems[resultItems.length - 1]).text().trim();
    currentText = currentText.replace(/\n/g, '').replace(/×$/, '');
    return assert.equal(currentText, selectedText, 'The current highlighted option should be the last choice pill in the list');
  });
  click(textField);
  andThen(function() {
    return validateDropdownVisible('Dropdown list should appear after clicking on the input field');
  });
  pressEnter(multiSelectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-search-choice', multiSelectComponent);
    return assert.equal(resultItems.length, 2, 'There should be 2 selected items');
  });
  pressBackspace(textField);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-search-choice', multiSelectComponent);
    assert.equal(resultItems.length, 1, 'There should be 1 selected item after deleting one');
    return validateTextFieldFocus('Dropdown list should still be shown after deleting using keyboard', 'Text field should be focused after pressing delete');
  });
  pressSpacebar(multiSelectComponent);
  andThen(function() {
    return validateDropdownVisible('Dropdown list should appear after pressing Spacebar');
  });
  click('.ember-select-result-item:eq(0)', multiSelectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-search-choice', multiSelectComponent);
    assert.equal(resultItems.length, 2, 'There should be 2 selected items after selecting one item using mouse');
    return validateTextFieldFocus('Text field should be focused after selecting using mouse');
  });
  click('.ember-select-search-choice-close:eq(0)', multiSelectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-search-choice', multiSelectComponent);
    assert.equal(resultItems.length, 1, 'There should be 1 selected item after deleting one item using mouse');
    return validateTextFieldFocus('Text field should be focused after deleting using mouse');
  });
  keyEvent(multiSelectComponent, 'keydown', 97);
  andThen(function() {
    return validateDropdownVisible('Dropdown list should appear after pressing a letter');
  });
  pressEsc(multiSelectComponent);
  return andThen(function() {
    return validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
  });
});

test("Multi select component has correct CSS classes", function(assert) {
  multiSelect = this.subject({
    classNames: 'some-class-name'
  });
  return assert.deepEqual(multiSelect.get("classNames"), ["ember-view", "ember-select", "some-class-name"]);
});

test("Can add item via click", function(assert) {
  var $multiSelect;
  assert.expect(2);
  multiSelect = this.subject({
    content: content,
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'some-class-name'
  });
  this.append();
  $multiSelect = find('.some-class-name');
  return selectInMultiChosen($multiSelect, 'Alice').then(function() {
    $multiSelect = find('.some-class-name');
    assert.equal($multiSelect.find('.ember-select-search-choice').length, 1, "one item is now selected");
    return assert.ok($multiSelect.find('.ember-select-search-choice').text().indexOf('Alice') >= 0, "Alice was selected");
  });
});

test("Invalid item cannot be selected", function(assert) {
  var $multiSelect, item, userDidSelectStub;
  assert.expect(2);
  multiSelect = this.subject({
    content: content,
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'some-class-name'
  });
  this.append();
  $multiSelect = find('.some-class-name');
  userDidSelectStub = sinon.stub(multiSelect, 'userDidSelect');
  return item = findInMultiChosen($multiSelect, 'textThatWontMatch').then(function(item) {
    var enterEvent;
    assert.ok(isNotPresent(item), 'List item was matched unassert.expectedly');
    enterEvent = Ember.$.Event('keyPressed', {
      keyCode: 13
    });
    return multiSelect.enterPressed(enterEvent);
  }).then(function() {
    return assert.equal(userDidSelectStub.callCount, 0, "userDidSelect should not have been called, but was called " + userDidSelectStub.callCount);
  });
});

test("Valid item can be selected via enter", function(assert) {
  var $multiSelect, item, userDidSelectStub;
  assert.expect(2);
  multiSelect = this.subject({
    content: content,
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'some-class-name'
  });
  this.append();
  $multiSelect = find('.some-class-name');
  userDidSelectStub = sinon.stub(multiSelect, 'userDidSelect');
  return item = findInMultiChosen($multiSelect, 'Alice').then(function(item) {
    var enterEvent;
    assert.ok(isPresent(item), 'List item was not matched');
    enterEvent = Ember.$.Event('keyPressed', {
      keyCode: 13
    });
    return multiSelect.enterPressed(enterEvent);
  }).then(function() {
    return assert.equal(userDidSelectStub.callCount, 1, "userDidSelect should have been called once, but was called " + userDidSelectStub.callCount);
  });
});
