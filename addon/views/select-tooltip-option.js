import Ember from 'ember';
import SelectOption from './select-option';

export default SelectOption.extend({
  attributeBindings: ['contentLabel:title'],
  contentLabel: Ember.computed(function() {
    var labelPath;
    labelPath = this.get('labelPath');
    return this.get("content." + labelPath);
  }).property('content', 'labelPath')
});
