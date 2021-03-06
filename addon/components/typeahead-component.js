import Ember from 'ember';
import SelectComponent from './select-component';

export default SelectComponent.extend({
  layoutName: 'typeahead',
  searchFieldClass: 'form-control',
  disabled: false,
  listViewPartial: 'typeahead-list-view-partial',

  searchView: Ember.TextField.extend({
    class: 'ember-select-input',
    placeholderBinding: 'selectComponent.placeholder',
    valueBinding: 'selectComponent.query',
    focusIn() {
      this.set('selectComponent.showDropdown', true);
    }
  }),

  /**
   * An optional view to be displayed in the typeahead dropdown below the list
   * of options
   * @type {String}
   */
  footerView: null,

  userDidSelect(selection) {
    this._super(selection);
    this.set('query', selection);
  }
});
