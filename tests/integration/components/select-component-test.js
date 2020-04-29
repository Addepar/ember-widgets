import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import { click, fillIn } from '@ember/test-helpers';
import Ember from 'ember';

class SelectPageObject {
  constructor(elementLookup) {
    this.$ = elementLookup;
  }

  get selectResultsElement() {
    return this.$('.ember-select-results')[0];
  }

  get selectChoiceElement() {
    return this.$('.ember-select-choice')[0];
  }

  get contentLoadingElement() {
    return this.$('.ember-select-loading')[0];
  }

  get contentEmptyElement() {
    return this.$('.ember-select-empty-content')[0];
  }

  get noResultsElement() {
    return this.$('.ember-select-no-results')[0];
  }

  selectOptionElementContaining(content) {
    return this.$(`li:contains(${content}) div`)[0];
  }

  get selectOptionElements() {
    return this.$('.ember-select-result-item').toArray();
  }

  get selectOptionTextContents() {
    return this.selectOptionElements.map(e => e.textContent.trim());
  }

  async inputSearchText(text) {
    await fillIn(this.$('.ember-select-search > input')[0], text);
  }
}

moduleForComponent('select-component', '[Integration] Select component', {
  integration: true,

  beforeEach() {
    this.helpers = new SelectPageObject((...args) => this.$(...args));
  },
});

test('it renders collapsed, but opens to display options', async function(assert) {
  this.set('content', [
    'foo', 'bar', 'bar', 'baz'
  ]);

  await this.render(hbs`{{select-component content=content}}`);

  assert.ok(
    !this.helpers.selectResultsElement,
    'dropdown is not present on initial render'
  );

  await click(this.helpers.selectChoiceElement);

  assert.ok(
    this.helpers.selectResultsElement,
    'dropdown is present after click'
  );
});

test('it renders collapsed, but opens to display grouped options', async function(assert) {
  this.set('content', [
    {name: 'Sparrow', sound: 'Squawk'},
    {name: 'Crow', sound: 'Squawk'},
    {name: 'Dog', sound: 'bark'},
    {name: 'Wolf', sound: 'Bark'},
    {name: 'Sea Lion', sound: 'Bark'}
  ]);

  this.set('collapsedGroupHeaders', Ember.A([
    'Squawk', 'bark'
  ]));

  await this.render(hbs`
  {{select-component
      content=content
      optionLabelPath='name'
      optionValuePath='name'
      optionGroupPath='sound'
      isGroupHeaderCollapsible=true
      collapsedGroupHeaders=collapsedGroupHeaders
  }}`);

  await click(this.helpers.selectChoiceElement);

  assert.deepEqual(
    this.helpers.selectOptionTextContents,
    ['Bark', 'Sea Lion', 'Wolf', 'Squawk', 'bark'],
    'rendered content includes groups'
  );

  await click(this.helpers.selectOptionElementContaining('bark'));

  assert.deepEqual(
    this.helpers.selectOptionTextContents,
    ['Bark', 'Sea Lion', 'Wolf', 'Squawk', 'bark', 'Dog'],
    'rendered content includes expanded bark group'
  );

  await click(this.helpers.selectOptionElementContaining('Bark'));

  assert.deepEqual(
    this.helpers.selectOptionTextContents,
    ['Bark', 'Squawk', 'bark', 'Dog'],
    'rendered content collapses Bark group'
  );
});

test('It displays the specified component when componentNameForGroupTooltip is provided', async function(assert) {
  this.container.register('template:components/some-component', hbs`<span data-test-some-component>{{groupItem.name}}</span>`);

  this.set('content', [
    {name: 'Sparrow', sound: 'Squawk'},
    {name: 'Crow', sound: 'Squawk'},
    {name: 'Dog', sound: 'bark'},
    {name: 'Wolf', sound: 'Bark'},
    {name: 'Sea Lion', sound: 'Bark'}
  ]);

  await this.render(hbs`
  {{select-component
      content=content
      optionLabelPath='name'
      optionValuePath='name'
      optionGroupPath='sound'
      componentNameForGroupTooltip='some-component'
  }}`);

  await click(this.helpers.selectChoiceElement);

  let tooltipElements = this.$('[data-test-some-component]');
  assert.equal(tooltipElements.length, 3, 'the passed tooltip is rendered for each group header');
  assert.deepEqual(
    tooltipElements.toArray().map(e => e.textContent),
    ['Bark', 'Squawk', 'bark'],
    'the groupItem argument is passed'
  );
});

test(
  'It does not display loading text and does show empty content component when content is empty and loaded',
  async function(assert) {
    this.container.register('view:some-view', Ember.View.extend({ templateName: 'some-view' }));
    this.container.register('template:some-view', hbs`<span data-test-some-component>No results</span>`);

    this.set('content', []);

    await this.render(hbs`
    {{select-component
        content=content
        emptyContentView='some-view'
    }}`);

    await click(this.helpers.selectChoiceElement);

    assert.ok(!this.helpers.contentLoadingElement, 'Loading ui is not present');
    assert.ok(!!this.helpers.contentEmptyElement, 'Empty content is present');
    assert.ok(
      !!this.helpers.contentEmptyElement.querySelector('[data-test-some-component]'),
      'Empty content view is present'
    );
    assert.ok(!this.helpers.noResultsElement, 'No results message is not present');
  }
);

test(
  'It does not display loading text and does show no results message when content is non-empty and loaded',
  async function(assert) {
    this.set('content', ['foo']);

    await this.render(hbs`
    {{select-component content=content}}`);

    await click(this.helpers.selectChoiceElement);
    await this.helpers.inputSearchText('no match');

    assert.ok(!this.helpers.contentLoadingElement, 'Loading ui is not present');
    assert.ok(!this.helpers.contentEmptyElement, 'Empty content is not present');
    assert.ok(!!this.helpers.noResultsElement, 'No results message is present');
  }
);

test(
  'It does display loading text and does not show empty content component or no results message when loading',
  async function(assert) {
    await this.render(hbs`
    {{select-component
        isLoading=true
    }}`);

    await click(this.helpers.selectChoiceElement);

    assert.ok(!!this.helpers.contentLoadingElement, 'Loading ui is present');
    assert.ok(!this.helpers.contentEmptyElement, 'Empty content is not present');
    assert.ok(!this.helpers.noResultsElement, 'No results message is not present');
  }
);
