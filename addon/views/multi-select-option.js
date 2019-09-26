import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'li',
  templateName: 'multi-select-item',
  classNames: 'ember-select-search-choice',
  didInsertElement: function() {
    this._super();
    this.labelPathDidChange();
  },
  labelPathDidChange: Ember.observer('content', 'labelPath', function() {
    var labelPath, path;
    labelPath = this.get('labelPath');
    path = labelPath ? "content." + labelPath : 'content';
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    this.notifyPropertyChange('label');
  })
});
