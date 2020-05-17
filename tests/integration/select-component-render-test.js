import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
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
  openDropdown,
  getOptionSelector
} from '../helpers/select';



var select, app;

var emptyContentSelector, noResultSelector, select;

emptyContentSelector = '.ember-select-empty-content';

noResultSelector = '.ember-select-no-results';

moduleForComponent('select-component', '[Integration] Select component render', {
  needs: [
    'template:select',
    'template:select-item',
    'template:select-item-layout',
    'template:select-list-view-partial',
    'component:vertical-collection'
  ],

  setup: function() {
    app = startApp();
  },

  teardown: function() {
    Ember.run(function() {
      select.destroy();
    });
    Ember.run(app, 'destroy');
    select = null;
  }
});

test('Test keyboard interaction', function(assert) {
  var selectComponent, selectedText, validateDropdownHidden, validateDropdownVisible, validateFocus;
  assert.expect(10);
  selectedText = null;
  select = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  this.render();
  selectComponent = select.$();
  validateDropdownVisible = function(messageVisible) {
    assert.ok(isVisible('.ember-select-results', selectComponent), messageVisible);
  };
  validateDropdownHidden = function(messageHidden) {
    assert.ok(isHidden('.ember-select-results', selectComponent), messageHidden);
  };
  validateFocus = function(messageFocus) {
    assert.ok(isFocused(selectComponent, selectComponent), messageFocus);
  };
  validateDropdownHidden('Dropdown list should not exist at the beginning');
  selectComponent.focus();
  pressEnter(selectComponent);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing Enter');
  });
  pressDownArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok($(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted');
  });
  pressUpArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
    selectedText = $(resultItems[0]).text();
  });
  pressEnter(selectComponent);
  andThen(function() {
    var currentText, resultItems;
    validateFocus('Select component should be focused after selecting one option');
    validateDropdownHidden('Dropdown list should be hidden after selecting an option');
    resultItems = find('.ember-select-result-item', selectComponent);
    currentText = $(resultItems[0]).text();
    assert.equal(selectedText, find('.ember-select-result-item:eq(0)', selectComponent).text(), 'The selected item is not the one was Enter pressed');
  });
  keyEvent(selectComponent, 'keydown', 97);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing a letter');
  });
  pressEsc(selectComponent);
  andThen(function() {
    validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
    validateFocus('Select component should be focused after pressing ESC');
  });
});

test('Test query highlighting', function(assert) {
  select = this.subject({
    content: ['aaa', 'bar', 'barca', 'baz']
  });
  this.render();
  let selectComponent = select.$();
  selectComponent.focus();

  andThen(() => {
    pressEnter(selectComponent);
  });

  andThen(() => {
    assert.ok(
      isVisible('.ember-select-results', selectComponent),
      'Dropdown list should appear after pressing Enter'
    );
    let resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok(
      resultItems[0].classList.contains('highlighted'),
      'First option should be highlighted'
    );
    assert.equal(
      resultItems.length,
      4,
      'All options visible'
    );
    assert.equal(
      resultItems[0].innerText,
      'aaa',
      'First option should be the first content'
    );
  });

  fillIn($('input', selectComponent)[0], 'b');

  andThen(() => {
    let resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok(
      resultItems[0].classList.contains('highlighted'),
      'First option should be highlighted'
    );
    assert.equal(
      resultItems.length,
      3,
      'Matching options visible'
    );
    assert.equal(
      resultItems[0].innerText,
      'bar',
      'First option should be the first matching content'
    );

    select.set('content', ['a1', 'b1', 'b2']);
  });

  andThen(() => {
    let resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok(
      resultItems[0].classList.contains('highlighted'),
      'First option should be highlighted'
    );
    assert.equal(
      resultItems.length,
      2,
      'Matching options visible'
    );
    assert.equal(
      resultItems[0].innerText,
      'b1',
      'First option should be the first matching content'
    );
  });
});

test('Test userSelected action', function(assert) {
  var selectElement, spy;
  assert.expect(3);
  select = this.subject({
    content: ['bar', 'baz']
  });
  spy = sinon.spy(select, "sendAction");
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when first open the dropdown');
    spy.reset();
  });
  click('li:eq(0)', '.ember-select-results');
  andThen(function() {
    assert.ok(spy.calledWithExactly('userSelected', 'bar'), 'userSelected action is fired when select one item in the dropdown');
    spy.reset();
  });
  click('.ember-select-result-item', '.dropdown-toggle');
  andThen(function() {
    assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when click on the dropdown containing highlighted item');
  });
});

test('Test valueChanged action when dropdown is closed and query is cleared', function(assert) {
  assert.expect(1);
  select = this.subject({
    content: ['bar', 'baz']
  });
  const spy = sinon.spy(select, 'sendAction');
  this.render();

  const selectElement = select.$();
  const searchInput = find('input', selectElement);

  openDropdown(selectElement);
  fillIn(searchInput, 'bar');
  pressEsc(selectElement);

  andThen(() => {
    assert.ok(spy.calledWithExactly('valueChanged', ''), 'valueChanged is sent with empty string when query is cleared');
  });
});

test("Show empty content view if content is empty", function(assert) {
  var EmptyContentView, selectElement;
  assert.expect(5);
  EmptyContentView = Ember.View.extend({
    layout: Ember.Handlebars.compile("<div class='empty-content-view'>No Content</div>")
  });
  select = this.subject({
    content: [],
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'select-class-name'
  });
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isPresent(emptyContentSelector, selectElement), 'Empty content block displayed');
    assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view not displayed before specified');
    assert.ok(isNotPresent(noResultSelector, selectElement), '"No result" message not displayed');
  });
  andThen(function() {
    Ember.run(function() {
      select.set('emptyContentView', EmptyContentView);
    });
  });
  andThen(function() {
    assert.ok(isPresent('.empty-content-view', selectElement), 'Empty content view displayed');
  });
  andThen(function() {
    Ember.run(function() {
      select.set('emptyContentView', null);
    });
  });
  andThen(function() {
    assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view no longer displayed');
  });
});

test("Show no-result message if has content but filtered content is empty", function(assert) {
  var data, selectElement;
  assert.expect(2);
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
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isNotPresent(emptyContentSelector, selectElement), 'Empty content block not displayed');
    assert.ok(isPresent(noResultSelector, selectElement), '"No result" message displayed');
  });
});

test('optionValuePath with POJOs', function(assert) {
  var data, obj1, obj2;
  assert.expect(1);
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
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  wait().then(() => {
    assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
  });
});

test('optionValuePath with Ember Objects', function(assert) {
  var Klass, data, obj1, obj2;
  assert.expect(1);
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
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with ArrayProxy', function(assert) {
  var Klass, arrData, data, obj1, obj2;
  assert.expect(1);
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
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with nested valuePath', function(assert) {
  var data, obj1, obj2, value1;
  assert.expect(1);
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
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('Can specify a custom component with tabComponentName', function(assert) {
  assert.expect(2);
  let tabComponentName = 'tab-component';
  this.register(`component:${tabComponentName}`, Ember.Component.extend());
  this.register(
    `template:components/${tabComponentName}`,
    hbs`<div class='tab-component'>List of tabs</div>`
  );

  select = this.subject({
    content: ['dummy data'],
  });
  this.render();
  let selectElement = select.$();

  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isNotPresent('.tab-component', selectElement), 'Tab component not displayed before specified');
  });
  andThen(function() {
    Ember.run(function() {
      select.set('tabComponentName', tabComponentName);
    });
  });
  andThen(function() {
    assert.ok(isPresent('.tab-component', selectElement), 'Tab component displayed');
  });
});

test('Specified dropdownMenuClass is used when the dropdown is opened', function(assert) {
  assert.expect(1);

  var cssClassName = 'test-class';
  select = this.subject({
    content: ['dummy data'],
    dropdownMenuClass: cssClassName
  });
  this.render();
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    var expectedClass = '.' + cssClassName;
    assert.ok(isPresent(expectedClass, selectElement),
      'The specified dropdownMenuClass is present');
  });
});

test('Can specify a custom partial with listViewPartial', function(assert) {
  assert.expect(1);

  var compiledTemplate = Ember.Handlebars.
    compile('<div class="dummy-class-for-partial-list"></div>{{partial "select-list-view-partial"}}');
  this.register('template:custom-list-view-partial', compiledTemplate);
  select = this.subject({
    content: ['dummy data'],
    listViewPartial: 'custom-list-view-partial'
  });
  this.render();
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    var dummyClassInPartialList = '.dummy-class-for-partial-list';
    assert.ok(isPresent(dummyClassInPartialList, selectElement),
      'The specified listViewPartial is rendered');
  });
});

test('Select handles a change in the content array properly', function(assert) {
  assert.expect(2);

  var resultItemSelector = '.ember-select-result-item';
  select = this.subject({
    content: ['test content']
  });
  this.render();
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isPresent(resultItemSelector, selectElement), 'Content is displayed');
    select.set('content', []);
    select.set('content', ['test content']);
  });
  andThen(function() {
    assert.ok(isPresent(resultItemSelector, selectElement), 'Content is still displayed');
  });
});

test('Selected option is visible when dropdown is opened', function(assert) {
  assert.expect(1);

  const selection = 'z-last-element';
  // Set a low dropdown height to ensure that the last item is hidden
  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', selection],
    selection,
    dropdownHeight: 30
  });
  this.render();
  // The highlighted property is set when the user hovers over the select field
  // Lets programatically set it after rendering to emulate that behavior.
  andThen(() => { select.set('highlighted', selection); });
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(() => {
    assert.ok(isPresent(getOptionSelector(selection)), 'The last option is displayed');
  });
});

test('Selected object option is visible when dropdown is opened', function(assert) {
  assert.expect(1);

  const selection = {key: 'z-last-element'};
  // Set a low dropdown height to ensure that the last item is hidden
  select = this.subject({
    content: [{key: 'foo'}, {key: 'bana$  na'}, {key: 'bar ca'}, selection],
    selection,
    optionLabelPath: 'key',
    dropdownHeight: 30
  });
  this.render();
  var selectElement = select.$();
  // The highlighted property is set when the user hovers over the select field
  // Lets programatically set it after rendering to emulate that behavior.
  andThen(() => { select.set('highlighted', selection); });
  openDropdown(selectElement);
  andThen(() => {
    assert.ok(isPresent(getOptionSelector(selection.key)), 'The last option is displayed');
  });
});

test('Selected option is not visible when shouldEnsureVisible is false', function(assert) {
  assert.expect(2);

  const selection = 'z-last-element';
  // Set a low dropdown height to ensure that the last item is hidden
  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', selection],
    selection,
    shouldEnsureVisible: false,
    dropdownHeight: 30
  });
  this.render();
  // The highlighted property is set when the user hovers over the select field
  // Lets programatically set it after rendering to emulate that behavior.
  andThen(() => { select.set('highlighted', selection); });
  var selectElement = select.$();
  openDropdown(selectElement);
  andThen(() => {
    assert.ok(isPresent('.dropdown-menu'),  'Dropdown menu is displayed');
    assert.ok(isNotPresent(getOptionSelector(selection)), 'The last option is not displayed');
  });
});

test('Dropdown does not open on key event when select is disabled', function(assert) {
  assert.expect(1);

  select = this.subject({
    content: ['foo', 'bar'],
    selection: 'foo',
    disabled: true
  });
  this.render();

  var selectElement = select.$();
  selectElement.focus();
  pressDownArrow(selectElement);

  andThen(() => {
    assert.ok(isNotPresent('.ember-select-results', selectElement), 'The dropdown does not open');
  });
});
