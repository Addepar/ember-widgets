import Ember from 'ember';
import SelectComponent from './select-component';

export default SelectComponent.extend({
  layoutName: 'typeahead',
  searchFieldClass: 'form-control',
  disabled: false,

  searchView: Ember.TextField.extend({
    class: 'ember-select-input',
    placeholderBinding: 'parentView.placeholder',
    valueBinding: 'parentView.query',
    focusIn() {
      this.set('parentView.showDropdown', true);
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
    this.set('query', this.get('selection'));
  }
});
