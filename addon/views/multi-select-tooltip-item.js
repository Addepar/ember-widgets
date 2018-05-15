import SelectTooltipOption from './select-tooltip-option';

export default SelectTooltipOption.extend({
  processDropDownShown: function() {
    this._super();
    return this.get('selectComponent').focusTextField();
  }
});
