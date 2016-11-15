import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  isPresent,
  isNotPresent,
  isVisible,
  isHidden,
  isFocused
} from '../helpers/assertions';

var select = null;

moduleForComponent('select-component', '[Integration] SelectGroup component', {
  integration: true,
  teardown: function() {
    Ember.run( function() {
      select.destroy();
    });
    select = null;
  }
});

test('Test keyboard interaction', function(assert) {
  assert.expect(10);

  var $selectComponent, selectedText, validateDropdownHidden, validateDropdownVisible, validateFocus;
  selectedText = null;

  this.set('content', ['foo', 'bar', 'barca', 'baz'])
  this.render(hbs`
    {{select-component content=content}}
  `);
  $selectComponent = this.$();

  validateDropdownVisible = function(messageVisible) {
    assert.ok(isVisible(find('.ember-select-results', $selectComponent)), messageVisible);
  };
  validateDropdownHidden = function(messageHidden) {
    assert.ok(isHidden(find('.ember-select-results', $selectComponent)), messageHidden);
  };
  validateFocus = function(messageFocus) {
    assert.ok(isFocused($selectComponent, $selectComponent), messageFocus);
  };

  validateDropdownHidden('Dropdown list should not exist at the beginning');
  this.$().focus();
  pressEnter($selectComponent);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing Enter');
  });

  pressDownArrow($selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', $selectComponent);
    assert.ok($(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted');
  });

  pressUpArrow($selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', $selectComponent);
    assert.ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
    selectedText = $(resultItems[0]).text();
  });

  pressEnter($selectComponent);
  andThen(function() {
    var currentText, resultItems;
    validateFocus('Select component should be focused after selecting one option');
    validateDropdownHidden('Dropdown list should be hidden after selecting an option');
    resultItems = find('.ember-select-result-item', $selectComponent);
    currentText = $(resultItems[0]).text();
    assert.equal(selectedText, find('.ember-select-result-item:eq(0)', $selectComponent).text(),
                 'The selected item is not the one was Enter pressed');
  });

  keyEvent($selectComponent, 'keydown', 97);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing a letter');
  });

  pressESC($selectComponent);
  andThen(function() {
    validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
    validateFocus('Select component should be focused after pressing ESC');
  });
});

test('Test userSelected action', function(assert) {
  assert.expect(3);

  var selectElement, spy;
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

test("Show empty content view if content is empty", function(assert) {
  assert.expect(5);

  var EmptyContentView, selectElement;
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
  assert.expect(2);

  var selectElement;
  var data = [
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
