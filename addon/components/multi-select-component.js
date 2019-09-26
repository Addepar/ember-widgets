import Ember from 'ember';
import SelectComponent from './select-component';
import MultiSelectOptionView from '../views/multi-select-option';
import MultiSelectItemView from '../views/multi-select-item';
import MultiSelectTooltipItemView from '../views/multi-select-tooltip-item';

/**
 * @augments SelectGroup
 * @augments Ember.Component
*/
export default SelectComponent.extend({
  layoutName: 'multi-select',
  selections: void 0,
  choicesFieldClass: '',
  placeholder: void 0,
  persistentPlaceholder: '',
  resetQueryOnSelect: true,
  showTooltip: true,
  tooltipItemViewClass: MultiSelectTooltipItemView,
  originalItemViewClass: MultiSelectItemView,
  // disable tabindex of the component container to set focus directly to
  // the input field, which is always visible. This helps reducing one tab
  // step to navigate back to the previous component
  tabindex: -1,
  values: Ember.computed('selections.[]', {
    set(key, value) {
      var selections, valuePath;
      if (!value) {
        return;
      }
      valuePath = this.get('optionValuePath');
      this.set('selections', Ember.A(this.get('content').filter(function(item) {
        return value.contains(Ember.get(item, valuePath));
      })));
      return value;
    },
    get() {
      var selections, valuePath;
      valuePath = this.get('optionValuePath');
      selections = this.get('selections');
      if (valuePath) {
        return selections.getEach(valuePath);
      } else {
        return selections;
      }
    }
  }),
  selectionItemView: MultiSelectOptionView,

  // Invisible span used to make sure there is a good amount of room for either
  // the placeholder values, or for the query the user has entered.
  invisiblePlaceholderText: Ember.computed(function() {
    if (this.get('query')) {
      return this.get('query');
    }
    if (this.get('selections.length')) {
      return this.get('persistentPlaceholder');
    }
    return this.get('placeholder') || this.get('persistentPlaceholder');
  }).property('query', 'placeholder', 'persistentPlaceholder', 'selections.length'),

  searchView: Ember.TextField.extend({
    "class": 'ember-select-input',
    valueBinding: 'selectComponent.query',
    placeholder: Ember.computed(function() {
      if (this.get('selectComponent.selections.length')) {
        return this.get('selectComponent.persistentPlaceholder');
      }
      return this.get('selectComponent.placeholder') || this.get('selectComponent.persistentPlaceholder');
    }).property('selectComponent.placeholder', 'selectComponent.persistentPlaceholder', 'selectComponent.selections.length'),
    click: function() {
      return this.set('selectComponent.showDropdown', true);
    }
  }),

  // the list of content that is filtered down based on the query entered
  // in the textbox
  // Other than observing the changes on each elements, we need to observe the
  // `filteredContent`, and `sortedFilteredContent` because when the `content`
  // is overridden by a DS.PromiseArray, somehow it never triggers this function
  preparedContent: Ember.computed(function() {
    var content, selections, basedArray;
    content = this.get('content');
    selections = this.get('selections');
    if (!(content && selections)) {
      return Ember.A([]);
    }
    // excludes items that are already selected
    var emberArray = Ember.A();
    var sortFn = function(item) {
      return !emberArray.contains.call(selections, item);
    };
    if (this.get('sortLabels')) {
      basedArray = this.get('sortedFilteredContent');
    } else {
      basedArray = this.get('filteredContent');
    }
    return emberArray.filter.call(basedArray, sortFn);
  }).property('content.[]', 'filteredContent.[]', 'sortedFilteredContent.[]', 'selections.[]', 'sortLabels', 'filteredContent', 'sortedFilteredContent'),

  // uses single select's "selection" value - adds it to selections and
  // then clears the selection value so that it can be re-selected
  selectionDidChange: Ember.observer('selection', 'selections.[]', function() {
    var selection, selections;
    selections = this.get('selections');
    selection = this.get('selection');
    if (this.get('resetQueryOnSelect')) {
      this.set('query', '');
    }
    this.set('selection', null);
    if (!Ember.isEmpty(selection) && !selections.contains(selection)) {
      return selections.pushObject(selection);
    }
  }),
  focusTextField: function() {
    var ref;
    return (ref = this.$('.ember-text-field')) != null ? ref.focus() : void 0;
  },
  didInsertElement: function() {
    // We want to initialize selections to []. This SHOULD NOT be done through
    // computed properties, because we would run into the following situation.
    // If the user do selectionsBinding and whatever we are binded to is
    // undefined then, selections is initialized as undefined. We could change
    // the value to [] if its value is undefined but the bindings would not have
    // realized a change and fail to fire.
    this._super();
    if (!this.get('selections')) {
      this.set('selections', Ember.A([]));
    }
    if (!this.get('values')) {
      return this.set('values', Ember.A([]));
    }
  },
  deletePressed: function(event) {
    if (event.target.selectionStart === 0 && event.target.selectionEnd === 0) {
      this.removeSelectItem(this.get('selections.lastObject'));
      return event.preventDefault();
    }
  },
  removeSelectItem: function(item) {
    // set the focus back to the searchView because this item will be removed
    var dropdownIsShowing;
    dropdownIsShowing = this.get('showDropdown');
    this.focusTextField();
    if (!dropdownIsShowing) {
      this.send('hideDropdown');
    }
    return this.get('selections').removeObject(item);
  },
  escapePressed: function(event) {
    if (this.get('showDropdown')) {
      this.focusTextField();
      this.send('hideDropdown');
      return event.preventDefault();
    }
  },
  enterPressed: function(event) {
    this._super(event);
    return this.focusTextField();
  },
  actions: {
    removeSelectItem: function(item) {
      return this.removeSelectItem(item);
    }
  }
});
