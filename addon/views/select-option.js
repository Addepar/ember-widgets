import Ember from 'ember';

const { get } = Ember;

// The view for each item in the select.
export default Ember.View.extend({
  tagName: 'li',
  templateName: 'select-item',
  layoutName: 'select-item-layout',
  classNames: 'ember-select-result-item',
  classNameBindings: Ember.A(['content.isGroupOption:ember-select-group', 'isHighlighted:highlighted']),
  isHighlighted: Ember.computed(function() {
    return this.get('highlighted') === this.get('content');
  }).property('highlighted', 'content'),
  labelPathDidChange: Ember.on('init', Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('labelPath');

    // if it is a raw string, the path is just the context
    // if labelPath is specified, the path should be context.labelPath
    path = labelPath ? "content." + labelPath : 'content';

    // We are creating a computed property called label that is an alias of
    // 'context.#{labelPath}'
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    return this.notifyPropertyChange('label');
  }, 'content', 'labelPath')),
  processDropDownShown: function() {
    return this.get('selectComponent').send('hideDropdown');
  },
  didInsertElement: function() {
    this._super();
    return this.labelPathDidChange();
  },

  // TODO(Peter): This is a hack. Some computed don't fire properly if
  // they are dependent on the context. e.g. isHighlighted may not update
  // if it is dependent on the context. This seems to fix the issue
  updateContext: function(context) {
    this._super(context);
    return this.set('content', context);
  },
  click: function() {
    let selection = this.get('content');
    if (get(selection, 'isGroupOption')) {
      return;
    }
    this.set('selectComponent.selection', selection);
    this.get('selectComponent').userDidSelect(selection);
    // if there's a selection and the dropdown is unexpanded, we want to
    // propagate the click event
    // if the dropdown is expanded and we select something, don't propagate
    if (this.get('showDropdown')) {
      this.processDropDownShown();
      return false;
    }
  },
  mouseEnter: function() {
    if (this.get('content.isGroupOption')) {
      return;
    }
    return this.set('highlighted', this.get('content'));
  }
});
