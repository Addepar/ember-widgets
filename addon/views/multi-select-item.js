import SelectOption from './select-option';

export default SelectOption.extend({
  processDropDownShown: function() {
    this._super();
    return this.get('selectComponent').focusTextField();
  }
});
