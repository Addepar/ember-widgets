import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import {
  isPresent,
  isNotPresent,
  isVisible,
  isHidden,
  isFocused
} from '../helpers/assertions';

import {
  pressEnter,
  pressDownArrow,
  pressUpArrow,
  pressEsc
} from '../helpers/keyboard';

import {
  openDropdown
} from '../helpers/select';



var select, app;

var emptyContentSelector, noResultSelector, select;

emptyContentSelector = '.ember-select-empty-content';

noResultSelector = '.ember-select-no-results';

function getOptionSelector(selection) {
  return `.ember-select-results .ember-select-result-item:contains(${selection})`;
}

moduleForComponent('select-component', '[Integration] Select component', {
  needs: [
    'template:select',
    'template:select-item',
    'template:select-item-layout',
    'template:select-list-view-partial'
  ],

  setup: function() {
    app = startApp();
  },

  teardown: function() {
    Ember.run(function() {
      return select.destroy();
    });
    Ember.run(app, 'destroy');
    select = null;
  }
});

test('Test continuous queries in a row', function() {
  expect(5);
  select = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  select.set('query', 'ba');
  equal(select.get('filteredContent')[0], 'bar');
  equal(select.get('filteredContent')[1], 'barca');
  equal(select.get('filteredContent')[2], 'baz');
  select.set('query', 'bar');
  equal(select.get('filteredContent')[0], 'bar');
  return equal(select.get('filteredContent')[1], 'barca');
});

test('Test filtered content using array proxy', function() {
  var data;
  expect(2);
  data = Ember.ArrayProxy.create({
    content: Ember.A(['red', 'reddit', 'green', 'blue'])
  });
  select = this.subject({
    content: data
  });
  select.set('query', 're');
  equal(select.get('filteredContent')[0], 'red');
  return equal(select.get('filteredContent')[1], 'reddit');
});

test('Test sorted filter content', function() {
  expect(3);
  select = this.subject({
    content: ['reddit', 'red', 'green', 'blue']
  });
  select.set('query', 'r');
  equal(select.get('sortedFilteredContent')[0], 'green');
  equal(select.get('sortedFilteredContent')[1], 'red');
  return equal(select.get('sortedFilteredContent')[2], 'reddit');
});

test('Test keyboard interaction', function() {
  var selectComponent, selectedText, validateDropdownHidden, validateDropdownVisible, validateFocus;
  expect(10);
  selectedText = null;
  select = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  this.append();
  selectComponent = select.$();
  validateDropdownVisible = function(messageVisible) {
    return ok(isVisible('.ember-select-results', selectComponent), messageVisible);
  };
  validateDropdownHidden = function(messageHidden) {
    return ok(isHidden('.ember-select-results', selectComponent), messageHidden);
  };
  validateFocus = function(messageFocus) {
    return ok(isFocused(selectComponent, selectComponent), messageFocus);
  };
  validateDropdownHidden('Dropdown list should not exist at the beginning');
  selectComponent.focus();
  pressEnter(selectComponent);
  andThen(function() {
    return validateDropdownVisible('Dropdown list should appear after pressing Enter');
  });
  pressDownArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    return ok($(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted');
  });
  pressUpArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
    return selectedText = $(resultItems[0]).text();
  });
  pressEnter(selectComponent);
  andThen(function() {
    var currentText, resultItems;
    validateFocus('Select component should be focused after selecting one option');
    validateDropdownHidden('Dropdown list should be hidden after selecting an option');
    resultItems = find('.ember-select-result-item', selectComponent);
    currentText = $(resultItems[0]).text();
    return equal(selectedText, find('.ember-select-result-item:eq(0)', selectComponent).text(), 'The selected item is not the one was Enter pressed');
  });
  keyEvent(selectComponent, 'keydown', 97);
  andThen(function() {
    return validateDropdownVisible('Dropdown list should appear after pressing a letter');
  });
  pressEsc(selectComponent);
  return andThen(function() {
    validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
    return validateFocus('Select component should be focused after pressing ESC');
  });
});

test('Test userSelected action', function() {
  var selectElement, spy;
  expect(3);
  select = this.subject({
    content: ['bar', 'baz']
  });
  spy = sinon.spy(select, "sendAction");
  this.append();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when first open the dropdown');
    return spy.reset();
  });
  click('li:eq(0)', '.ember-select-results');
  andThen(function() {
    ok(spy.calledWithExactly('userSelected', 'bar'), 'userSelected action is fired when select one item in the dropdown');
    return spy.reset();
  });
  click('.ember-select-result-item', '.dropdown-toggle');
  return andThen(function() {
    return ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when click on the dropdown containing highlighted item');
  });
});

test('Test selection label', function() {
  var data;
  expect(2);
  data = [
    {
      name: 'reddit'
    }, {
      name: 'red'
    }
  ];
  select = this.subject({
    content: data,
    selection: data[0],
    optionLabelPath: 'name'
  });
  equal(select.get('selectedLabel'), 'reddit');
  select.set('selection.name', 'blues');
  return equal(select.get('selectedLabel'), 'blues');
});

test('Test query matching', function() {
  expect(8);
  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', 'baz']
  });
  select.set('query', null);
  equal(select.get('filteredContent').length, 4, 'null queries should return the full list of options');
  select.set('query', '   ');
  equal(select.get('filteredContent').length, 4, 'queries containing all spaces should return the full list of options');
  select.set('query', ' a ');
  equal(select.get('filteredContent').length, 3, 'queries containing spaces at two ends should be trimmed');
  select.set('query', 'bar  ca');
  equal(select.get('filteredContent').length, 1, 'queries containing duplicated spaces should be removed');
  select.set('query', 'barca');
  equal(select.get('filteredContent').length, 0, 'correct spaces should be considered when matching');
  select.set('query', 'bana$');
  equal(select.get('filteredContent').length, 1, 'special characters should be considered when matching');
  select.set('query', 'bana[  na');
  equal(select.get('filteredContent').length, 0, 'special characters should be considered when matching');
  select.set('query', 'bana$ n');
  return equal(select.get('filteredContent').length, 1, 'duplicated spaces in the source string should be removed before matching');
});

test("Show empty content view if content is empty", function() {
  var EmptyContentView, selectElement;
  expect(5);
  EmptyContentView = Ember.View.extend({
    layout: Ember.Handlebars.compile("<div class='empty-content-view'>No Content</div>")
  });
  select = this.subject({
    content: [],
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'select-class-name'
  });
  this.append();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    ok(isPresent(emptyContentSelector, selectElement), 'Empty content block displayed');
    ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view not displayed before specified');
    return ok(isNotPresent(noResultSelector, selectElement), '"No result" message not displayed');
  });
  andThen(function() {
    return Ember.run(function() {
      return select.set('emptyContentView', EmptyContentView);
    });
  });
  andThen(function() {
    return ok(isPresent('.empty-content-view', selectElement), 'Empty content view displayed');
  });
  andThen(function() {
    return Ember.run(function() {
      return select.set('emptyContentView', null);
    });
  });
  return andThen(function() {
    return ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view no longer displayed');
  });
});

test("Show no-result message if has content but filtered content is empty", function() {
  var data, selectElement;
  expect(2);
  data = [
    {
      name: 'reddit'
    }, {
      name: 'red'
    }
  ];
  select = this.subject({
    content: data,
    query: 'Non-existing Name',
    optionLabelPath: 'name',
    classNames: 'select-class-name'
  });
  this.append();
  selectElement = select.$();
  openDropdown(selectElement);
  return andThen(function() {
    ok(isNotPresent(emptyContentSelector, selectElement), 'Empty content block not displayed');
    return ok(isPresent(noResultSelector, selectElement), '"No result" message displayed');
  });
});

test('optionValuePath with POJOs', function() {
  var data, obj1, obj2;
  expect(1);
  obj1 = {
    name: 'reddit',
    value: 1
  };
  obj2 = {
    name: 'red',
    value: 2
  };
  data = [obj1, obj2];
  select = this.subject({
    content: data,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.append();
  Ember.run(function() {
    select.set('value', 2);
  });
  wait();
  equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with Ember Objects', function() {
  var Klass, data, obj1, obj2;
  expect(1);
  Klass = Ember.Object.extend({
    name: null,
    value: null
  });
  obj1 = Klass.create({
    name: 'reddit',
    value: 1
  });
  obj2 = Klass.create({
    name: 'red',
    value: 2
  });
  data = [obj1, obj2];
  select = this.subject({
    content: data,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.append();
  Ember.run(function() {
    return select.set('value', 2);
  });
  return equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with ArrayProxy', function() {
  var Klass, arrData, data, obj1, obj2;
  expect(1);
  Klass = Ember.Object.extend({
    name: null,
    value: null
  });
  obj1 = Klass.create({
    name: 'reddit',
    value: 1
  });
  obj2 = Klass.create({
    name: 'red',
    value: 2
  });
  data = [obj1, obj2];
  arrData = Ember.ArrayProxy.create({
    content: Ember.A(data)
  });
  select = this.subject({
    content: arrData,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.append();
  Ember.run(function() {
    return select.set('value', 2);
  });
  return equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with nested valuePath', function() {
  var data, obj1, obj2, value1;
  expect(1);
  value1 = Ember.Object.create();
  value1.set('subvalue', 1);
  obj1 = {
    name: 'reddit',
    value: value1
  };
  obj2 = {
    name: 'red',
    value: {
      subvalue: 2
    }
  };
  data = [obj1, obj2];
  select = this.subject({
    content: Ember.A(data),
    optionLabelPath: 'name',
    optionValuePath: 'value.subvalue'
  });
  this.append();
  Ember.run(function() {
    return select.set('value', 2);
  });
  return equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('shouldEnsureVisible controls whether to ensure visibility', function() {
  var spy;
  expect(2);
  select = this.subject({
    content: ['foo'],
    ensureVisible: function() {
      return ok(true, 'ensureVisible is called if shouldEnsureVisible is true');
    }
  });
  select.set('highlighted', 'foo');
  select.set('shouldEnsureVisible', false);
  spy = sinon.spy(select, 'ensureVisible');
  select.set('highlighted', 'bar');
  equal(spy.callCount, 0, 'ensureVisible is not called if shouldEnsureVisible is false');
  return spy.restore();
});

test('Specified dropdownMenuClass is used when the dropdown is opened', function(assert) {
  assert.expect(1);

  var cssClassName = 'test-class';
  select = this.subject({
    content: ['dummy data'],
    dropdownMenuClass: cssClassName
  });
  this.append();
  var selectElement = select.$();
  openDropdown(selectElement);
  return andThen(function() {
    var expectedClass = '.' + cssClassName;
    return ok(isPresent(expectedClass, selectElement),
      'The specified dropdownMenuClass is present');
  });
});

test('Can specify a custom partial with listViewPartial', function(assert) {
  assert.expect(1);

  var compiledTemplate = Ember.Handlebars.
    compile('<div class="dummy-class-for-partial-list"></div>{{partial "select-list-view-partial"}}');
  this.container.register('template:custom-list-view-partial', compiledTemplate);
  select = this.subject({
    content: ['dummy data'],
    listViewPartial: 'custom-list-view-partial'
  });
  this.append();
  var selectElement = select.$();
  openDropdown(selectElement);
  return andThen(function() {
    var dummyClassInPartialList = '.dummy-class-for-partial-list';
    return ok(isPresent(dummyClassInPartialList, selectElement),
      'The specified listViewPartial is rendered');
  });
});

test('Select handles a change in the content array properly', function() {
  expect(2);

  var resultItemSelector = '.ember-select-result-item';
  select = this.subject({
    content: ['test content']
  });
  this.append();
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    ok(isPresent(resultItemSelector, selectElement), 'Content is displayed');
    select.set('content', []);
    select.set('content', ['test content']);
  });
  return andThen(function() {
    ok(isPresent(resultItemSelector, selectElement), 'Content is still displayed');
  });
});

test('Selected option is scrolled to when dropdown is opened', function(assert) {
  assert.expect(1);

  const selection = 'z-last-element';
  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', selection],
    selection,
    dropdownHeight: 30
  });
  this.append();
  andThen(() => {
    select.set('highlighted', selection);
  });
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(() => {
    assert.ok(isPresent(getOptionSelector(selection)),
     'The last option is displayed');
  });
});

test('Selected option is not scrolled to when shouldEnsureVisible is false', function(assert) {
  assert.expect(2);

  const selection = 'z-last-element';
  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', selection],
    selection,
    shouldEnsureVisible: false,
    dropdownHeight: 30
  });
  this.append();
  andThen(() => {
    select.set('highlighted', selection);
  });
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(() => {
    assert.ok(isPresent('.dropdown-menu'),  'Dropdown menu is displayed');
    assert.ok(isNotPresent(getOptionSelector(selection)),
     'The last option is not displayed');
  });
});
