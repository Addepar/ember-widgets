import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'editable-label',
  classNames: ['editable-label'],
  placeholder: '',
  isEditing: false,
  value: null,
  displayName: Ember.computed(function() {
    if (Ember.isNone(this.get('value')) || this.get('value') === '') {
      return this.get('placeholder');
    } else {
      return this.get('value');
    }
  }).property('value', 'placeholder'),
  innerTextField: Ember.TextField.extend({
    valueBinding: Ember.Binding.oneWay('parentView.value'),
    didInsertElement: function() {
      return this.$().focus();
    },
    blur: function() {
      this.set('parentView.isEditing', false);
      return this.set('parentView.value', this.get('value'));
    }
  }),
  editLabel: function() {
    return this.set('isEditing', true);
  }
});
